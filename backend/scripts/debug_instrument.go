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

	var inst models.Instrument
	err = coll.FindOne(ctx, bson.M{"symbol": "RELIANCE"}).Decode(&inst)
	if err != nil {
		log.Fatalf("Failed to find RELIANCE: %v", err)
	}

	fmt.Printf("Instrument: %+v\n", inst)
	fmt.Printf("Status: %s\n", inst.Status)
	fmt.Printf("Is Shortable: %v\n", inst.IsShortable)
}
