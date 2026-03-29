package services

import (
	"context"
	"fmt"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/utils"
)

type AuditService struct {
	repo *repositories.AuditLogRepository
}

func NewAuditService(repo *repositories.AuditLogRepository) *AuditService {
	return &AuditService{repo: repo}
}

// Log handles the creation of a new audit log entry
func (s *AuditService) Log(actorID, actorName, actorRole, action, resourceID, resourceType, description string, oldVal, newVal interface{}) error {
	log := &models.AuditLog{
		ActorID:      actorID,
		ActorName:    actorName,
		ActorRole:    actorRole,
		Action:       action,
		ResourceID:   resourceID,
		ResourceType: resourceType,
		Description:  description,
		OldValue:     oldVal,
		NewValue:     newVal,
	}

	return s.repo.Create(log)
}

// LogFromContext extracts actor info from context and logs the action
func (s *AuditService) LogFromContext(ctx context.Context, action, resourceID, resourceType, details string, oldVal, newVal interface{}) error {
	actorID, _ := ctx.Value(utils.UserIDKey).(string)
	actorRole, _ := ctx.Value(utils.UserRoleKey).(string)
	actorName, _ := ctx.Value(utils.UserNameKey).(string)
	actorEmail, _ := ctx.Value(utils.UserEmailKey).(string)

	if actorName == "" {
		if actorEmail != "" {
			actorName = actorEmail
		} else if actorID != "" {
			actorName = actorID
		} else {
			actorName = "System"
		}
	}

	// We now rely on the UI to show Actor/Action columns, so description should be pure "details"
	description := details

	correlationID, _ := ctx.Value(utils.CorrelationIDKey).(string)

	logEntry := &models.AuditLog{
		ActorID:       actorID,
		ActorName:     actorName,
		ActorRole:     actorRole,
		Action:        action,
		ResourceID:    resourceID,
		ResourceType:  resourceType,
		Description:   description,
		OldValue:      oldVal,
		NewValue:      newVal,
		CorrelationID: correlationID,
	}

	return s.repo.Create(logEntry)
}

func (s *AuditService) GetLogs(ctx context.Context) ([]models.AuditLog, error) {
	return s.repo.FindAll(ctx)
}

// CreateHelper generates a human-friendly description (can be expanded)
func CreateAuditDescription(actorName, action, resourceType, details string) string {
	return fmt.Sprintf("%s performed %s on %s: %s", actorName, action, resourceType, details)
}
