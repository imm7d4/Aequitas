package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PortfolioSnapshot struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID        primitive.ObjectID `bson:"user_id" json:"userId"`
	Date          time.Time          `bson:"date" json:"date"`
	TotalEquity   float64            `bson:"total_equity" json:"totalEquity"`
	CashBalance   float64            `bson:"cash_balance" json:"cashBalance"`
	HoldingsValue float64            `bson:"holdings_value" json:"holdingsValue"`
	CreatedAt     time.Time          `bson:"created_at" json:"createdAt"`
}
