package services

import (
	"context"
	"log"
	"time"

	"aequitas/internal/repositories"
)

type NotificationCleanupService struct {
	repo     *repositories.NotificationRepository
	stopChan chan struct{}
}

func NewNotificationCleanupService(repo *repositories.NotificationRepository) *NotificationCleanupService {
	return &NotificationCleanupService{
		repo:     repo,
		stopChan: make(chan struct{}),
	}
}

// Start begins the periodic cleanup routine
func (s *NotificationCleanupService) Start() {
	// Run cleanup every 5 minutes
	ticker := time.NewTicker(5 * time.Minute)

	go func() {
		// Run initial cleanup immediately (or after short delay)
		time.Sleep(30 * time.Second)
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

	log.Println("Notification cleanup service started (runs every 5 minutes)")
}

// Stop stops the periodic cleanup routine
func (s *NotificationCleanupService) Stop() {
	close(s.stopChan)
}

// runCleanup executes the cleanup operation
func (s *NotificationCleanupService) runCleanup() {
	// Use a timeout context for the cleanup operation
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := s.repo.DeleteExpired(ctx); err != nil {
		log.Printf("Error during notification cleanup: %v", err)
	} else {
		// Only log if you want verbose output, otherwise keep it quiet
		// log.Println("Expired notifications cleaned up")
	}
}
