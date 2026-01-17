package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// 1. Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("aequitas")

	instrumentName := "RELIANCE"

	// 2. Find Instrument ID
	var instrument struct {
		ID interface{} `bson:"_id"`
	}
	err = db.Collection("instruments").FindOne(ctx, bson.M{"symbol": instrumentName}).Decode(&instrument)
	if err != nil {
		log.Fatalf("Failed to find instrument %s: %v", instrumentName, err)
	}
	fmt.Printf("Cleaning data for %s (ID: %v)\n", instrumentName, instrument.ID)

	// 3. Delete Market Data
	res, err := db.Collection("market_data").DeleteMany(ctx, bson.M{"instrument_id": instrument.ID})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Deleted %d market_data entries\n", res.DeletedCount)

	// 4. Delete Candles
	res, err = db.Collection("candles").DeleteMany(ctx, bson.M{"instrument_id": instrument.ID})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Deleted %d candles\n", res.DeletedCount)

	fmt.Println("Reset complete. Backend pricing service should naturally regenerate fresh data starting from base price.")
}
