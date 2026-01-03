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
	OrderType string   `bson:"order_type" json:"orderType"` // MARKET / LIMIT
	Quantity  int      `bson:"quantity" json:"quantity"`
	Price     *float64 `bson:"price,omitempty" json:"price,omitempty"`

	Status        string `bson:"status" json:"status"` // NEW, PENDING, FILLED, CANCELLED, REJECTED
	Source        string `bson:"source" json:"source"` // UI / API
	ClientOrderID string `bson:"client_order_id" json:"clientOrderId"`

	CreatedAt   time.Time `bson:"created_at" json:"createdAt"`
	UpdatedAt   time.Time `bson:"updated_at" json:"updatedAt"`
	ValidatedAt time.Time `bson:"validated_at" json:"validatedAt"`
}
