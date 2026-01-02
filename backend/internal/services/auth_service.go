package services

import (
	"errors"

	"aequitas/internal/config"
	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/utils"
)

type AuthService struct {
	userRepo              *repositories.UserRepository
	tradingAccountService *TradingAccountService
	config                *config.Config
}

func NewAuthService(
	userRepo *repositories.UserRepository,
	tradingAccountService *TradingAccountService,
	config *config.Config,
) *AuthService {
	return &AuthService{
		userRepo:              userRepo,
		tradingAccountService: tradingAccountService,
		config:                config,
	}
}

// Register handles user registration (US-0.1.1)
func (s *AuthService) Register(email, password string) (*models.User, error) {
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
	_, err = s.tradingAccountService.CreateForUser(createdUser.ID.Hex())
	if err != nil {
		// Log error but don't fail registration
		// In production, this should trigger a retry mechanism or alert
		return nil, errors.New("failed to create trading account")
	}

	return createdUser, nil
}

// Login handles user authentication (US-0.1.3)
func (s *AuthService) Login(email, password string) (string, *models.User, error) {
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

	// Generate JWT token
	token, err := utils.GenerateToken(
		user.ID.Hex(),
		user.Email,
		user.IsAdmin,
		s.config.JWTSecret,
		s.config.JWTExpiryHours,
	)
	if err != nil {
		return "", nil, errors.New("failed to generate token")
	}

	return token, user, nil
}
