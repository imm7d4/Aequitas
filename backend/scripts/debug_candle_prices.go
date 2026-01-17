package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"aequitas/internal/config"
	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	cfg := config.New()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("aequitas")

	// 1. Get Instrument ID
	var inst models.Instrument
	err = db.Collection("instruments").FindOne(ctx, bson.M{"symbol": "RELIANCE"}).Decode(&inst)
	if err != nil {
		log.Fatalf("Failed to find RELIANCE: %v", err)
	}

	// 2. Fetch first 10 candles (oldest)
	opts := options.Find().SetSort(bson.D{{Key: "time", Value: 1}}).SetLimit(10)
	cursor, err := db.Collection("candles").Find(ctx, bson.M{"instrument_id": inst.ID}, opts)
	if err != nil {
		log.Fatalf("Failed to find candles: %v", err)
	}
	defer cursor.Close(ctx)

	var candles []models.Candle
	if err = cursor.All(ctx, &candles); err != nil {
		log.Fatalf("Failed to decode candles: %v", err)
	}

	fmt.Println("Oldest Candle Prices:")
	for _, c := range candles {
		fmt.Printf("Time: %v, Close: %f\n", c.Time, c.Close)
	}
}
