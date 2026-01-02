package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MarketHours struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Exchange        string             `bson:"exchange" json:"exchange"`
	DayOfWeek       int                `bson:"day_of_week" json:"dayOfWeek"`
	PreMarketStart  string             `bson:"pre_market_start" json:"preMarketStart"`
	PreMarketEnd    string             `bson:"pre_market_end" json:"preMarketEnd"`
	MarketOpen      string             `bson:"market_open" json:"marketOpen"`
	MarketClose     string             `bson:"market_close" json:"marketClose"`
	PostMarketStart string             `bson:"post_market_start" json:"postMarketStart"`
	PostMarketEnd   string             `bson:"post_market_end" json:"postMarketEnd"`
	IsHoliday       bool               `bson:"is_holiday" json:"isHoliday"`
	CreatedAt       time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt       time.Time          `bson:"updated_at" json:"updatedAt"`
}

type MarketHoliday struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Exchange  string             `bson:"exchange" json:"exchange"`
	Date      time.Time          `bson:"date" json:"date"`
	Name      string             `bson:"name" json:"name"`
	CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
}
