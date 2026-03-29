package services

import (
	"context"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type TelemetryService struct {
	repo         *repositories.TelemetryRepository
	auditService *AuditService
}

func NewTelemetryService(repo *repositories.TelemetryRepository, auditService *AuditService) *TelemetryService {
	return &TelemetryService{
		repo:         repo,
		auditService: auditService,
	}
}

func (s *TelemetryService) IngestEvents(ctx context.Context, events []models.TelemetryEvent) error {
	// 1. Store in primary telemetry repo
	if err := s.repo.BatchInsert(events); err != nil {
		return err
	}

	// 2. Log key events to Forensic Audit Trail
	for _, event := range events {
		if event.EventName == "PAGE_VISIT" || event.EventName == "UI_INTERACTION" || event.EventName == "LOGOUT" {
			s.auditService.LogFromContext(ctx, "TELEMETRY_"+event.EventName, event.SessionID, "SESSION",
				event.Description, nil, event.Properties)
		}
	}

	return nil
}
