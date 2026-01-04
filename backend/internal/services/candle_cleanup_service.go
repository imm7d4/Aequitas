package services

import (
	"log"
	"time"

	"aequitas/internal/repositories"
)

type CandleCleanupService struct {
	repo     *repositories.CandleRepository
	stopChan chan struct{}
}

func NewCandleCleanupService(repo *repositories.CandleRepository) *CandleCleanupService {
	return &CandleCleanupService{
		repo:     repo,
		stopChan: make(chan struct{}),
	}
}

// Start begins the periodic cleanup routine
func (s *CandleCleanupService) Start() {
	// Run cleanup every hour
	ticker := time.NewTicker(1 * time.Hour)

	go func() {
		// Run initial cleanup after 5 minutes of startup
		time.Sleep(5 * time.Minute)
		s.runCleanup()

		for {
			select {
			case <-ticker.C:
				s.runCleanup()
			case <-s.stopChan:
				ticker.Stop()
				return
			}
		}
	}()

	log.Println("Candle cleanup service started (runs every 1 hour)")
}

// Stop stops the periodic cleanup routine
func (s *CandleCleanupService) Stop() {
	close(s.stopChan)
}

// runCleanup executes the cleanup operation
func (s *CandleCleanupService) runCleanup() {
	log.Println("🧹 Running periodic candle cleanup...")

	// Keep only latest 100 candles per instrument per interval
	if err := s.repo.CleanupAllCandles(100); err != nil {
		log.Printf("Error during periodic cleanup: %v", err)
	}
}
