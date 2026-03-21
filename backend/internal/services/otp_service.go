package services

import (
	"crypto/rand"
	"errors"
	"math/big"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OTPService struct {
	repo *repositories.OTPRepository
}

func NewOTPService(repo *repositories.OTPRepository) *OTPService {
	return &OTPService{repo: repo}
}

// GenerateOTP creates a 6-digit code, hashes it, and saves it
func (s *OTPService) GenerateOTP(userID primitive.ObjectID, purpose models.OTPPurpose) (string, error) {
	// Generate 6-digit random code
	code, err := s.generateRandomCode(6)
	if err != nil {
		return "", err
	}

	// Hash the code
	hash, err := utils.HashPassword(code)
	if err != nil {
		return "", err
	}

	// Clean up old OTPs for this user/purpose
	_ = s.repo.DeleteAllForUser(userID.Hex(), purpose)

	// Save to DB
	record := &models.OTPRecord{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		Purpose:   purpose,
		CodeHash:  hash,
		ExpiresAt: time.Now().Add(5 * time.Minute),
	}

	err = s.repo.Create(record)
	if err != nil {
		return "", err
	}

	return code, nil
}

// VerifyOTP checks if the provided code matches the latest hash for the user
func (s *OTPService) VerifyOTP(userID primitive.ObjectID, purpose models.OTPPurpose, code string) (bool, error) {
	record, err := s.repo.FindLatest(userID.Hex(), purpose)
	if err != nil {
		return false, err
	}
	if record == nil {
		return false, errors.New("OTP expired or not found")
	}

	// Validate code against hash
	if !utils.CheckPassword(code, record.CodeHash) {
		return false, nil
	}

	// One-time use: delete after successful verification
	_ = s.repo.DeleteAllForUser(userID.Hex(), purpose)
	return true, nil
}

// GenerateEmailOTP creates a 6-digit code for an email (unregistered users)
func (s *OTPService) GenerateEmailOTP(email string, purpose models.OTPPurpose) (string, error) {
	code, err := s.generateRandomCode(6)
	if err != nil {
		return "", err
	}

	hash, err := utils.HashPassword(code)
	if err != nil {
		return "", err
	}

	_ = s.repo.DeleteAllByEmail(email, purpose)

	record := &models.OTPRecord{
		ID:        primitive.NewObjectID(),
		Email:     email,
		Purpose:   purpose,
		CodeHash:  hash,
		ExpiresAt: time.Now().Add(5 * time.Minute),
	}

	err = s.repo.Create(record)
	return code, err
}

// VerifyEmailOTP checks code for an email
func (s *OTPService) VerifyEmailOTP(email string, purpose models.OTPPurpose, code string) (bool, error) {
	record, err := s.repo.FindLatestByEmail(email, purpose)
	if err != nil {
		return false, err
	}
	if record == nil {
		return false, errors.New("OTP expired or not found")
	}

	if !utils.CheckPassword(code, record.CodeHash) {
		return false, nil
	}

	_ = s.repo.DeleteAllByEmail(email, purpose)
	return true, nil
}

func (s *OTPService) generateRandomCode(length int) (string, error) {
	const digits = "0123456789"
	result := make([]byte, length)
	for i := 0; i < length; i++ {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(digits))))
		if err != nil {
			return "", err
		}
		result[i] = digits[num.Int64()]
	}
	return string(result), nil
}
