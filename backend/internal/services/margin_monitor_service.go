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
	// Hysteresis tracking to prevent false alerts
	userMarginStatus map[string]*MarginStatus
}

// MarginStatus tracks alert state for hysteresis
type MarginStatus struct {
	LastRatio           float64
	ConsecutiveWarnings int
	LastAlertTime       time.Time
	AlertLevel          string // "OK", "WARNING", "CRITICAL"
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
		userMarginStatus:    make(map[string]*MarginStatus),
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

		// Get or create margin status for this user
		status, exists := s.userMarginStatus[userID]
		if !exists {
			status = &MarginStatus{
				LastRatio:           ratio,
				ConsecutiveWarnings: 0,
				LastAlertTime:       time.Time{},
				AlertLevel:          "OK",
			}
			s.userMarginStatus[userID] = status
		}

		// Update last ratio
		status.LastRatio = ratio

		// HYSTERESIS LOGIC: Require sustained breach to prevent false alerts
		const minCooldown = 5 * time.Minute
		timeSinceLastAlert := time.Since(status.LastAlertTime)

		if ratio < 0.5 {
			// CRITICAL threshold
			status.ConsecutiveWarnings++

			// Only alert if:
			// 1. We've seen 2+ consecutive critical readings, AND
			// 2. It's been at least 5 minutes since last alert
			if status.ConsecutiveWarnings >= 2 && timeSinceLastAlert > minCooldown {
				log.Printf("[MarginMonitor] CRITICAL: User %s Ratio %.2f (sustained). Equity %.2f, Blocked %.2f",
					userID, ratio, equity, blocked)

				s.notificationService.SendNotification(
					context.Background(),
					userID,
					models.NotificationTypeAlert,
					"MARGIN CALL: CRITICAL",
					fmt.Sprintf("Your account equity (₹%.2f) is critically low. Immediate funds required or positions will be auto-liquidated.", equity),
					map[string]interface{}{"level": "CRITICAL", "equity": equity, "margin": blocked, "ratio": ratio},
					nil,
				)

				status.LastAlertTime = time.Now()
				status.AlertLevel = "CRITICAL"
			} else if status.ConsecutiveWarnings == 1 {
				log.Printf("[MarginMonitor] CRITICAL threshold detected for user %s (1st warning, waiting for confirmation)", userID)
			}

			// TODO: Auto-Liquidate (Future Phase)

		} else if ratio < 1.0 {
			// WARNING threshold
			status.ConsecutiveWarnings++

			// Only alert if:
			// 1. We've seen 2+ consecutive warnings, AND
			// 2. It's been at least 5 minutes since last alert, AND
			// 3. Not already in CRITICAL state
			if status.ConsecutiveWarnings >= 2 && timeSinceLastAlert > minCooldown && status.AlertLevel != "CRITICAL" {
				log.Printf("[MarginMonitor] WARNING: User %s Ratio %.2f (sustained)", userID, ratio)

				s.notificationService.SendNotification(
					context.Background(),
					userID,
					models.NotificationTypeAlert,
					"Margin Warning",
					fmt.Sprintf("Your equity (₹%.2f) has dropped below the blocked margin requirement. Please add funds.", equity),
					map[string]interface{}{"level": "WARNING", "equity": equity, "margin": blocked, "ratio": ratio},
					nil,
				)

				status.LastAlertTime = time.Now()
				status.AlertLevel = "WARNING"
			} else if status.ConsecutiveWarnings == 1 {
				log.Printf("[MarginMonitor] WARNING threshold detected for user %s (1st warning, waiting for confirmation)", userID)
			}
		} else {
			// Ratio is healthy - reset warnings
			if status.ConsecutiveWarnings > 0 {
				log.Printf("[MarginMonitor] User %s margin recovered. Ratio %.2f. Resetting warnings.", userID, ratio)
			}
			status.ConsecutiveWarnings = 0
			status.AlertLevel = "OK"
		}
	}
}
