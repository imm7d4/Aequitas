package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Candle represents an OHLC (Open, High, Low, Close) candle
type Candle struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
	Interval     string             `bson:"interval" json:"interval"` // "1m", "5m", "15m", "1h", "1d"
	Time         time.Time          `bson:"time" json:"time"`
	Open         float64            `bson:"open" json:"open"`
	High         float64            `bson:"high" json:"high"`
	Low          float64            `bson:"low" json:"low"`
	Close        float64            `bson:"close" json:"close"`
	Volume       int64              `bson:"volume" json:"volume"`
	CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
}
