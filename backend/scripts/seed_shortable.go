package main

import (
	"context"
	"log"
	"time"

	"aequitas/internal/config"
	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Load configuration
	cfg := config.New()

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("aequitas")
	instrumentCollection := db.Collection("instruments")

	log.Println("Connected to MongoDB. Starting update...")

	// List of F&O stocks (simplified list for MVP)
	fnoStocks := []string{
		"RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK",
		"TATAMOTORS", "SBIN", "BHARTIARTL", "ITC", "KOTAKBANK",
		"LT", "AXISBANK", "MARUTI", "SUNPHARMA", "ULTRACEMCO",
	}

	filter := bson.M{"symbol": bson.M{"$in": fnoStocks}}
	update := bson.M{"$set": bson.M{"is_shortable": true}}

	result, err := instrumentCollection.UpdateMany(ctx, filter, update)
	if err != nil {
		log.Fatalf("Failed to update instruments: %v", err)
	}

	log.Printf("Updated %d instruments to be shortable.", result.ModifiedCount)

	// Verify update
	var instruments []models.Instrument
	cursor, err := instrumentCollection.Find(ctx, bson.M{"is_shortable": true})
	if err != nil {
		log.Fatalf("Failed to fetch updated instruments: %v", err)
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &instruments); err != nil {
		log.Fatalf("Failed to decode instruments: %v", err)
	}

	log.Println("Shortable Instruments:")
	for _, inst := range instruments {
		log.Printf("- %s", inst.Symbol)
	}
}
