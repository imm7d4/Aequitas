package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MarketData struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
	Symbol       string             `bson:"symbol" json:"symbol"`
	LastPrice    float64            `bson:"last_price" json:"lastPrice"`
	Change       float64            `bson:"change" json:"change"`
	ChangePct    float64            `bson:"change_pct" json:"changePct"`
	PrevClose    float64            `bson:"prev_close" json:"prevClose"`
	Open         float64            `bson:"open" json:"open"`
	High         float64            `bson:"high" json:"high"`
	Low          float64            `bson:"low" json:"low"`
	Volume       int64              `bson:"volume" json:"volume"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updatedAt"`
}
