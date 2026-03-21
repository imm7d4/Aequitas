package services

import (
	"errors"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/utils"
	"fmt"
)

type UserService struct {
	userRepo    *repositories.UserRepository
	otpService  *OTPService
	commService CommunicationProvider
}

func NewUserService(
	userRepo *repositories.UserRepository,
	otpService *OTPService,
	commService CommunicationProvider,
) *UserService {
	return &UserService{
		userRepo:    userRepo,
		otpService:  otpService,
		commService: commService,
	}
}

// GetProfile retrieves a user's profile by ID
func (s *UserService) GetProfile(userID string) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}
	return user, nil
}

// UpdateProfile updates the profile information for a user
func (s *UserService) UpdateProfile(userID string, fullName, displayName, bio, avatar, phone string) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	// Update fields
	user.FullName = fullName
	user.DisplayName = displayName
	user.Bio = bio
	user.Avatar = avatar
	user.Phone = phone

	err = s.userRepo.Update(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UpdatePassword allows a user to change their password securely
func (s *UserService) UpdatePassword(userID string, currentPassword, newPassword string) error {
	if len(newPassword) < 8 {
		return errors.New("password must be at least 8 characters")
	}

	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	// Verify current password
	if !utils.CheckPassword(currentPassword, user.Password) {
		return errors.New("invalid current password")
	}

	// Hash new password
	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return errors.New("failed to hash password")
	}

	user.Password = hashedPassword
	return s.userRepo.Update(user)
}

// UpdatePreferences allows a user to customize their platform experience
func (s *UserService) UpdatePreferences(userID string, prefs models.UserPreferences) (*models.User, error) {
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("user not found")
	}

	user.Preferences = prefs
	err = s.userRepo.Update(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// UpdateOnboardingStatus updates the user's onboarding status
func (s *UserService) UpdateOnboardingStatus(userID string, complete, skipped bool) error {
	var completedAt *time.Time
	if complete {
		now := time.Now()
		completedAt = &now
	}

	return s.userRepo.UpdateOnboardingStatus(userID, complete, skipped, completedAt)
}

// InitiateEmailUpdate sends an OTP to the NEW email address
func (s *UserService) InitiateEmailUpdate(userID, currentPassword, newEmail string) error {
	if !utils.IsValidEmail(newEmail) {
		return errors.New("invalid email format")
	}

	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	// Safety check: must provide current password to change email
	if !utils.CheckPassword(currentPassword, user.Password) {
		return errors.New("invalid current password")
	}

	// Check if new email is already taken
	existing, _ := s.userRepo.FindByEmail(newEmail)
	if existing != nil {
		return errors.New("email already in use")
	}

	otp, err := s.otpService.GenerateEmailOTP(newEmail, models.OTPPurposeEmailUpdate)
	if err != nil {
		return err
	}

	subject := "Confirm Your New Email Address"
	htmlContent := fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
			<h2 style="color: #1976d2; margin-top: 0;">Email Change Request</h2>
			<p>You requested to change your Aequitas account email to this one. Please verify this change using the code below:</p>
			<div style="font-size: 32px; font-weight: bold; background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 5px; color: #1976d2; border: 1px dashed #1976d2; margin: 20px 0;">
				%s
			</div>
			<p>This code is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
			<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
			<p style="margin-bottom: 0;">Best regards,<br/><strong>The Aequitas Team</strong></p>
		</div>
	`, otp)

	return s.commService.SendEmail(newEmail, subject, htmlContent)
}

// CompleteEmailUpdate verifies the OTP and updates the email
func (s *UserService) CompleteEmailUpdate(userID, newEmail, otp string) error {
	valid, err := s.otpService.VerifyEmailOTP(newEmail, models.OTPPurposeEmailUpdate, otp)
	if err != nil {
		return err
	}
	if !valid {
		return errors.New("invalid or expired OTP")
	}

	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	user.Email = newEmail
	return s.userRepo.Update(user)
}
