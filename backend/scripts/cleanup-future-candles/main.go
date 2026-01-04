package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Connect to MongoDB
	ctx := context.Background()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("aequitas")
	candlesCollection := db.Collection("candles")

	// Delete all candles with timestamps in the future
	now := time.Now()
	filter := bson.M{
		"time": bson.M{
			"$gt": now,
		},
	}

	result, err := candlesCollection.DeleteMany(ctx, filter)
	if err != nil {
		log.Fatal("Failed to delete future candles:", err)
	}

	log.Printf("Successfully deleted %d future candles from the database", result.DeletedCount)

	// Also delete all candles to start fresh (optional - uncomment if needed)
	// result, err = candlesCollection.DeleteMany(ctx, bson.M{})
	// if err != nil {
	// 	log.Fatal("Failed to delete all candles:", err)
	// }
	// log.Printf("Successfully deleted all %d candles from the database", result.DeletedCount)
}
