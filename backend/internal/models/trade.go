package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Trade struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	TradeID      string             `bson:"trade_id" json:"tradeId"` // Unique trade identifier ORD-XXXX-T-XXXX
	OrderID      primitive.ObjectID `bson:"order_id" json:"orderId"`
	UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
	AccountID    primitive.ObjectID `bson:"account_id" json:"accountId"`
	InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
	Symbol       string             `bson:"symbol" json:"symbol"`

	Side     string  `bson:"side" json:"side"`     // BUY / SELL
	Intent   string  `bson:"intent" json:"intent"` // OPEN_LONG / OPEN_SHORT / CLOSE_LONG / CLOSE_SHORT
	Quantity int     `bson:"quantity" json:"quantity"`
	Price    float64 `bson:"price" json:"price"`        // Execution price
	Value    float64 `bson:"value" json:"value"`        // Qty * Price
	NetValue float64 `bson:"net_value" json:"netValue"` // Value +/- Fees

	Commission float64 `bson:"commission" json:"commission"`
	Fees       float64 `bson:"fees" json:"fees"` // Flat fees, taxes, etc.

	ExecutedAt time.Time `bson:"executed_at" json:"executedAt"`
	CreatedAt  time.Time `bson:"created_at" json:"createdAt"`
}
