package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserPreferences struct {
	Theme                string `bson:"theme" json:"theme"`
	DefaultPage          string `bson:"default_page" json:"defaultPage"`
	NotificationsEnabled bool   `bson:"notifications_enabled" json:"notificationsEnabled"`
}

type User struct {
	ID                    primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email                 string             `bson:"email" json:"email"`
	Phone                 string             `bson:"phone" json:"phone"`
	Password              string             `bson:"password" json:"-"`
	FullName              string             `bson:"full_name" json:"fullName"`
	DisplayName           string             `bson:"display_name" json:"displayName"`
	Bio                   string             `bson:"bio" json:"bio"`
	Avatar                string             `bson:"avatar" json:"avatar"`
	LastLoginAt           *time.Time         `bson:"last_login_at,omitempty" json:"lastLoginAt,omitempty"`
	LastLoginIP           string             `bson:"last_login_ip,omitempty" json:"lastLoginIP,omitempty"`
	LastActivityAt        *time.Time         `bson:"last_activity_at,omitempty" json:"lastActivityAt,omitempty"`
	Preferences           UserPreferences    `bson:"preferences" json:"preferences"`
	IsAdmin               bool               `bson:"is_admin" json:"isAdmin"`
	Role                  string             `bson:"role" json:"role"`
	Status                string             `bson:"status" json:"status"`
	KYCStatus             string             `bson:"kyc_status" json:"kycStatus"`
	IsOnboardingComplete  bool               `bson:"is_onboarding_complete" json:"isOnboardingComplete"`
	IsTestAccount         bool               `bson:"is_test_account" json:"isTestAccount"` // For Gated Maintenance access (US-12.3)
	OnboardingSkipped     bool               `bson:"onboarding_skipped" json:"onboardingSkipped"`
	OnboardingCompletedAt *time.Time         `bson:"onboarding_completed_at,omitempty" json:"onboardingCompletedAt,omitempty"`
	SessionVersion        int                `bson:"session_version" json:"sessionVersion"` // US-12.5
	CreatedAt             time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt             time.Time          `bson:"updated_at" json:"updatedAt"`
}
