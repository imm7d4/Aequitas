package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)


type PositionType string

const (
	PositionLong  PositionType = "LONG"
	PositionShort PositionType = "SHORT"
)

type MarginStatus string

const (
	MarginOK       MarginStatus = "OK"
	MarginCall     MarginStatus = "CALL"
	MarginCritical MarginStatus = "CRITICAL"
)

type Holding struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
	AccountID    primitive.ObjectID `bson:"account_id" json:"accountId"`
	InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
	Symbol       string             `bson:"symbol" json:"symbol"`

	// Position Details
	Quantity      int          `bson:"quantity" json:"quantity"`           // Always positive
	PositionType  PositionType `bson:"position_type" json:"positionType"` // LONG / SHORT
	AvgEntryPrice float64      `bson:"avg_entry_price" json:"avgEntryPrice"` // Renamed from AvgCost
	TotalCost     float64      `bson:"total_cost" json:"totalCost"`
	TotalFees     float64      `bson:"total_fees" json:"totalFees"`

	// P&L Tracking
	RealizedPL   float64 `bson:"realized_pl" json:"realizedPL"`
	UnrealizedPL float64 `bson:"unrealized_pl" json:"unrealizedPL"`
	TotalPL      float64 `bson:"total_pl" json:"totalPL"`

	// Margin Tracking (Shorts)
	BlockedMargin float64      `bson:"blocked_margin" json:"blockedMargin"`
	InitialMargin float64      `bson:"initial_margin" json:"initialMargin"`
	MarginStatus  MarginStatus `bson:"margin_status" json:"marginStatus"`

	// Compliance
	ShortSellDisclosureAccepted bool      `bson:"short_sell_disclosure_accepted,omitempty" json:"shortSellDisclosureAccepted,omitempty"`
	DisclosureTimestamp         time.Time `bson:"disclosure_timestamp,omitempty" json:"disclosureTimestamp,omitempty"`

	LastUpdated time.Time `bson:"last_updated" json:"lastUpdated"`
	CreatedAt   time.Time `bson:"created_at" json:"createdAt"`
}
