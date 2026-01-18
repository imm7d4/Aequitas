package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// TradeResult represents a fully closed economic unit (a "round-trip" trade).
// It is generated when entry quantity is fully matched by exit quantity via FIFO.
type TradeResult struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
	AccountID    primitive.ObjectID `bson:"account_id" json:"accountId"`
	InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
	Symbol       string             `bson:"symbol" json:"symbol"`
	Side         string             `bson:"side" json:"side"` // LONG or SHORT

	// Quantity and Prices
	Quantity      int     `bson:"quantity" json:"quantity"`
	AvgEntryPrice float64 `bson:"avg_entry_price" json:"avgEntryPrice"`
	AvgExitPrice  float64 `bson:"avg_exit_price" json:"avgExitPrice"`
	EntryNotional float64 `bson:"entry_notional" json:"entryNotional"` // Qty * AvgEntryPrice
	ExitNotional  float64 `bson:"exit_notional" json:"exitNotional"`   // Qty * AvgExitPrice

	// P&L Metrics
	GrossPNL         float64 `bson:"gross_pnl" json:"grossPNL"`                 // Pre-commission
	NetPNL           float64 `bson:"net_pnl" json:"netPNL"`                     // Post-commission
	TotalCommissions float64 `bson:"total_commissions" json:"totalCommissions"` // Entry + Exit fees

	// Return Analytics
	GrossReturnPct float64 `bson:"gross_return_pct" json:"grossReturnPct"` // GrossPNL / EntryNotional
	NetReturnPct   float64 `bson:"net_return_pct" json:"netReturnPct"`     // NetPNL / (EntryNotional + EntryComms)

	// Excursion Metrics (Professional Diagnostics)
	MAE float64 `bson:"mae" json:"mae"` // Maximum Adverse Excursion
	MFE float64 `bson:"mfe" json:"mfe"` // Maximum Favorable Excursion

	// Time Metrics
	EntryTime time.Time `bson:"entry_time" json:"entryTime"` // Earliest entry timestamp
	ExitTime  time.Time `bson:"exit_time" json:"exitTime"`   // Final exit timestamp
	Duration  string    `bson:"duration" json:"duration"`    // Human-readable (e.g., "1h 45m")

	// Audit & Governance
	EntryOrderIDs      []primitive.ObjectID `bson:"entry_order_ids" json:"entryOrderIds"` // Scale-in references
	ExitOrderIDs       []primitive.ObjectID `bson:"exit_order_ids" json:"exitOrderIds"`   // Scale-out references
	CalculationVersion int                  `bson:"calculation_version" json:"calculationVersion"`
	CreatedAt          time.Time            `bson:"created_at" json:"createdAt"`
}
