package services

import (
	"errors"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/utils"
)

type UserService struct {
	userRepo *repositories.UserRepository
}

func NewUserService(userRepo *repositories.UserRepository) *UserService {
	return &UserService{userRepo: userRepo}
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
func (s *UserService) UpdateProfile(userID string, fullName, displayName, bio, avatar string) (*models.User, error) {
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
