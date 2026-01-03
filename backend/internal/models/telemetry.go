package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TelemetryEvent struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	EventName      string             `bson:"event_name" json:"event_name"`
	EventVersion   string             `bson:"event_version" json:"event_version"`
	Classification string             `bson:"classification" json:"classification"`
	Severity       string             `bson:"severity,omitempty" json:"severity,omitempty"`
	Timestamp      time.Time          `bson:"timestamp" json:"timestamp"`
	SessionID      string             `bson:"session_id" json:"session_id"`
	CorrelationID  string             `bson:"correlation_id" json:"correlation_id"`
	Route          string             `bson:"route" json:"route"`
	Metadata       map[string]interface{} `bson:"metadata" json:"metadata"`
}

type TelemetryBatchRequest struct {
	Events []TelemetryEvent `json:"events"`
}
