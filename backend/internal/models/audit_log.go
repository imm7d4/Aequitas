package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AuditLog struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Timestamp     time.Time          `bson:"timestamp" json:"timestamp"`
	ActorID       string             `bson:"actor_id" json:"actor_id"`
	ActorName     string             `bson:"actor_name" json:"actor_name"`
	ActorRole     string             `bson:"actor_role" json:"actor_role"`
	Action        string             `bson:"action" json:"action"`
	ResourceID    string             `bson:"resource_id" json:"resource_id"`
	ResourceType  string             `bson:"resource_type" json:"resource_type"`
	Description   string             `bson:"description" json:"description"` // Human-friendly description
	OldValue      interface{}        `bson:"old_value,omitempty" json:"old_value,omitempty"`
	NewValue      interface{}        `bson:"new_value,omitempty" json:"new_value,omitempty"`
	Metadata      map[string]interface{} `bson:"metadata,omitempty" json:"metadata,omitempty"`
	IPAddress     string             `bson:"ip_address" json:"ip_address"`
	UserAgent     string             `bson:"user_agent" json:"user_agent"`
	PreviousHash  string             `bson:"previous_hash" json:"previous_hash"`
	Hash          string             `bson:"hash" json:"hash"`
	CorrelationID string             `bson:"correlation_id" json:"correlation_id"` // US-12.4
}
