package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type MarginMonitorService struct {
	accountRepo         *repositories.TradingAccountRepository
	portfolioService    *PortfolioService
	notificationService *NotificationService
	stopChan            chan struct{}
}

func NewMarginMonitorService(
	accountRepo *repositories.TradingAccountRepository,
	portfolioService *PortfolioService,
	notificationService *NotificationService,
) *MarginMonitorService {
	return &MarginMonitorService{
		accountRepo:         accountRepo,
		portfolioService:    portfolioService,
		notificationService: notificationService,
		stopChan:            make(chan struct{}),
	}
}

// Start begins the background monitoring service
func (s *MarginMonitorService) Start() {
	// Run every 3 minutes for faster risk detection
	ticker := time.NewTicker(3 * time.Minute)
	go func() {
		for {
			select {
			case <-ticker.C:
				s.CheckMargins()
			case <-s.stopChan:
				ticker.Stop()
				return
			}
		}
	}()
	log.Println("Margin monitoring service started (polling 3m)")
}

// Stop gracefully shuts down
func (s *MarginMonitorService) Stop() {
	close(s.stopChan)
	log.Println("Margin monitoring service stopped")
}

// CheckMargins iterates active accounts and checks risk
func (s *MarginMonitorService) CheckMargins() {
	// 1. Find accounts with active positions (Blocked Margin > 0)
	accounts, err := s.accountRepo.FindAccountsWithPositions()
	if err != nil {
		log.Printf("[MarginMonitor] Error fetching accounts: %v", err)
		return
	}

	if len(accounts) == 0 {
		return
	}

	log.Printf("[MarginMonitor] Checking margin for %d active accounts", len(accounts))

	for _, account := range accounts {
		userID := account.UserID.Hex()

		// 2. Calculate Real-Time Equity
		// We use CaptureSnapshot logic but might not want to save it every time?
		// For now, saving it is fine (audit trail).
		snapshot, err := s.portfolioService.CaptureSnapshot(context.Background(), userID)
		if err != nil {
			log.Printf("[MarginMonitor] Failed to snapshot user %s: %v", userID, err)
			continue
		}

		equity := snapshot.TotalEquity
		blocked := account.BlockedMargin

		if blocked == 0 {
			continue // Should not happen given query, but safe check
		}

		// 3. Risk Calculation
		// Health = Equity / BlockedMargin
		// Standard: Blocked Margin is ~20%.
		// If Health < 1.0, it means Equity < 20% of Exposure. (Maintenance Level?)
		// Actually, if Initial Margin is 20%. And Equity drops BELOW it.
		// That means you have LOST money.

		// Example:
		// Short 1L. Cash 20k. Blocked 20k. Equity 20k.
		// Price +10%. Value 1.1L.
		// Equity = 20k + 1L - 1.1L = 10k.
		// Blocked = 20k.
		// Ratio = 10k / 20k = 0.5.

		ratio := equity / blocked

		if ratio < 0.5 {
			// CRITICAL: Equity is < 50% of Initial Margin (Effective <10% of Exposure)
			// Trigger LIQUIDATION ALERT (Phase 1 notification)
			log.Printf("[MarginMonitor] CRITICAL: User %s Ratio %.2f. Equity %.2f, Blocked %.2f", userID, ratio, equity, blocked)

			s.notificationService.SendNotification(
				context.Background(),
				userID,
				models.NotificationTypeAlert,
				"MARGIN CALL: CRITICAL",
				fmt.Sprintf("Your account equity (₹%.2f) is critically low. Immediate funds required or positions will be aut-liquidated.", equity),
				map[string]interface{}{"level": "CRITICAL", "equity": equity, "margin": blocked},
				nil,
			)

			// TODO: Auto-Liquidate (Future Phase)

		} else if ratio < 1.0 {
			// WARNING: Equity dropped below Initial Margin
			log.Printf("[MarginMonitor] WARNING: User %s Ratio %.2f", userID, ratio)

			s.notificationService.SendNotification(
				context.Background(),
				userID,
				models.NotificationTypeAlert,
				"Margin Warning",
				fmt.Sprintf("Your equity (₹%.2f) has dropped below the blocked margin requirement. Please add funds.", equity),
				map[string]interface{}{"level": "WARNING", "equity": equity, "margin": blocked},
				nil,
			)
		}
	}
}
