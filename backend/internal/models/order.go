package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	OrderID      string             `bson:"order_id" json:"orderId"`
	UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
	AccountID    primitive.ObjectID `bson:"account_id" json:"accountId"`
	InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
	Symbol       string             `bson:"symbol" json:"symbol"`

	Side      string   `bson:"side" json:"side"`            // BUY / SELL
	OrderType string   `bson:"order_type" json:"orderType"` // MARKET / LIMIT / STOP / STOP_LIMIT / TRAILING_STOP
	Quantity  int      `bson:"quantity" json:"quantity"`
	Price     *float64 `bson:"price,omitempty" json:"price,omitempty"`

	// Stop Order Fields
	StopPrice  *float64 `bson:"stop_price,omitempty" json:"stopPrice,omitempty"`   // Trigger price for STOP and STOP_LIMIT
	LimitPrice *float64 `bson:"limit_price,omitempty" json:"limitPrice,omitempty"` // Limit price for STOP_LIMIT orders

	// Trailing Stop Fields
	TrailAmount      *float64 `bson:"trail_amount,omitempty" json:"trailAmount,omitempty"`           // Trail distance (percentage or absolute)
	TrailType        string   `bson:"trail_type,omitempty" json:"trailType,omitempty"`               // ABSOLUTE / PERCENTAGE
	CurrentStopPrice *float64 `bson:"current_stop_price,omitempty" json:"currentStopPrice,omitempty"` // Current trailing stop price
	HighestPrice     *float64 `bson:"highest_price,omitempty" json:"highestPrice,omitempty"`         // Highest price reached (for SELL trailing stops)
	LowestPrice      *float64 `bson:"lowest_price,omitempty" json:"lowestPrice,omitempty"`           // Lowest price reached (for BUY trailing stops)

	// Trigger Tracking
	TriggeredAt   *time.Time          `bson:"triggered_at,omitempty" json:"triggeredAt,omitempty"`     // When stop order was triggered
	TriggerPrice  *float64            `bson:"trigger_price,omitempty" json:"triggerPrice,omitempty"`   // Price at which order was triggered
	ParentOrderID *primitive.ObjectID `bson:"parent_order_id,omitempty" json:"parentOrderId,omitempty"` // Links triggered order to original stop order

	Status        string `bson:"status" json:"status"` // NEW, PENDING, TRIGGERED, FILLED, CANCELLED, REJECTED
	Source        string `bson:"source" json:"source"` // UI / API
	ClientOrderID string `bson:"client_order_id" json:"clientOrderId"`

	CreatedAt   time.Time `bson:"created_at" json:"createdAt"`
	UpdatedAt   time.Time `bson:"updated_at" json:"updatedAt"`
	ValidatedAt time.Time `bson:"validated_at" json:"validatedAt"`
}
