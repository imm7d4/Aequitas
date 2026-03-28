package services

import (
	"context"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type AdminService struct {
	db       *mongo.Database
	configRepo *repositories.AdminConfigRepository
	userRepo   *repositories.UserRepository
}

func NewAdminService(db *mongo.Database, configRepo *repositories.AdminConfigRepository, userRepo *repositories.UserRepository) *AdminService {
	return &AdminService{db: db, configRepo: configRepo, userRepo: userRepo}
}

// GetTPM calculates Successful Trades Per Minute (deterministic)
func (s *AdminService) GetTPM(ctx context.Context) (float64, error) {
	oneMinuteAgo := time.Now().Add(-time.Minute)
	
	filter := bson.M{
		"executed_at": bson.M{"$gte": oneMinuteAgo},
	}
	
	count, err := s.db.Collection("trades").CountDocuments(ctx, filter)
	if err != nil {
		return 0, err
	}
	
	return float64(count), nil
}

// GetDAU calculates Daily Active Users (Unique users with activity in last 24h)
func (s *AdminService) GetDAU(ctx context.Context) (int64, error) {
	twentyFourHoursAgo := time.Now().Add(-24 * time.Hour)
	
	filter := bson.M{
		"last_activity_at": bson.M{"$gte": twentyFourHoursAgo},
	}
	
	count, err := s.db.Collection("users").CountDocuments(ctx, filter)
	if err != nil {
		return 0, err
	}
	
	return count, nil
}

// GetConcurrentSessions calculates active users (activity in last 15 minutes)
func (s *AdminService) GetConcurrentSessions(ctx context.Context) (int64, error) {
	fifteenMinutesAgo := time.Now().Add(-15 * time.Minute)
	
	filter := bson.M{
		"last_activity_at": bson.M{"$gte": fifteenMinutesAgo},
	}
	
	count, err := s.db.Collection("users").CountDocuments(ctx, filter)
	if err != nil {
		return 0, err
	}
	
	return count, nil
}

type PlatformMetrics struct {
	TPM                float64 `json:"tpm"`
	DAU                int64   `json:"dau"`
	ConcurrentSessions int64   `json:"concurrentSessions"`
	Timestamp          time.Time `json:"timestamp"`
}

func (s *AdminService) GetPlatformMetrics(ctx context.Context) (*PlatformMetrics, error) {
	tpm, err := s.GetTPM(ctx)
	if err != nil {
		return nil, err
	}
	
	dau, err := s.GetDAU(ctx)
	if err != nil {
		return nil, err
	}
	
	concurrent, err := s.GetConcurrentSessions(ctx)
	if err != nil {
		return nil, err
	}
	
	return &PlatformMetrics{
		TPM:                tpm,
		DAU:                dau,
		ConcurrentSessions: concurrent,
		Timestamp:          time.Now(),
	}, nil
}

func (s *AdminService) GetConfig(ctx context.Context) (*models.AdminConfig, error) {
	return s.configRepo.GetConfig(ctx)
}

func (s *AdminService) UpdateConfig(ctx context.Context, config *models.AdminConfig) error {
	return s.configRepo.UpdateConfig(ctx, config)
}

func (s *AdminService) GetUsers(ctx context.Context) ([]*models.User, error) {
	// For now, return all users. In production, add pagination and filtering.
	return s.userRepo.FindAll(ctx)
}
