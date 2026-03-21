package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OTPPurpose string

const (
	OTPPurposeFundTransfer OTPPurpose = "FUND_TRANSFER"
	OTPPurposeLogin        OTPPurpose = "LOGIN"
)

type OTPRecord struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"userId"`
	Purpose   OTPPurpose         `bson:"purpose" json:"purpose"`
	CodeHash  string             `bson:"code_hash" json:"-"` // BCrypt hash of the 6-digit code
	ExpiresAt time.Time          `bson:"expires_at" json:"expiresAt"`
	CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
}
