package services

import (
	"context"
	"log"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/websocket"
)

type NotificationService struct {
	repo     *repositories.NotificationRepository
	wsHub    *websocket.Hub
	userRepo *repositories.UserRepository
}

func NewNotificationService(repo *repositories.NotificationRepository, wsHub *websocket.Hub, userRepo *repositories.UserRepository) *NotificationService {
	return &NotificationService{
		repo:     repo,
		wsHub:    wsHub,
		userRepo: userRepo,
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
	// 0. Check User Preferences
	user, err := s.userRepo.FindByID(userID)
	if err == nil && user != nil {
		prefs := user.Preferences.NotificationSettings
		
		// If MuteAll is true, don't send anything
		if prefs.MuteAll {
			return nil
		}

		// Check if preferences are uninitialized (all false)
		// If uninitialized, we default to enabled for backwards compatibility
		isUninitialized := prefs == models.NotificationSettings{}

		enabled := true
		if !isUninitialized {
			switch {
			case title == "Order Filled":
				enabled = prefs.OrderFilled
			case title == "Order Cancelled" || title == "IOC Order Cancelled":
				enabled = prefs.OrderCancelled
			case title == "MARGIN CALL: CRITICAL" || title == "Margin Warning":
				enabled = prefs.MarginCallWarning
			case title == "Price Alert Triggered":
				enabled = prefs.PriceAlertTriggered
			case title == "Ticket Status Updated" || title == "New Support Message":
				enabled = prefs.SupportTicketUpdated
			case nType == models.NotificationTypeSystem:
				enabled = prefs.SystemAnnouncements
			default:
				enabled = true // Default to true for other types
			}
		}

		if !enabled {
			return nil // Disabled by user preference
		}
	}

	notification := &models.Notification{
		UserID:  userID,
		Type:    nType,
		Title:   title,
		Message: message,
		Data:    data,
		Actions: actions,
	}

	// 1. Persist to Database
	err = s.repo.Create(ctx, notification)
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
