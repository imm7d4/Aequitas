package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"aequitas/internal/config"
)

func main() {
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

	// Find 10 most recent users
	filter := bson.M{}
	opts := options.Find().SetSort(bson.M{"created_at": -1}).SetLimit(10)
	cursor, err := userColl.Find(ctx, filter, opts)
	if err != nil {
		log.Fatal("Failed to fetch users:", err)
	}
	defer cursor.Close(ctx)

	fmt.Printf("Recent Users Onboarding State:\n")
	fmt.Printf("------------------------------\n")
	for cursor.Next(ctx) {
		var user bson.M
		if err := cursor.Decode(&user); err != nil {
			log.Printf("Error decoding user: %v", err)
			continue
		}
		fmt.Printf("Email:    %v\n", user["email"])
		fmt.Printf("Complete: %v\n", user["is_onboarding_complete"])
		fmt.Printf("Skipped:  %v\n", user["onboarding_skipped"])
		fmt.Printf("--- \n")
	}
}
