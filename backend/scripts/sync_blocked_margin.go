package main

import (
	"context"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Connect to MongoDB
	mongoURI := os.Getenv("MongoURI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())

	db := client.Database("aequitas")
	holdingsCol := db.Collection("holdings")
	accountsCol := db.Collection("trading_accounts")

	// Get all holdings with blocked margin
	cursor, err := holdingsCol.Find(context.Background(), bson.M{
		"blocked_margin": bson.M{"$gt": 0},
	})
	if err != nil {
		log.Fatal(err)
	}
	defer cursor.Close(context.Background())

	// Group by user_id and sum blocked_margin
	userMargins := make(map[primitive.ObjectID]float64)

	for cursor.Next(context.Background()) {
		var holding struct {
			UserID        primitive.ObjectID `bson:"user_id"`
			BlockedMargin float64            `bson:"blocked_margin"`
		}
		if err := cursor.Decode(&holding); err != nil {
			log.Printf("Error decoding holding: %v", err)
			continue
		}

		userMargins[holding.UserID] += holding.BlockedMargin
	}

	// Update each trading account
	for userID, totalMargin := range userMargins {
		log.Printf("User %s has total blocked margin: %.2f", userID.Hex(), totalMargin)

		result, err := accountsCol.UpdateOne(
			context.Background(),
			bson.M{"user_id": userID},
			bson.M{"$set": bson.M{"blocked_margin": totalMargin}},
		)
		if err != nil {
			log.Printf("Error updating account for user %s: %v", userID.Hex(), err)
			continue
		}

		log.Printf("Updated %d account(s) for user %s", result.ModifiedCount, userID.Hex())
	}

	log.Println("Margin sync complete!")
}
