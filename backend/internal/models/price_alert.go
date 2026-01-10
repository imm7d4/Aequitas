package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AlertCondition string

const (
	AlertConditionAbove AlertCondition = "ABOVE"
	AlertConditionBelow AlertCondition = "BELOW"
)

type AlertStatus string

const (
	AlertStatusActive    AlertStatus = "ACTIVE"
	AlertStatusTriggered AlertStatus = "TRIGGERED"
	AlertStatusCancelled AlertStatus = "CANCELLED"
)

type PriceAlert struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       primitive.ObjectID `bson:"userId" json:"userId"`
	InstrumentID primitive.ObjectID `bson:"instrumentId" json:"instrumentId"`
	Symbol       string             `bson:"symbol" json:"symbol"`
	TargetPrice  float64            `bson:"targetPrice" json:"targetPrice"`
	Condition    AlertCondition     `bson:"condition" json:"condition"` // ABOVE or BELOW
	Status       AlertStatus        `bson:"status" json:"status"`
	CreatedAt    time.Time          `bson:"createdAt" json:"createdAt"`
	TriggeredAt  *time.Time         `bson:"triggeredAt,omitempty" json:"triggeredAt,omitempty"`
}
