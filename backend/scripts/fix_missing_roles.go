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
	"aequitas/internal/models"
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

	// Find users where role is "" or missing
	filter := bson.M{
		"$or": []bson.M{
			{"role": ""},
			{"role": bson.M{"$exists": false}},
		},
	}

	update := bson.M{
		"$set": bson.M{
			"role":       models.RoleTrader,
			"updated_at": time.Now(),
		},
	}

	result, err := userColl.UpdateMany(ctx, filter, update)
	if err != nil {
		log.Fatal("Failed to update users:", err)
	}

	fmt.Printf("✓ Data Fix Complete!\n")
	fmt.Printf("-------------------\n")
	fmt.Printf("Matched Users: %d\n", result.MatchedCount)
	fmt.Printf("Updated Users: %d\n", result.ModifiedCount)
}
