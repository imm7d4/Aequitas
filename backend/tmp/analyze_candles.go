package main

import (
	"context"
	"fmt"
	"log"
	"math"
	"time"

	"aequitas/internal/config"
	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type StockStats struct {
	Symbol       string
	StartPrice   float64
	EndPrice     float64
	PriceChange  float64
	PctChange    float64
	MaxPrice     float64
	MinPrice     float64
	AvgBodySize  float64
	BearishCount int
	BullishCount int
	TotalCandles int
}

func main() {
	cfg := config.New()
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("aequitas")
	
	symbols := []string{"RELIANCE", "TCS", "HDFCBANK"}
	
	fmt.Println("=== Pricing Analysis Report ===")
	fmt.Printf("Time: %v\n\n", time.Now().Format(time.RFC822))

	for _, symbol := range symbols {
		analyzeStock(ctx, db, symbol)
	}
}

func analyzeStock(ctx context.Context, db *mongo.Database, symbol string) {
	var inst models.Instrument
	err := db.Collection("instruments").FindOne(ctx, bson.M{"symbol": symbol}).Decode(&inst)
	if err != nil {
		log.Printf("Failed to find %s: %v", symbol, err)
		return
	}

	opts := options.Find().SetSort(bson.D{{Key: "time", Value: -1}}).SetLimit(100)
	cursor, err := db.Collection("candles").Find(ctx, bson.M{"instrument_id": inst.ID, "interval": "1m"}, opts)
	if err != nil {
		log.Printf("Failed to find candles for %s: %v", symbol, err)
		return
	}
	defer cursor.Close(ctx)

	var candles []models.Candle
	if err = cursor.All(ctx, &candles); err != nil {
		log.Printf("Failed to decode candles for %s: %v", symbol, err)
		return
	}

	if len(candles) == 0 {
		fmt.Printf("Stock: %s\nData: No candle data found.\n\n", symbol)
		return
	}

	stats := StockStats{
		Symbol:       symbol,
		TotalCandles: len(candles),
		MaxPrice:     -math.MaxFloat64,
		MinPrice:     math.MaxFloat64,
	}

	// Candles are newest first
	stats.EndPrice = candles[0].Close
	stats.StartPrice = candles[len(candles)-1].Open
	
	var totalBodySize float64
	for _, c := range candles {
		if c.High > stats.MaxPrice {
			stats.MaxPrice = c.High
		}
		if c.Low < stats.MinPrice {
			stats.MinPrice = c.Low
		}
		
		body := math.Abs(c.Close - c.Open)
		totalBodySize += body
		
		if c.Close < c.Open {
			stats.BearishCount++
		} else if c.Close > c.Open {
			stats.BullishCount++
		}
	}

	stats.PriceChange = stats.EndPrice - stats.StartPrice
	stats.PctChange = (stats.PriceChange / stats.StartPrice) * 100
	stats.AvgBodySize = totalBodySize / float64(len(candles))

	fmt.Printf("Stock: %s\n", stats.Symbol)
	fmt.Printf("- Candles Analyzed: %d\n", stats.TotalCandles)
	fmt.Printf("- Performance: %.2f -> %.2f (Change: %.2f, %.2f%%)\n", stats.StartPrice, stats.EndPrice, stats.PriceChange, stats.PctChange)
	fmt.Printf("- Range: Low=%.2f, High=%.2f\n", stats.MinPrice, stats.MaxPrice)
	fmt.Printf("- Candlestick Bias: Bullish=%d, Bearish=%d, Doji=%d\n", stats.BullishCount, stats.BearishCount, stats.TotalCandles-stats.BullishCount-stats.BearishCount)
	fmt.Printf("- Avg Body Size: %.4f\n", stats.AvgBodySize)
	
	// Check for drift
	if stats.BearishCount > stats.BullishCount*2 {
		fmt.Println("! ALERT: Heavy bearish drift detected (Bearish > 2x Bullish)")
	} else if stats.BullishCount > stats.BearishCount*2 {
		fmt.Println("! ALERT: Heavy bullish drift detected (Bullish > 2x Bearish)")
	} else {
		fmt.Println("- Market Balance: Normal oscillation")
	}
	fmt.Println()
}
