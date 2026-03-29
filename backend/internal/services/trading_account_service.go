package services

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type TradingAccountService struct {
	repo         *repositories.TradingAccountRepository
	txRepo       *repositories.TransactionRepository
	userRepo     *repositories.UserRepository
	otpService   *OTPService
	jitService   *JITService
	auditService *AuditService
	commService  CommunicationProvider
}

func NewTradingAccountService(
	repo *repositories.TradingAccountRepository,
	txRepo *repositories.TransactionRepository,
	userRepo *repositories.UserRepository,
	otpService *OTPService,
	jitService *JITService,
	auditService *AuditService,
	commService CommunicationProvider,
) *TradingAccountService {
	return &TradingAccountService{
		repo:         repo,
		txRepo:       txRepo,
		userRepo:     userRepo,
		otpService:   otpService,
		jitService:   jitService,
		auditService: auditService,
		commService:  commService,
	}
}

// CreateForUser creates a trading account for a user (US-0.1.2)
func (s *TradingAccountService) CreateForUser(ctx context.Context, userID string) (*models.TradingAccount, error) {
	// Check if account already exists
	existing, err := s.repo.FindByUserID(ctx, userID)
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

	return s.repo.Create(ctx, account)
}

// GetByUserID retrieves a trading account by user ID
func (s *TradingAccountService) GetByUserID(ctx context.Context, userID string) (*models.TradingAccount, error) {
	account, err := s.repo.FindByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if account == nil {
		// Lazily create account if it doesn't exist (US-0.1.2)
		// This handles legacy users or registration failures
		return s.CreateForUser(ctx, userID)
	}
	return account, nil
}

