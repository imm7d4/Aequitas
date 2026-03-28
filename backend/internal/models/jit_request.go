package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JITStatus string

const (
	JITStatusPending  JITStatus = "PENDING"
	JITStatusApproved JITStatus = "APPROVED"
	JITStatusRejected JITStatus = "REJECTED"
	JITStatusExpired  JITStatus = "EXPIRED"
)

type JITRequest struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	MakerID       primitive.ObjectID `bson:"maker_id" json:"makerId"`
	CheckerID     *primitive.ObjectID `bson:"checker_id,omitempty" json:"checkerId"`
	Action        string             `bson:"action" json:"action"` // e.g., "WALLET_CREDIT", "WALLET_DEBIT"
	ResourceID    primitive.ObjectID `bson:"resource_id" json:"resourceId"` // Target User ID
	Amount        float64            `bson:"amount,omitempty" json:"amount"`
	Reason        string             `bson:"reason" json:"reason"`
	Duration      int                `bson:"duration" json:"duration"` // in minutes
	Status        JITStatus          `bson:"status" json:"status"`
	CreatedAt     time.Time          `bson:"created_at" json:"createdAt"`
	ApprovedAt    *time.Time         `bson:"approved_at,omitempty" json:"approvedAt"`
	ExpiresAt     *time.Time         `bson:"expires_at,omitempty" json:"expiresAt"`
}
