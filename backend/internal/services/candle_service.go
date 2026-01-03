package services

import (
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type CandleService struct {
	repo *repositories.CandleRepository
}

func NewCandleService(repo *repositories.CandleRepository) *CandleService {
	return &CandleService{
		repo: repo,
	}
}

func (s *CandleService) GetHistoricalCandles(
	instrumentID string,
	interval string,
	from time.Time,
	to time.Time,
	limit int,
) ([]*models.Candle, error) {
	if limit <= 0 || limit > 1000 {
		limit = 100 // Default limit
	}

	return s.repo.GetCandles(instrumentID, interval, from, to, limit)
}
