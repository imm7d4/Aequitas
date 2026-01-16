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

	// 2. Find RELIANCE Instrument ID
	var instrument struct {
		ID interface{} `bson:"_id"`
	}
	err = db.Collection("instruments").FindOne(ctx, bson.M{"symbol": "RELIANCE"}).Decode(&instrument)
	if err != nil {
		log.Fatalf("Failed to find RELIANCE: %v", err)
	}
	fmt.Printf("Found RELIANCE ID: %v\n", instrument.ID)

	// 3. Scan for outliers (High > 1800 or Low < 500)
	// The bad candle in screenshot is ~1900
	cursor, err := db.Collection("candles").Find(ctx, bson.M{
		"instrument_id": instrument.ID,
		"high":          bson.M{"$gt": 1500}, // Threshold for "Bad" data given current price is ~1000
	})
	if err != nil {
		log.Fatal(err)
	}

	var candles []bson.M
	if err = cursor.All(ctx, &candles); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Found %d outlier candles > 1500:\n", len(candles))
	for _, c := range candles {
		fmt.Printf("Time: %v, Open: %v, High: %v, Low: %v, Close: %v\n", c["time"], c["open"], c["high"], c["low"], c["close"])
	}

	// Also check for the "transition" candle
	// Find candles where (High - Low) > 100
	cursor, err = db.Collection("candles").Find(ctx, bson.M{
		"instrument_id": instrument.ID,
		"$expr":         bson.M{"$gt": []interface{}{bson.M{"$subtract": []interface{}{"$high", "$low"}}, 100}},
	})
	if err != nil {
		log.Fatal(err)
	}
	var volatileCandles []bson.M
	if err = cursor.All(ctx, &volatileCandles); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("\nFound %d highly volatile candles (High-Low > 100):\n", len(volatileCandles))
	for _, c := range volatileCandles {
		fmt.Printf("Time: %v, Open: %v, High: %v, Low: %v, Close: %v\n", c["time"], c["open"], c["high"], c["low"], c["close"])
	}
}
