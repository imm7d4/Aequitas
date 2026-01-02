package services

import (
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type TradingAccountService struct {
	repo *repositories.TradingAccountRepository
}

func NewTradingAccountService(repo *repositories.TradingAccountRepository) *TradingAccountService {
	return &TradingAccountService{repo: repo}
}

// CreateForUser creates a trading account for a user (US-0.1.2)
func (s *TradingAccountService) CreateForUser(userID string) (*models.TradingAccount, error) {
	// Check if account already exists
	existing, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("trading account already exists for this user")
	}

	// Convert userID to ObjectID
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, errors.New("invalid user ID")
	}

	// Create trading account with defaults
	account := &models.TradingAccount{
		UserID:   objectID,
		Balance:  0.0,
		Currency: "INR",
		Status:   "ACTIVE",
	}

	return s.repo.Create(account)
}

// GetByUserID retrieves a trading account by user ID
func (s *TradingAccountService) GetByUserID(userID string) (*models.TradingAccount, error) {
	account, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	if account == nil {
		return nil, errors.New("trading account not found")
	}
	return account, nil
}
