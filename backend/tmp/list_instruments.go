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
	coll := db.Collection("instruments")

	cursor, err := coll.Find(ctx, bson.M{"status": "ACTIVE"}, options.Find().SetLimit(5))
	if err != nil {
		log.Fatalf("Failed to find instruments: %v", err)
	}
	defer cursor.Close(ctx)

	var instruments []models.Instrument
	if err = cursor.All(ctx, &instruments); err != nil {
		log.Fatalf("Failed to decode instruments: %v", err)
	}

	fmt.Println("Active Instruments:")
	for _, inst := range instruments {
		fmt.Printf("- %s (%s): %s\n", inst.Symbol, inst.Name, inst.ID.Hex())
	}
}
