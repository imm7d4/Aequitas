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

	// 2. Check Market Data
	var md models.MarketData
	err = db.Collection("market_data").FindOne(ctx, bson.M{"instrument_id": inst.ID}).Decode(&md)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Println("Market Data: NOT FOUND")
		} else {
			log.Fatalf("Failed to find Market Data: %v", err)
		}
	} else {
		fmt.Printf("Market Data Found: Price=%f, Volume=%d, UpdatedAt=%v\n", md.LastPrice, md.Volume, md.UpdatedAt)
	}
}
