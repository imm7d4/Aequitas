package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TradingAccount struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID            primitive.ObjectID `bson:"user_id" json:"userId"`
	Balance           float64            `bson:"balance" json:"balance"`
	BlockedMargin     float64            `bson:"blocked_margin" json:"blockedMargin"` // For Short Positions
	RealizedPL        float64            `bson:"realized_pl" json:"realizedPL"`
	FreeCash          float64            `bson:"free_cash" json:"freeCash"`                   // Withdrawable cash
	MarginCash        float64            `bson:"margin_cash" json:"marginCash"`               // Locked as collateral
	SettlementPending float64            `bson:"settlement_pending" json:"settlementPending"` // T+1/T+2 unsettled
	Currency          string             `bson:"currency" json:"currency"`
	Status            string             `bson:"status" json:"status"`
	CreatedAt         time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt         time.Time          `bson:"updated_at" json:"updatedAt"`
}
