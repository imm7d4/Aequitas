package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Watchlist struct {
	ID            primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	UserID        primitive.ObjectID   `bson:"user_id" json:"userId"`
	Name          string               `bson:"name" json:"name"`
	InstrumentIDs []primitive.ObjectID `bson:"instrument_ids" json:"instrumentIds"`
	IsDefault     bool                 `bson:"is_default" json:"isDefault"`
	CreatedAt     time.Time            `bson:"created_at" json:"createdAt"`
	UpdatedAt     time.Time            `bson:"updated_at" json:"updatedAt"`
}
