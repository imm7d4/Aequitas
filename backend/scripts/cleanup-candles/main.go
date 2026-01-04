package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Load environment variables
	if err := godotenv.Load("../../.env"); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI environment variable is not set")
	}

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(context.Background())

	db := client.Database("aequitas")
	candlesCollection := db.Collection("candles")

	// Count total candles before cleanup
	totalBefore, _ := candlesCollection.CountDocuments(context.Background(), bson.M{})
	fmt.Printf("📊 Total candles before cleanup: %d\n\n", totalBefore)

	// Cleanup strategy
	now := time.Now()

	// 1. Delete 1m candles older than 7 days
	cutoff1m := now.AddDate(0, 0, -7)
	result1m, err := candlesCollection.DeleteMany(context.Background(), bson.M{
		"interval": "1m",
		"time":     bson.M{"$lt": cutoff1m},
	})
	if err != nil {
		log.Printf("Error deleting 1m candles: %v", err)
	} else {
		fmt.Printf("🗑️  Deleted %d candles (1m interval older than 7 days)\n", result1m.DeletedCount)
	}

	// 2. Delete 5m candles older than 30 days
	cutoff5m := now.AddDate(0, 0, -30)
	result5m, err := candlesCollection.DeleteMany(context.Background(), bson.M{
		"interval": "5m",
		"time":     bson.M{"$lt": cutoff5m},
	})
	if err != nil {
		log.Printf("Error deleting 5m candles: %v", err)
	} else {
		fmt.Printf("🗑️  Deleted %d candles (5m interval older than 30 days)\n", result5m.DeletedCount)
	}

	// 3. Delete 15m candles older than 60 days
	cutoff15m := now.AddDate(0, 0, -60)
	result15m, err := candlesCollection.DeleteMany(context.Background(), bson.M{
		"interval": "15m",
		"time":     bson.M{"$lt": cutoff15m},
	})
	if err != nil {
		log.Printf("Error deleting 15m candles: %v", err)
	} else {
		fmt.Printf("🗑️  Deleted %d candles (15m interval older than 60 days)\n", result15m.DeletedCount)
	}

	// 4. Delete 1h candles older than 180 days
	cutoff1h := now.AddDate(0, 0, -180)
	result1h, err := candlesCollection.DeleteMany(context.Background(), bson.M{
		"interval": "1h",
		"time":     bson.M{"$lt": cutoff1h},
	})
	if err != nil {
		log.Printf("Error deleting 1h candles: %v", err)
	} else {
		fmt.Printf("🗑️  Deleted %d candles (1h interval older than 180 days)\n", result1h.DeletedCount)
	}

	// 5. Keep all daily candles (or delete older than 2 years if needed)
	// Uncomment if you want to clean daily candles too
	/*
		cutoff1d := now.AddDate(-2, 0, 0)
		result1d, err := candlesCollection.DeleteMany(context.Background(), bson.M{
			"interval": "1d",
			"time":     bson.M{"$lt": cutoff1d},
		})
		if err != nil {
			log.Printf("Error deleting 1d candles: %v", err)
		} else {
			fmt.Printf("🗑️  Deleted %d candles (1d interval older than 2 years)\n", result1d.DeletedCount)
		}
	*/

	// Count total candles after cleanup
	totalAfter, _ := candlesCollection.CountDocuments(context.Background(), bson.M{})
	totalDeleted := totalBefore - totalAfter

	fmt.Printf("\n✅ Cleanup complete!\n")
	fmt.Printf("   Total deleted: %d candles\n", totalDeleted)
	fmt.Printf("   Remaining: %d candles\n", totalAfter)
	fmt.Printf("   Space saved: ~%.2f MB\n", float64(totalDeleted)*0.2/1024) // Rough estimate

	// Show breakdown by interval
	fmt.Printf("\n📈 Candles by interval:\n")
	intervals := []string{"1m", "5m", "15m", "1h", "1d"}
	for _, interval := range intervals {
		count, _ := candlesCollection.CountDocuments(context.Background(), bson.M{"interval": interval})
		fmt.Printf("   %s: %d candles\n", interval, count)
	}
}
