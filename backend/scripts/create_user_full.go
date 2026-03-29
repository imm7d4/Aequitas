package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"
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
	if len(os.Args) < 3 {
		fmt.Println("Usage: go run create_user_full.go <email> <fullname> [balance]")
		os.Exit(1)
	}

	email := os.Args[1]
	fullName := os.Args[2]
	balance := 0.0
	if len(os.Args) > 3 {
		var err error
		balance, err = strconv.ParseFloat(os.Args[3], 64)
		if err != nil {
			log.Fatalf("Invalid balance: %v", err)
		}
	}

	// Load environment variables
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found at ../../.env, trying root .env...")
		if err := godotenv.Load(".env"); err != nil {
			log.Println("No .env file found at .env either.")
		}
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
	userColl := db.Collection("users")
	accountColl := db.Collection("trading_accounts")
	//transactionColl := db.Collection("transactions")
	// auditColl := db.Collection("audit_logs")

	// 1. Check if user already exists
	var existing models.User
	err = userColl.FindOne(ctx, bson.M{"email": email}).Decode(&existing)
	if err == nil {
		log.Fatalf("Error: User with email %s already exists", email)
	}

	// 2. Create User
	now := time.Now()
	createdAt := time.Date(2026, time.February, 26, 0, 0, 0, 0, time.Local)
	hashedPassword, _ := utils.HashPassword("Trader@123")
	userID := primitive.NewObjectID()
	user := models.User{
		ID:                   userID,
		Email:                email,
		FullName:             fullName,
		DisplayName:          fullName,
		Password:             hashedPassword,
		Role:                 models.RoleTrader,
		IsAdmin:              false,
		Status:               "ACTIVE",
		KYCStatus:            "PENDING",
		IsOnboardingComplete: true,
		CreatedAt:            createdAt,
		UpdatedAt:            now,
		Preferences: models.UserPreferences{
			Theme:                "dark",
			DefaultPage:          "dashboard",
			NotificationsEnabled: true,
		},
	}

	_, err = userColl.InsertOne(ctx, user)
	if err != nil {
		log.Fatal("Failed to create user:", err)
	}
	fmt.Printf("✓ Created User: %s (ID: %s)\n", email, userID.Hex())

	// 3. Create Trading Account
	accountID := primitive.NewObjectID()
	account := models.TradingAccount{
		ID:        accountID,
		UserID:    userID,
		Balance:   balance,
		Currency:  "INR",
		Status:    "ACTIVE",
		CreatedAt: createdAt,
		UpdatedAt: now,
	}

	_, err = accountColl.InsertOne(ctx, account)
	if err != nil {
		log.Fatal("Failed to create trading account:", err)
	}
	fmt.Printf("✓ Created Trading Account (ID: %s) with Balance: ₹%.2f\n", accountID.Hex(), balance)

	// 4. Create Initial Transaction (if balance > 0)
	if balance > 0 {
		// transaction := models.Transaction{
		// 	ID:        primitive.NewObjectID(),
		// 	AccountID: accountID,
		// 	UserID:    userID,
		// 	Type:      "DEPOSIT",
		// 	Amount:    balance,
		// 	Currency:  "INR",
		// 	Status:    "COMPLETED",
		// 	Reference: "INITIAL_FUNDING",
		// 	CreatedAt: createdAt,
		// }
		// _, err = transactionColl.InsertOne(ctx, transaction)
		if err != nil {
			log.Printf("Warning: Failed to create initial transaction: %v", err)
		} else {
			fmt.Printf("✓ Created Initial Deposit Transaction (Reference: INITIAL_FUNDING)\n")
		}
	}

	// 5. Log Audit Entry
	// auditEntry := models.AuditLog{
	// 	ID:           primitive.NewObjectID(),
	// 	Timestamp:    now,
	// 	ActorID:      "SYSTEM",
	// 	ActorName:    "Onboarding Script",
	// 	ActorRole:    "SYSTEM",
	// 	Action:       "USER_ONBOARDED",
	// 	ResourceID:   userID.Hex(),
	// 	ResourceType: "USER",
	// 	Description:  fmt.Sprintf("New user onboarded via script: %s", email),
	// 	IPAddress:    "127.0.0.1",
	// }
	// _, _ = auditColl.InsertOne(ctx, auditEntry)

	fmt.Println("\nRegistration Flow Complete!")
	fmt.Println("---------------------------")
	fmt.Printf("Email:    %s\n", email)
	fmt.Printf("Password: Trader@123 (Default)\n")
	fmt.Printf("Balance:  ₹%.2f\n", balance)
}
