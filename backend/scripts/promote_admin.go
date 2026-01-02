package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"aequitas/internal/config"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: go run promote_admin.go <email>")
	}
	email := os.Args[1]

	// Load environment variables
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found")
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

	filter := bson.M{"email": email}
	update := bson.M{"$set": bson.M{"is_admin": true}}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Fatal("Failed to update user:", err)
	}

	if result.MatchedCount == 0 {
		fmt.Printf("User with email %s not found\n", email)
	} else {
		fmt.Printf("Successfully promoted %s to Admin!\n", email)
	}
}
