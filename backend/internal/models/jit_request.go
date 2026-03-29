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
	ID            primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	MakerID       primitive.ObjectID   `bson:"maker_id" json:"makerId"`
	Checkers      []primitive.ObjectID `bson:"checkers,omitempty" json:"checkers"` // List of Approvers for Dual Auth
	Action        string               `bson:"action" json:"action"`             // e.g., "WALLET_ADJUSTMENT"
	ResourceID    primitive.ObjectID   `bson:"resource_id" json:"resourceId"`    // Target User ID or Resource
	Amount        float64              `bson:"amount,omitempty" json:"amount"`
	Reason        string               `bson:"reason" json:"reason"`
	Duration      int                  `bson:"duration" json:"duration"` // in minutes
	Status        JITStatus            `bson:"status" json:"status"`
	
	// Scoping & Safety (US-12.2)
	MaxAmount           float64 `bson:"max_amount,omitempty" json:"maxAmount"`
	MaxUses             int     `bson:"max_uses,omitempty" json:"maxUses"`
	CurrentUses         int     `bson:"current_uses" json:"currentUses"`
	IsDualAuthRequired  bool    `bson:"is_dual_auth_required" json:"isDualAuthRequired"`
	
	CreatedAt     time.Time  `bson:"created_at" json:"createdAt"`
	ApprovedAt    *time.Time `bson:"approved_at,omitempty" json:"approvedAt"`
	ExpiresAt     *time.Time `bson:"expires_at,omitempty" json:"expiresAt"`
}
