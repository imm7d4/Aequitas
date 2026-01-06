package services

import (
	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type TradeService struct {
	repo *repositories.TradeRepository
}

func NewTradeService(repo *repositories.TradeRepository) *TradeService {
	return &TradeService{repo: repo}
}

func (s *TradeService) GetUserTrades(userID string) ([]*models.Trade, error) {
	return s.repo.FindByUserID(userID)
}

func (s *TradeService) GetTradesByOrder(orderID string) ([]*models.Trade, error) {
	return s.repo.FindByOrderID(orderID)
}
