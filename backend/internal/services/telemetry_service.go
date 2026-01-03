package services

import (
	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type TelemetryService struct {
	repo *repositories.TelemetryRepository
}

func NewTelemetryService(repo *repositories.TelemetryRepository) *TelemetryService {
	return &TelemetryService{repo: repo}
}

func (s *TelemetryService) IngestEvents(events []models.TelemetryEvent) error {
	// In the future, we could add validation or enrichment here
	// (e.g., verifying event names against a registry, adding user info from context)
	return s.repo.BatchInsert(events)
}
