package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Holding struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
	AccountID    primitive.ObjectID `bson:"account_id" json:"accountId"`
	InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
	Symbol       string             `bson:"symbol" json:"symbol"`

	Quantity  int     `bson:"quantity" json:"quantity"`
	AvgCost   float64 `bson:"avg_cost" json:"avgCost"`     // Weighted Average Price
	TotalCost float64 `bson:"total_cost" json:"totalCost"` // Quantity * AvgCost
	TotalFees float64 `bson:"total_fees" json:"totalFees"` // Accumulated fees for position tracking

	RealizedPL float64 `bson:"realized_pl" json:"realizedPL"` // Accumulated P&L from selling

	LastUpdated time.Time `bson:"last_updated" json:"lastUpdated"`
	CreatedAt   time.Time `bson:"created_at" json:"createdAt"`
}
