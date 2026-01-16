package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"aequitas/internal/config"

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

	// Find RELIANCE holding and fix it or delete it
	// Deleting is cleaner for this "Invalid State"
	res, err := db.Collection("holdings").DeleteMany(ctx, bson.M{"symbol": "RELIANCE"})
	if err != nil {
		log.Fatalf("Failed to delete holdings: %v", err)
	}

	fmt.Printf("Deleted %d corrupted RELIANCE holdings.\n", res.DeletedCount)
}
