package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ActiveTradeUnit tracks an ongoing trade idea (scale-in/out) until quantity reaches zero.
// This is an internal tracking model and is NOT exposed directly to the frontend.
type ActiveTradeUnit struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
	InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
	Symbol       string             `bson:"symbol" json:"symbol"`
	Side         string             `bson:"side" json:"side"` // LONG or SHORT

	// Aggregated Totals
	EntryQuantity int     `bson:"entry_quantity" json:"entryQuantity"`
	ExitQuantity  int     `bson:"exit_quantity" json:"exitQuantity"`
	TotalEntryVal float64 `bson:"total_entry_val" json:"totalEntryVal"`
	TotalExitVal  float64 `bson:"total_exit_val" json:"totalExitVal"`
	TotalComms    float64 `bson:"total_comms" json:"totalComms"`

	// References for pluraity
	EntryOrderIDs []primitive.ObjectID `bson:"entry_order_ids" json:"entryOrderIds"`
	ExitOrderIDs  []primitive.ObjectID `bson:"exit_order_ids" json:"exitOrderIds"`

	// Time boundaries
	FirstEntryTime time.Time `bson:"first_entry_time" json:"firstEntryTime"`
	LastExitTime   time.Time `bson:"last_exit_time" json:"lastExitTime"`

	CreatedAt time.Time `bson:"created_at" json:"createdAt"`
}

// RemainingQty returns the current net quantity of the unit.
func (u *ActiveTradeUnit) RemainingQty() int {
	return u.EntryQuantity - u.ExitQuantity
}
