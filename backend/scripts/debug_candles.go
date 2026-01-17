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
	fmt.Printf("Instrument ID: %s\n", inst.ID.Hex())

	// 2. Count Candles
	count, err := db.Collection("candles").CountDocuments(ctx, bson.M{"instrument_id": inst.ID})
	if err != nil {
		log.Fatalf("Failed to count candles: %v", err)
	}
	fmt.Printf("Total Candles Found: %d\n", count)

	// 3. Get Latest Candle
	var candle models.Candle
	opts := options.FindOne().SetSort(bson.D{{Key: "time", Value: -1}})
	err = db.Collection("candles").FindOne(ctx, bson.M{"instrument_id": inst.ID}, opts).Decode(&candle)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Println("Latest Candle: NONE")
		} else {
			log.Fatalf("Failed to get latest candle: %v", err)
		}
	} else {
		fmt.Printf("Latest Candle: Time=%v, Close=%f\n", candle.Time, candle.Close)
	}
}
