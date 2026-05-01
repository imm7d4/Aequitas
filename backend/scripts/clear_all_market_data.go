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
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("aequitas")

	// 1. Clear Market Data
	res, err := db.Collection("market_data").DeleteMany(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Deleted %d market_data entries\n", res.DeletedCount)

	// 2. Clear Candles
	res, err = db.Collection("candles").DeleteMany(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Deleted %d candle entries\n", res.DeletedCount)

	fmt.Println("Database cleared successfully. Start the backend to see fresh movements.")
}
