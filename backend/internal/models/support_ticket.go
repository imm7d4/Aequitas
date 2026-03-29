package models

import (
	"time"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TicketStatus string

const (
	TicketStatusOpen       TicketStatus = "OPEN"
	TicketStatusInProgress TicketStatus = "IN_PROGRESS"
	TicketStatusResolved   TicketStatus = "RESOLVED"
	TicketStatusClosed     TicketStatus = "CLOSED"
)

type TicketPriority string

const (
	PriorityLow    TicketPriority = "LOW"
	PriorityMedium TicketPriority = "MEDIUM"
	PriorityHigh   TicketPriority = "HIGH"
	PriorityUrgent TicketPriority = "URGENT"
)

type SupportComment struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	AuthorID    string             `bson:"author_id" json:"authorId"`
	AuthorName  string             `bson:"author_name" json:"authorName"`
	Role        string             `bson:"role" json:"role"` // "ADMIN" or "USER"
	Message     string             `bson:"message" json:"message"`
	Attachments []string           `bson:"attachments,omitempty" json:"attachments,omitempty"` // Base64
	CreatedAt   time.Time          `bson:"created_at" json:"createdAt"`
}

type SupportTicket struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"userId"`
	UserName    string             `bson:"user_name" json:"userName"`
	UserEmail   string             `bson:"user_email" json:"userEmail"`
	Subject     string             `bson:"subject" json:"subject"`
	Description string             `bson:"description" json:"description"`
	Category    string             `bson:"category" json:"category"`
	Status      TicketStatus       `bson:"status" json:"status"`
	Priority    TicketPriority     `bson:"priority" json:"priority"`
	AssignedTo      primitive.ObjectID `bson:"assigned_to,omitempty" json:"assignedTo,omitempty"`
	CreatedAt       time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt       time.Time          `bson:"updated_at" json:"updatedAt"`
	FirstResponseAt *time.Time         `bson:"first_response_at,omitempty" json:"firstResponseAt,omitempty"`
	ResolvedAt      *time.Time         `bson:"resolved_at,omitempty" json:"resolvedAt,omitempty"`
	Comments        []SupportComment   `bson:"comments,omitempty" json:"comments,omitempty"`
	Attachments     []string           `bson:"attachments,omitempty" json:"attachments,omitempty"` // Base64
}
