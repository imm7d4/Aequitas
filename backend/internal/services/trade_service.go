package services

import (
	"context"
	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type TradeService struct {
	repo *repositories.TradeRepository
}

func NewTradeService(repo *repositories.TradeRepository) *TradeService {
	return &TradeService{repo: repo}
}

func (s *TradeService) GetUserTrades(ctx context.Context, userID string) ([]*models.Trade, error) {
	return s.repo.FindByUserID(ctx, userID)
}

func (s *TradeService) GetTradesByOrder(orderID string) ([]*models.Trade, error) {
	return s.repo.FindByOrderID(orderID)
}
