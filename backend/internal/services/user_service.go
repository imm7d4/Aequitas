package services

import (
	"errors"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
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
