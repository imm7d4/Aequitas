package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AlertSeverity string

const (
	SeverityInfo     AlertSeverity = "INFO"
	SeverityWarning  AlertSeverity = "WARNING"
	SeverityCritical AlertSeverity = "CRITICAL"
)

type ThresholdConfig struct {
	MetricName   string        `bson:"metric_name" json:"metricName"`
	Value        float64       `bson:"value" json:"value"`
	Severity     AlertSeverity `bson:"severity" json:"severity"`
	IsEnabled    bool          `bson:"is_enabled" json:"isEnabled"`
}

type AdminConfig struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	AlertThresholds   []ThresholdConfig  `bson:"alert_thresholds" json:"alertThresholds"`
	MaintenanceMode   bool               `bson:"maintenance_mode" json:"maintenanceMode"`
	IsGlobalHalt      bool               `bson:"is_global_halt" json:"isGlobalHalt"`      // Safety Halt (US-12.3)
	HaltReason        string             `bson:"halt_reason" json:"haltReason"`
	UpdatedBy         primitive.ObjectID `bson:"updated_by" json:"updatedBy"`
	UpdatedAt         time.Time          `bson:"updated_at" json:"updatedAt"`
}
