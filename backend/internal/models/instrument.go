package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Instrument struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Symbol      string             `bson:"symbol" json:"symbol"`
	Name        string             `bson:"name" json:"name"`
	ISIN        string             `bson:"isin" json:"isin"`
	Exchange    string             `bson:"exchange" json:"exchange"`
	Type        string             `bson:"type" json:"type"`
	Sector      string             `bson:"sector" json:"sector"`
	LotSize     int                `bson:"lot_size" json:"lotSize"`
	TickSize    float64            `bson:"tick_size" json:"tickSize"`
	Status      string             `bson:"status" json:"status"`
	ListingDate time.Time          `bson:"listing_date" json:"listingDate"`
	CreatedAt   time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updatedAt"`
}
