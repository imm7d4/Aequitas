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

	// Find RELIANCE holding
	var holding models.Holding
	err = db.Collection("holdings").FindOne(ctx, bson.M{"symbol": "RELIANCE"}).Decode(&holding)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			fmt.Println("Holding: NOT FOUND")
		} else {
			log.Fatalf("Failed to find holding: %v", err)
		}
	} else {
		fmt.Printf("Holding Found:\n")
		fmt.Printf("- Symbol: %s\n", holding.Symbol)
		fmt.Printf("- Quantity: %d\n", holding.Quantity)
		fmt.Printf("- PositionType: %s\n", holding.PositionType)
		fmt.Printf("- AvgEntryPrice: %f\n", holding.AvgEntryPrice)
	}
}
