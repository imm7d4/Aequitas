package services

import (
	"context"
	"errors"
	"time"

	"aequitas/internal/config"
	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/utils"
	"fmt"
	"strings"
)

type AuthService struct {
	userRepo              *repositories.UserRepository
	tradingAccountService *TradingAccountService
	otpService            *OTPService
	auditService          *AuditService
	commService           CommunicationProvider
	config                *config.Config
}

func NewAuthService(
	userRepo *repositories.UserRepository,
	tradingAccountService *TradingAccountService,
	otpService *OTPService,
	auditService *AuditService,
	commService CommunicationProvider,
	config *config.Config,
) *AuthService {
	return &AuthService{
		userRepo:              userRepo,
		tradingAccountService: tradingAccountService,
		otpService:            otpService,
		auditService:          auditService,
		commService:           commService,
		config:                config,
	}
}

// InitiateRegistration starts the registration flow by sending an OTP
func (s *AuthService) InitiateRegistration(email, password string) error {
	if !utils.IsValidEmail(email) {
		return errors.New("invalid email format")
	}

	if len(password) < 8 {
		return errors.New("password must be at least 8 characters")
	}

	existing, _ := s.userRepo.FindByEmail(email)
	if existing != nil {
		return errors.New("email already registered")
	}

	otp, err := s.otpService.GenerateEmailOTP(email, models.OTPPurposeRegistration)
	if err != nil {
		return err
	}

	subject := "Confirm Your Aequitas Registration"
	htmlContent := fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
			<h2 style="color: #1976d2; margin-top: 0;">Welcome to Aequitas!</h2>
			<p>Almost there! To complete your registration, please verify your email address using the code below:</p>
			<div style="font-size: 32px; font-weight: bold; background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 5px; color: #1976d2; border: 1px dashed #1976d2; margin: 20px 0;">
				%s
			</div>
			<p>This code is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
			<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
			<p style="margin-bottom: 0;">Best regards,<br/><strong>The Aequitas Team</strong></p>
		</div>
	`, otp)

	return s.commService.SendEmail(email, subject, htmlContent)
}

// CompleteRegistration verifies the OTP and creates the account
func (s *AuthService) CompleteRegistration(email, password, otp string) (*models.User, error) {
	valid, err := s.otpService.VerifyEmailOTP(email, models.OTPPurposeRegistration, otp)
	if err != nil {
		return nil, err
	}
	if !valid {
		return nil, errors.New("invalid or expired OTP")
	}

	return s.register(context.Background(), email, password)
}

func (s *AuthService) register(ctx context.Context, email, password string) (*models.User, error) {
	// Business validation
	if !utils.IsValidEmail(email) {
		return nil, errors.New("invalid email format")
	}

	if len(password) < 8 {
		return nil, errors.New("password must be at least 8 characters")
	}

	// Check if user already exists
	existing, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("email already registered")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// Create user
	user := &models.User{
		Email:    email,
		Password: hashedPassword,
		Status:   "ACTIVE",
	}

	createdUser, err := s.userRepo.Create(user)
	if err != nil {
		return nil, err
	}

	// Auto-create trading account (US-0.1.2)
	_, err = s.tradingAccountService.CreateForUser(ctx, createdUser.ID.Hex())
	if err != nil {
		return nil, errors.New("failed to create trading account")
	}

	s.auditService.Log(createdUser.ID.Hex(), createdUser.Email, "USER", "USER_REGISTERED",
		createdUser.ID.Hex(), "USER", "New user registered", nil, createdUser)

	return createdUser, nil
}

// Login handles user authentication (US-0.1.3)
func (s *AuthService) Login(email, password, ipAddress string) (string, *models.User, error) {
	// Find user by email
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", nil, err
	}
	if user == nil {
		return "", nil, errors.New("invalid email or password")
	}

	// Verify password
	if !utils.CheckPassword(password, user.Password) {
		return "", nil, errors.New("invalid email or password")
	}

	// Update last login info
	now := time.Now()
	user.LastLoginAt = &now
	user.LastLoginIP = ipAddress
	s.userRepo.Update(user)

	// Generate JWT token
	token, err := utils.GenerateToken(
		user.ID.Hex(),
		user.Email,
		user.FullName,
		user.IsAdmin,
		user.Role,
		s.config.JWTSecret,
		s.config.JWTExpiryHours,
	)
	if err != nil {
		return "", nil, errors.New("failed to generate token")
	}

	s.auditService.Log(user.ID.Hex(), user.FullName, user.Role, "USER_LOGIN",
		user.ID.Hex(), "USER", fmt.Sprintf("Authorized via IP: %s", ipAddress), nil, user)

	return token, user, nil
}

// Logout logs the user logout event in the forensic ledger
func (s *AuthService) Logout(ctx context.Context) {
	s.auditService.LogFromContext(ctx, "USER_LOGOUT", "", "USER", "Session Terminated", nil, nil)
}

// InitiateForgotPassword sends a reset link/OTP to the registered email
func (s *AuthService) InitiateForgotPassword(email string) error {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("No such user exists, Please register and try again!")
	}

	otp, err := s.otpService.GenerateOTP(user.ID, models.OTPPurposeForgotPassword)
	if err != nil {
		return err
	}

	firstName := strings.Split(user.FullName, " ")[0]
	if firstName == "" {
		firstName = "User"
	}

	subject := "Reset Your Aequitas Password"
	htmlContent := fmt.Sprintf(`
		<div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
			<h2 style="color: #d32f2f; margin-top: 0;">Password Reset Request</h2>
			<p>Hi <strong>%s</strong>,</p>
			<p>We received a request to reset your password. Use the following code to proceed:</p>
			<div style="font-size: 32px; font-weight: bold; background: #fff5f5; padding: 20px; text-align: center; border-radius: 8px; letter-spacing: 5px; color: #d32f2f; border: 1px dashed #d32f2f; margin: 20px 0;">
				%s
			</div>
			<p>This code is valid for <strong>5 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
			<hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
			<p style="margin-bottom: 0;">Best regards,<br/><strong>The Aequitas Team</strong></p>
		</div>
	`, firstName, otp)

	return s.commService.SendEmail(email, subject, htmlContent)
}

// ResetPassword verifies the OTP and updates the password
func (s *AuthService) ResetPassword(email, otp, newPassword string) error {
	if len(newPassword) < 8 {
		return errors.New("password must be at least 8 characters")
	}

	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return err
	}
	if user == nil {
		return errors.New("user not found")
	}

	valid, err := s.otpService.VerifyOTP(user.ID, models.OTPPurposeForgotPassword, otp)
	if err != nil {
		return err
	}
	if !valid {
		return errors.New("invalid or expired OTP")
	}

	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return err
	}

	user.Password = hashedPassword
	err = s.userRepo.Update(user)
	if err == nil {
		s.auditService.Log(user.ID.Hex(), user.Email, user.Role, "PASSWORD_RESET",
			user.ID.Hex(), "USER", "User password reset successfully", nil, nil)
	}
	return err
}
