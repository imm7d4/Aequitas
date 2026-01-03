package services

import (
	"errors"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type TradingAccountService struct {
	repo   *repositories.TradingAccountRepository
	txRepo *repositories.TransactionRepository
}

func NewTradingAccountService(repo *repositories.TradingAccountRepository, txRepo *repositories.TransactionRepository) *TradingAccountService {
	return &TradingAccountService{
		repo:   repo,
		txRepo: txRepo,
	}
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

// FundAccount adds simulated funds to the user's trading account
func (s *TradingAccountService) FundAccount(userID string, amount float64) (*models.TradingAccount, error) {
	if amount <= 0 {
		return nil, errors.New("amount must be greater than zero")
	}

	account, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	if account == nil {
		return nil, errors.New("trading account not found")
	}

	// Update balance
	newBalance := account.Balance + amount
	err = s.repo.UpdateBalance(account.ID, newBalance)
	if err != nil {
		return nil, err
	}

	// Create transaction record
	tx := &models.Transaction{
		AccountID: account.ID,
		UserID:    account.UserID,
		Type:      "DEPOSIT",
		Amount:    amount,
		Currency:  account.Currency,
		Status:    "COMPLETED",
		Reference: "SIMULATED_DEPOSIT",
	}
	_, _ = s.txRepo.Create(tx)

	account.Balance = newBalance
	return account, nil
}

// GetTransactions retrieves the transaction history for a user
func (s *TradingAccountService) GetTransactions(userID string) ([]*models.Transaction, error) {
	account, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}
	if account == nil {
		return nil, errors.New("trading account not found")
	}

	return s.txRepo.FindByAccountID(account.ID.Hex())
}
