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
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Email       string             `bson:"email" json:"email"`
	Password    string             `bson:"password" json:"-"`
	FullName    string             `bson:"full_name" json:"fullName"`
	DisplayName string             `bson:"display_name" json:"displayName"`
	Bio         string             `bson:"bio" json:"bio"`
	Avatar      string             `bson:"avatar" json:"avatar"`
	LastLoginAt *time.Time         `bson:"last_login_at,omitempty" json:"lastLoginAt,omitempty"`
	LastLoginIP string             `bson:"last_login_ip,omitempty" json:"lastLoginIP,omitempty"`
	Preferences UserPreferences    `bson:"preferences" json:"preferences"`
	IsAdmin     bool               `bson:"is_admin" json:"isAdmin"`
	Status      string             `bson:"status" json:"status"`
	CreatedAt   time.Time          `bson:"created_at" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updatedAt"`
}
