package services

import (
	"errors"
	"fmt"
	"time"

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
		// Lazily create account if it doesn't exist (US-0.1.2)
		// This handles legacy users or registration failures
		return s.CreateForUser(userID)
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
		// If no account exists, user has no transactions
		return []*models.Transaction{}, nil
	}

	return s.txRepo.FindByAccountID(account.ID.Hex())
}

// SettleTrade updates the balance and creates a transaction for a filled trade
func (s *TradingAccountService) SettleTrade(userID string, netAmount float64, tradeID string, side string) error {
	account, err := s.repo.FindByUserID(userID)
	if err != nil {
		return err
	}
	if account == nil {
		return errors.New("trading account not found")
	}

	var newBalance float64
	if side == "BUY" {
		// Net value for BUY includes fees, so we deduct the full amount
		newBalance = account.Balance - netAmount
	} else {
		// Net value for SELL is after deducting fees, so we add the remaining amount
		newBalance = account.Balance + netAmount
	}

	if newBalance < 0 {
		return errors.New("insufficient balance for settlement")
	}

	err = s.repo.UpdateBalance(account.ID, newBalance)
	if err != nil {
		return err
	}

	// Calculate signed amount for transaction record
	var signedAmount float64
	if side == "BUY" {
		signedAmount = -netAmount
	} else {
		signedAmount = netAmount
	}

	// Create transaction record
	tx := &models.Transaction{
		AccountID: account.ID,
		UserID:    account.UserID,
		Type:      "TRADE",
		Amount:    signedAmount,
		Currency:  account.Currency,
		Status:    "COMPLETED",
		Reference: fmt.Sprintf("TRADE_%s", tradeID),
	}
	_, _ = s.txRepo.Create(tx)

	return nil
}

// UpdateRealizedPL adds the profit/loss from a closed trade to the total realized P&L
func (s *TradingAccountService) UpdateRealizedPL(userID string, amount float64) error {
	account, err := s.repo.FindByUserID(userID)
	if err != nil {
		return err
	}
	if account == nil {
		return errors.New("account not found")
	}

	account.RealizedPL += amount
	account.UpdatedAt = time.Now()

	// Using UpdateBalance conceptually or need full Update?
	// Repo has UpdateBalance. Let's check if it has generic Update.
	// We use repo.Update(account).
	_, err = s.repo.Update(account)
	return err
}

// BlockMargin locks funds for short positions
func (s *TradingAccountService) BlockMargin(userID string, amount float64) error {
	account, err := s.repo.FindByUserID(userID)
	if err != nil {
		return err
	}
	if account == nil {
		return errors.New("account not found")
	}

	available := account.Balance - account.BlockedMargin
	if available < amount {
		return errors.New("insufficient available funds to block margin")
	}

	account.BlockedMargin += amount
	account.UpdatedAt = time.Now()

	_, err = s.repo.Update(account)
	return err
}

// ReleaseMargin unlocks funds when short positions are covered
func (s *TradingAccountService) ReleaseMargin(userID string, amount float64) error {
	account, err := s.repo.FindByUserID(userID)
	if err != nil {
		return err
	}
	if account == nil {
		return errors.New("account not found")
	}

	// Ensure we don't release more than blocked (with some tolerance for floating point)
	if account.BlockedMargin < amount-0.01 {
		return fmt.Errorf("cannot release %.2f, only %.2f blocked", amount, account.BlockedMargin)
	}

	account.BlockedMargin -= amount
	if account.BlockedMargin < 0 {
		account.BlockedMargin = 0
	}
	account.UpdatedAt = time.Now()

	_, err = s.repo.Update(account)
	return err
}
