package services

import (
	"context"
	"fmt"
	"log"

	"aequitas/internal/models"
	"aequitas/internal/repositories"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PriceAlertService struct {
	repo                *repositories.PriceAlertRepository
	notificationService *NotificationService
}

func NewPriceAlertService(repo *repositories.PriceAlertRepository, notificationService *NotificationService) *PriceAlertService {
	return &PriceAlertService{
		repo:                repo,
		notificationService: notificationService,
	}
}

func (s *PriceAlertService) CreateAlert(ctx context.Context, userID, instrumentID, symbol string, targetPrice float64, condition models.AlertCondition) (*models.PriceAlert, error) {
	uID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	iID, err := primitive.ObjectIDFromHex(instrumentID)
	if err != nil {
		return nil, err
	}

	alert := &models.PriceAlert{
		UserID:       uID,
		InstrumentID: iID,
		Symbol:       symbol,
		TargetPrice:  targetPrice,
		Condition:    condition,
	}

	if err := s.repo.Create(ctx, alert); err != nil {
		return nil, err
	}
	return alert, nil
}

func (s *PriceAlertService) GetUserAlerts(ctx context.Context, userID string) ([]*models.PriceAlert, error) {
	return s.repo.GetByUserID(ctx, userID)
}

func (s *PriceAlertService) CancelAlert(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

// CheckAlerts is called by the pricing engine or similar whenever a new price is available
func (s *PriceAlertService) CheckAlerts(ctx context.Context, instrumentID string, currentPrice float64) {
	alerts, err := s.repo.GetActiveByInstrument(ctx, instrumentID)
	if err != nil {
		log.Printf("Error fetching alerts for check: %v", err)
		return
	}

	for _, alert := range alerts {
		triggered := false
		if alert.Condition == models.AlertConditionAbove && currentPrice >= alert.TargetPrice {
			triggered = true
		} else if alert.Condition == models.AlertConditionBelow && currentPrice <= alert.TargetPrice {
			triggered = true
		}

		if triggered {
			// Mark as triggered
			if err := s.repo.MarkTriggered(ctx, alert.ID); err != nil {
				log.Printf("Error marking alert triggered: %v", err)
				continue
			}

			// Send notification
			go func(a *models.PriceAlert) {
				_ = s.notificationService.SendNotification(
					context.Background(),
					a.UserID.Hex(),
					models.NotificationTypeAlert,
					"Price Alert Triggered",
					fmt.Sprintf("%s has reached your target price of ₹%.2f (Current: ₹%.2f)", a.Symbol, a.TargetPrice, currentPrice),
					map[string]interface{}{"instrumentId": a.InstrumentID.Hex(), "symbol": a.Symbol},
					nil,
				)
			}(alert)
		}
	}
}
