package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// NotificationType defines the category of the notification
type NotificationType string

const (
	NotificationTypeOrder   NotificationType = "ORDER"
	NotificationTypeSystem  NotificationType = "SYSTEM"
	NotificationTypeAlert   NotificationType = "ALERT"
	NotificationTypeAccount NotificationType = "ACCOUNT"
)

// NotificationAction represents an actionable link in a notification
type NotificationAction struct {
	Label string `json:"label" bson:"label"`
	Link  string `json:"link" bson:"link"`
}

// Notification represents a system notification for a user
type Notification struct {
	ID        primitive.ObjectID     `json:"id" bson:"_id,omitempty"`
	UserID    string                 `json:"userId" bson:"userId"`
	Type      NotificationType       `json:"type" bson:"type"`
	Title     string                 `json:"title" bson:"title"`
	Message   string                 `json:"message" bson:"message"`
	Data      map[string]interface{} `json:"data,omitempty" bson:"data,omitempty"` // Flexible payload for frontend
	Actions   []NotificationAction   `json:"actions,omitempty" bson:"actions,omitempty"`
	IsRead    bool                   `json:"isRead" bson:"isRead"`
	CreatedAt time.Time              `json:"createdAt" bson:"createdAt"`
	ExpiresAt *time.Time             `json:"expiresAt,omitempty" bson:"expiresAt,omitempty"`
}
