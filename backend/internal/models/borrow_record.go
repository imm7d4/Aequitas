package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type BorrowRecord struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
	InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
	Quantity     int                `bson:"quantity" json:"quantity"`
	BorrowRate   float64            `bson:"borrow_rate" json:"borrowRate"` // Daily fee
	BorrowedAt   time.Time          `bson:"borrowed_at" json:"borrowedAt"`
	ReturnedAt   *time.Time         `bson:"returned_at,omitempty" json:"returnedAt,omitempty"`
}
