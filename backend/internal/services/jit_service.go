package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JITService struct {
	repo         *repositories.JITRepository
	auditService *AuditService
}

func NewJITService(repo *repositories.JITRepository, auditService *AuditService) *JITService {
	return &JITService{repo: repo, auditService: auditService}
}

func (s *JITService) RequestAccess(ctx context.Context, makerID primitive.ObjectID, action string, resourceID primitive.ObjectID, amount float64, reason string, duration int) (*models.JITRequest, error) {
	isDualAuth := false
	if action == "HALT_MARKET" || action == "RESUME_MARKET" || action == "CONFIG_UPDATE" {
		isDualAuth = true
	}
	// Wallet adjustments always go through JIT but don't require dual-auth per user request
	if action == "WALLET_ADJUSTMENT" {
		isDualAuth = false
	}

	req := &models.JITRequest{
		MakerID:            makerID,
		Action:             action,
		ResourceID:         resourceID,
		Amount:             amount,
		Reason:             reason,
		Duration:           duration,
		Status:             models.JITStatusPending,
		IsDualAuthRequired: isDualAuth,
		MaxAmount:          amount, // Default scoping to requested amount
		MaxUses:            1,      // Default to single use for specific adjustments
		CurrentUses:        0,
	}
	err := s.repo.Create(ctx, req)
	if err == nil {
		s.auditService.LogFromContext(ctx, "JIT_REQUESTED", req.ID.Hex(), "JIT_REQUEST", 
			fmt.Sprintf("JIT: Access Requested (%s) - DualAuth: %v", action, isDualAuth), nil, req)
	}
	return req, err
}

func (s *JITService) ApproveRequest(ctx context.Context, requestID primitive.ObjectID, checkerID primitive.ObjectID) error {
	req, err := s.repo.GetByID(ctx, requestID)
	if err != nil {
		return err
	}

	if req.Status != models.JITStatusPending && req.Status != models.JITStatusApproved {
		return errors.New("request is not in an approvable state")
	}

	if req.MakerID == checkerID {
		return errors.New("maker and checker cannot be the same (Separation of Duties)")
	}

	// Check if this checker already approved
	for _, id := range req.Checkers {
		if id == checkerID {
			return errors.New("you have already approved this request")
		}
	}

	status := models.JITStatusApproved
	if req.IsDualAuthRequired && len(req.Checkers) == 0 {
		// Needs one more approval
		status = models.JITStatusPending // Keep pending but record this approval
	}

	expiry := time.Now().Add(time.Duration(req.Duration) * time.Minute)
	
	err = s.repo.AddChecker(ctx, requestID, checkerID, status)
	if err == nil {
		s.auditService.LogFromContext(ctx, "JIT_PARTIAL_APPROVAL", requestID.Hex(), "JIT_REQUEST", 
			fmt.Sprintf("JIT: Partial Approval (%s) by %s", req.Action, checkerID.Hex()), nil, req)
		
		if status == models.JITStatusApproved {
			// Update local object for logging/return if needed
			now := time.Now()
			req.Status = models.JITStatusApproved
			req.ExpiresAt = &expiry
			req.ApprovedAt = &now
			s.auditService.LogFromContext(ctx, "JIT_APPROVED", requestID.Hex(), "JIT_REQUEST", 
				fmt.Sprintf("JIT: Access Granted (%s) - Full Approval", req.Action), nil, req)
		}
	}
	return err
}

func (s *JITService) RejectRequest(ctx context.Context, requestID primitive.ObjectID, checkerID primitive.ObjectID) error {
	req, err := s.repo.GetByID(ctx, requestID)
	if err != nil {
		return err
	}

	if req.Status != models.JITStatusPending {
		return errors.New("request is not in a rejectable state")
	}

	if req.MakerID == checkerID {
		return errors.New("maker cannot reject their own request (Separation of Duties)")
	}

	err = s.repo.UpdateStatus(ctx, requestID, models.JITStatusRejected)
	if err == nil {
		s.auditService.LogFromContext(ctx, "JIT_REJECTED", requestID.Hex(), "JIT_REQUEST", 
			fmt.Sprintf("JIT: Access Denied (%s) by %s", req.Action, checkerID.Hex()), nil, req)
	}
	return err
}

func (s *JITService) IsAuthorized(ctx context.Context, makerID primitive.ObjectID, action string, resourceID primitive.ObjectID) (bool, error) {
	pending, err := s.repo.GetPending(ctx) 
	if err != nil {
		return false, err
	}

	for _, r := range pending {
		if r.MakerID == makerID && r.Action == action && r.ResourceID == resourceID && r.Status == models.JITStatusApproved {
			// 1. Check Expiry
			if r.ExpiresAt != nil && time.Now().After(*r.ExpiresAt) {
				continue
			}
			
			// 2. Check Usage Limits (US-12.2)
			if r.MaxUses > 0 && r.CurrentUses >= r.MaxUses {
				continue
			}
			
			// If authorized, increment uses (idempotent for this call context)
			_ = s.repo.IncrementUses(ctx, r.ID)
			return true, nil
		}
	}
	return false, nil
}

func (s *JITService) GetPendingRequests(ctx context.Context) ([]models.JITRequest, error) {
	return s.repo.GetPending(ctx)
}
