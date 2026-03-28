package services

import (
	"context"
	"errors"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JITService struct {
	repo *repositories.JITRepository
}

func NewJITService(repo *repositories.JITRepository) *JITService {
	return &JITService{repo: repo}
}

func (s *JITService) RequestAccess(ctx context.Context, makerID primitive.ObjectID, action string, resourceID primitive.ObjectID, amount float64, reason string, duration int) (*models.JITRequest, error) {
	req := &models.JITRequest{
		MakerID:    makerID,
		Action:     action,
		ResourceID: resourceID,
		Amount:     amount,
		Reason:     reason,
		Duration:   duration,
	}
	err := s.repo.Create(ctx, req)
	return req, err
}

func (s *JITService) ApproveRequest(ctx context.Context, requestID primitive.ObjectID, checkerID primitive.ObjectID) error {
	req, err := s.repo.GetByID(ctx, requestID)
	if err != nil {
		return err
	}

	if req.Status != models.JITStatusPending {
		return errors.New("request is not in pending state")
	}

	if req.MakerID == checkerID {
		return errors.New("maker and checker cannot be the same (Separation of Duties)")
	}

	expiry := time.Now().Add(time.Duration(req.Duration) * time.Minute)
	
	// Update status and expiry
	now := time.Now()
	req.Status = models.JITStatusApproved
	req.CheckerID = &checkerID
	req.ApprovedAt = &now
	req.ExpiresAt = &expiry

	return s.repo.UpdateStatus(ctx, requestID, checkerID, models.JITStatusApproved)
}

func (s *JITService) IsAuthorized(ctx context.Context, makerID primitive.ObjectID, action string, resourceID primitive.ObjectID) (bool, error) {
	// Simple check: finding an approved request that hasn't expired
	// In a real system, we'd query for specifically this combination
	pending, err := s.repo.GetPending(ctx) // Placeholder for more efficient query
	if err != nil {
		return false, err
	}

	for _, r := range pending {
		// This should be an actual database query for performance
		if r.MakerID == makerID && r.Action == action && r.ResourceID == resourceID && r.Status == models.JITStatusApproved {
			if r.ExpiresAt != nil && time.Now().Before(*r.ExpiresAt) {
				return true, nil
			}
		}
	}
	return false, nil
}

func (s *JITService) GetPendingRequests(ctx context.Context) ([]models.JITRequest, error) {
	return s.repo.GetPending(ctx)
}
