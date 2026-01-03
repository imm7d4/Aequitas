package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Transaction struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	AccountID primitive.ObjectID `bson:"account_id" json:"accountId"`
	UserID    primitive.ObjectID `bson:"user_id" json:"userId"`
	Type      string             `bson:"type" json:"type"` // DEPOSIT, WITHDRAWAL, TRADE, FEE
	Amount    float64            `bson:"amount" json:"amount"`
	Currency  string             `bson:"currency" json:"currency"`
	Status    string             `bson:"status" json:"status"`       // COMPLETED, PENDING, FAILED
	Reference string             `bson:"reference" json:"reference"` // External ID or Trade ID
	CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
}
