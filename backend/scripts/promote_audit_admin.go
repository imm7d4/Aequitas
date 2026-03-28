package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"aequitas/internal/config"
	"aequitas/internal/models"
	"aequitas/internal/utils"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: go run promote_audit_admin.go <email>")
	}
	email := os.Args[1]

	// Load environment variables
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found at ../../.env, trying root .env...")
		godotenv.Load(".env")
	}

	cfg := config.New()

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(context.Background())

	db := client.Database("aequitas")
	collection := db.Collection("users")

	// 1. Check if user already exists
	var existing models.User
	err = collection.FindOne(ctx, bson.M{"email": email}).Decode(&existing)
	if err == nil {
		log.Fatalf("Error: User with email %s already exists with role %s", email, existing.Role)
	}

	// 2. Create new Audit Admin
	now := time.Now()
	hashedPassword, _ := utils.HashPassword("Admin@123")
	newUser := models.User{
		ID:           primitive.NewObjectID(),
		Email:        email,
		Password:     hashedPassword,
		FullName:     "Audit Admin",
		DisplayName:  "Audit Admin",
		IsAdmin:      true,
		Role:         "AUDIT_ADMIN",
		Status:       "ACTIVE",
		KYCStatus:    "VERIFIED",
		CreatedAt:    now,
		UpdatedAt:    now,
		Preferences: models.UserPreferences{
			Theme:                "dark",
			DefaultPage:          "audit-logs",
			NotificationsEnabled: true,
		},
	}

	_, err = collection.InsertOne(ctx, newUser)
	if err != nil {
		log.Fatal("Failed to create user:", err)
	}

	fmt.Printf("Successfully created new AUDIT_ADMIN: %s\n", email)
}