// InitiateDeposit starts a fund transfer by creating a PENDING transaction and sending an OTP
func (s *TradingAccountService) InitiateDeposit(ctx context.Context, userID string, amount float64) (*models.Transaction, string, error) {
	if amount <= 0 {
		return nil, "", errors.New("amount must be greater than zero")
	}

	account, err := s.repo.FindByUserID(ctx, userID)
	if err != nil {
		return nil, "", err
	}
	if account == nil {
		return nil, "", errors.New("trading account not found")
	}

	// Create PENDING transaction
	tx := &models.Transaction{
		AccountID: account.ID,
		UserID:    account.UserID,
		Type:      "DEPOSIT",
		Amount:    amount,
		Currency:  account.Currency,
		Status:    "PENDING",
		Reference: "OTP_REQUIRED",
	}
	savedTx, err := s.txRepo.Create(ctx, tx)
	if err != nil {
		fmt.Printf("[Deposit Error] Failed to create transaction: %v\n", err)
		return nil, "", err
	}

	// Generate OTP
	otp, err := s.otpService.GenerateOTP(account.UserID, models.OTPPurposeFundTransfer)
	if err != nil {
		fmt.Printf("[Deposit Error] Failed to generate OTP: %v\n", err)
		return nil, "", fmt.Errorf("failed to generate otp: %v", err)
	}

	// Fetch user for email
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		fmt.Printf("[Deposit Error] Failed to fetch user: %v\n", err)
		return nil, "", fmt.Errorf("failed to fetch user: %v", err)
	}
	if user == nil {
		fmt.Printf("[Deposit Error] User not found: %s\n", userID)
		return nil, "", errors.New("user not found")
	}

	subject := "Aequitas: Fund Transfer OTP"
	
	// Determine best name to use
	var firstName string
	if user.FullName != "" {
		firstName = strings.Split(user.FullName, " ")[0]
	} else if user.DisplayName != "" {
		firstName = user.DisplayName
	} else {
		// Fallback to email prefix
		firstName = strings.Split(user.Email, "@")[0]
	}

	if firstName == "" {
		firstName = "Valued Member"
	}

	htmlContent := fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
			<h2 style="color: #1976d2; margin-top: 0;">Secure Fund Transfer</h2>
			<p>Hi <strong>%s</strong>,</p>
			<p>You have initiated a deposit of <strong style="color: #2e7d32;">₹%.2f</strong> to your Aequitas trading account.</p>
			<p>To complete this transaction, please use the following One-Time Password (OTP):</p>
			<div style="font-size: 32px; font-weight: bold; background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 5px; color: #1976d2; border: 1px dashed #1976d2; margin: 20px 0;">
				%s
			</div>
			<p style="font-size: 14px; color: #666;">This code is valid for <strong>5 minutes</strong>. For your security, please do not share this code with anyone.</p>
			<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
			<p style="font-size: 12px; color: #888;">If you did not initiate this request, please contact our support team or secure your account password immediately.</p>
			<p style="margin-bottom: 0;">Best regards,<br/><strong>The Aequitas Team</strong></p>
		</div>
	`, firstName, amount, otp)

	err = s.commService.SendEmail(user.Email, subject, htmlContent)
	if err != nil {
		fmt.Printf("[Deposit Error] Failed to send email: %v\n", err)
		return nil, "", fmt.Errorf("failed to send email: %v", err)
	}

	s.auditService.LogFromContext(ctx, "DEPOSIT_INITIATED", savedTx.ID.Hex(), "TRANSACTION",
		fmt.Sprintf("WALLET +₹%.2f (Pending)", amount),
		nil, savedTx)

	return savedTx, otp, nil
}

// CompleteDeposit finalizes a pending transaction after OTP verification
func (s *TradingAccountService) CompleteDeposit(ctx context.Context, userID string, txID string, otpCode string) (*models.TradingAccount, error) {
	// 1. Verify OTP first
	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		fmt.Printf("[Deposit Complete Error] Invalid user ID format: %v\n", err)
		return nil, err
	}

	valid, err := s.otpService.VerifyOTP(userObjID, models.OTPPurposeFundTransfer, otpCode)
	if err != nil {
		fmt.Printf("[Deposit Complete Error] OTP verification failed: %v\n", err)
		return nil, err
	}
	if !valid {
		fmt.Printf("[Deposit Complete Error] Invalid OTP for user %s\n", userID)
		return nil, errors.New("invalid or expired OTP")
	}

	// 2. Find the transaction
	tx, err := s.txRepo.FindByID(ctx, txID)
	if err != nil {
		fmt.Printf("[Deposit Complete Error] Transaction find error: %v\n", err)
		return nil, err
	}
	if tx == nil || tx.UserID != userObjID || tx.Status != "PENDING" {
		fmt.Printf("[Deposit Complete Error] Transaction not found or invalid: %s\n", txID)
		return nil, errors.New("invalid or already processed transaction")
	}

	// 3. Update balance and transaction status
	account, err := s.repo.FindByUserID(ctx, userID)
	if err != nil {
		fmt.Printf("[Deposit Complete Error] Account find error: %v\n", err)
		return nil, err
	}
	if account == nil {
		fmt.Printf("[Deposit Complete Error] Account not found for user: %s\n", userID)
		return nil, errors.New("trading account not found")
	}

	newBalance := account.Balance + tx.Amount
	err = s.repo.UpdateBalance(ctx, account.ID, newBalance)
	if err != nil {
		fmt.Printf("[Deposit Complete Error] Balance update error: %v\n", err)
		return nil, err
	}

	// 4. Update transaction status
	tx.Status = "COMPLETED"
	tx.Reference = "EMAIL_VERIFIED"
	_ = s.txRepo.UpdateStatus(ctx, tx.ID.Hex(), "COMPLETED", tx.Reference)

	// 5. Audit Log
	s.auditService.LogFromContext(ctx, "DEPOSIT_COMPLETED", tx.ID.Hex(), "TRANSACTION",
		fmt.Sprintf("WALLET +₹%.2f (Verified)", tx.Amount),
		nil, tx)

	// Refresh local account balance for returning to UI
	account.Balance = newBalance
	return account, nil
}

// FundAccount is now deprecated in favor of InitiateDeposit/CompleteDeposit
func (s *TradingAccountService) FundAccount(ctx context.Context, userID string, amount float64) (*models.TradingAccount, error) {
	// For backward compatibility or internal use
	tx, otp, err := s.InitiateDeposit(ctx, userID, amount)
	if err != nil {
		return nil, err
	}
	return s.CompleteDeposit(ctx, userID, tx.ID.Hex(), otp)
}

// GetTransactions retrieves the transaction history for a user
func (s *TradingAccountService) GetTransactions(ctx context.Context, userID string) ([]*models.Transaction, error) {
	account, err := s.repo.FindByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if account == nil {
		// If no account exists, user has no transactions
		return []*models.Transaction{}, nil
	}

	return s.txRepo.FindByAccountID(ctx, account.ID.Hex())
}

// SettleTrade updates the balance and creates a transaction for a filled trade
func (s *TradingAccountService) SettleTrade(ctx context.Context, userID string, netAmount float64, tradeID string, side string) error {
	account, err := s.repo.FindByUserID(ctx, userID)
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

	err = s.repo.UpdateBalance(ctx, account.ID, newBalance)
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
	_, _ = s.txRepo.Create(ctx, tx)

	// 4. Audit Log
	s.auditService.LogFromContext(ctx, "TRADE_SETTLED", tradeID, "TRADE",
		fmt.Sprintf("SETTLE %s: ₹%.2f (%s)", side, netAmount, tradeID),
		nil, tx)

	return nil
}

// UpdateRealizedPL adds the profit/loss from a closed trade to the total realized P&L
func (s *TradingAccountService) UpdateRealizedPL(ctx context.Context, userID string, amount float64) error {
	account, err := s.repo.FindByUserID(ctx, userID)
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
	_, err = s.repo.Update(ctx, account)
	return err
}

// BlockMargin locks funds for short positions
func (s *TradingAccountService) BlockMargin(ctx context.Context, userID string, amount float64) error {
	account, err := s.repo.FindByUserID(ctx, userID)
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

	_, err = s.repo.Update(ctx, account)
	return err
}

// ReleaseMargin unlocks funds when short positions are covered
func (s *TradingAccountService) ReleaseMargin(ctx context.Context, userID string, amount float64) error {
	account, err := s.repo.FindByUserID(ctx, userID)
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

	_, err = s.repo.Update(ctx, account)
	return err
}

// ManualAdjustment allows privileged users with active JIT to adjust balances
func (s *TradingAccountService) ManualAdjustment(ctx context.Context, adminID string, userID string, amount float64, action string, reason string) error {
	adminObjID, _ := primitive.ObjectIDFromHex(adminID)
	userObjID, _ := primitive.ObjectIDFromHex(userID)

	// 1. Check JIT Authorization
	authorized, err := s.jitService.IsAuthorized(ctx, adminObjID, action, userObjID)
	if err != nil {
		return err
	}
	if !authorized {
		return errors.New("unauthorized: active JIT session required for this action")
	}

	// 2. Perform adjustment
	account, err := s.repo.FindByUserID(ctx, userID)
	if err != nil {
		return err
	}
	if account == nil {
		return errors.New("trading account not found")
	}

	newBalance := account.Balance + amount
	if newBalance < 0 {
		return errors.New("insufficient balance for debit adjustment")
	}

	err = s.repo.UpdateBalance(ctx, account.ID, newBalance)
	if err != nil {
		return err
	}

	// 3. Log transaction
	tx := &models.Transaction{
		AccountID: account.ID,
		UserID:    account.UserID,
		Type:      "ADJUSTMENT",
		Amount:    amount,
		Currency:  account.Currency,
		Status:    "COMPLETED",
		Reference: fmt.Sprintf("ADMIN_%s: %s", adminID, reason),
	}
	_, _ = s.txRepo.Create(ctx, tx)

	return nil
}
