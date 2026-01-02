package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TradingAccount struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"userId"`
	Balance   float64            `bson:"balance" json:"balance"`
	Currency  string             `bson:"currency" json:"currency"`
	Status    string             `bson:"status" json:"status"`
	CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updatedAt"`
}
