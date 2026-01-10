package services

import (
	"context"
	"log"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/websocket"
)

type NotificationService struct {
	repo  *repositories.NotificationRepository
	wsHub *websocket.Hub
}

func NewNotificationService(repo *repositories.NotificationRepository, wsHub *websocket.Hub) *NotificationService {
	return &NotificationService{
		repo:  repo,
		wsHub: wsHub,
	}
}

// SendNotification creates a notification, persists it, and sends it via WebSocket
func (s *NotificationService) SendNotification(
	ctx context.Context,
	userID string,
	nType models.NotificationType,
	title string,
	message string,
	data map[string]interface{},
	actions []models.NotificationAction,
) error {
	notification := &models.Notification{
		UserID:  userID,
		Type:    nType,
		Title:   title,
		Message: message,
		Data:    data,
		Actions: actions,
	}

	// 1. Persist to Database
	err := s.repo.Create(ctx, notification)
	if err != nil {
		log.Printf("Failed to persist notification for user %s: %v", userID, err)
		return err
	}

	// 2. Send via WebSocket
	s.wsHub.SendToUser(userID, notification)

	return nil
}

// GetUserNotifications returns the history for a user
func (s *NotificationService) GetUserNotifications(ctx context.Context, userID string) ([]models.Notification, error) {
	return s.repo.GetByUserID(ctx, userID, 50) // Limit to last 50
}

// MarkAsRead marks a notification as read
func (s *NotificationService) MarkAsRead(ctx context.Context, notificationID string, userID string) error {
	return s.repo.MarkAsRead(ctx, notificationID, userID)
}

// MarkAllAsRead marks all notifications for a user as read
func (s *NotificationService) MarkAllAsRead(ctx context.Context, userID string) error {
	return s.repo.MarkAllAsRead(ctx, userID)
}

// ClearAllNotifications delete all notifications for a user
func (s *NotificationService) ClearAllNotifications(ctx context.Context, userID string) error {
	return s.repo.DeleteAllForUser(ctx, userID)
}

// BroadcastSystemNotification sends a system-wide notification to all connected users (optional enhancement)
// Implementation would require iterating over all users or a broadcast channel in Hub
