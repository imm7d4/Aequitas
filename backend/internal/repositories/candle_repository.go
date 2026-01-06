package repositories

import (
	"context"
	"fmt"
	"time"

	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CandleRepository struct {
	collection *mongo.Collection
}

func NewCandleRepository(db *mongo.Database) *CandleRepository {
	collection := db.Collection("candles")

	// Create indexes for efficient querying
	ctx := context.Background()
	indexes := []mongo.IndexModel{
		{
			Keys: bson.D{
				{Key: "instrument_id", Value: 1},
				{Key: "interval", Value: 1},
				{Key: "time", Value: -1},
			},
		},
	}

	_, err := collection.Indexes().CreateMany(ctx, indexes)
	if err != nil {
		fmt.Printf("Warning: Failed to create candle indexes: %v\n", err)
	}

	return &CandleRepository{
		collection: collection,
	}
}

// SaveCandle persists a completed candle to MongoDB and maintains limit
func (r *CandleRepository) SaveCandle(candle *models.Candle) error {
	candle.CreatedAt = time.Now()

	_, err := r.collection.InsertOne(context.Background(), candle)
	if err != nil {
		return fmt.Errorf("failed to save candle: %w", err)
	}

	// Cleanup old candles to maintain database size
	// Keep only latest 100 candles per instrument per interval
	go r.cleanupOldCandles(candle.InstrumentID, candle.Interval, 100)

	return nil
}

// cleanupOldCandles removes old candles beyond the retention limit
func (r *CandleRepository) cleanupOldCandles(instrumentID primitive.ObjectID, interval string, keepCount int) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Count total candles for this instrument/interval
	filter := bson.M{
		"instrument_id": instrumentID,
		"interval":      interval,
	}

	count, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return // Silent fail for cleanup
	}

	// Only cleanup if we exceed the limit
	if count <= int64(keepCount) {
		return
	}

	// Find the timestamp of the Nth newest candle (where N = keepCount)
	// Everything older than this should be deleted
	opts := options.Find().
		SetSort(bson.D{{Key: "time", Value: -1}}). // Descending (newest first)
		SetSkip(int64(keepCount)).
		SetLimit(1).
		SetProjection(bson.M{"time": 1})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return
	}
	defer cursor.Close(ctx)

	var result struct {
		Time time.Time `bson:"time"`
	}

	if cursor.Next(ctx) {
		if err := cursor.Decode(&result); err != nil {
			return
		}

		// Delete all candles older than this timestamp
		deleteFilter := bson.M{
			"instrument_id": instrumentID,
			"interval":      interval,
			"time":          bson.M{"$lt": result.Time},
		}

		deleteResult, err := r.collection.DeleteMany(ctx, deleteFilter)
		if err == nil && deleteResult.DeletedCount > 0 {
			// fmt.Printf("🧹 Cleaned up %d old candles for interval %s (keeping latest %d)\n",
			// 	deleteResult.DeletedCount, interval, keepCount)
		}
	}
}

// GetCandles retrieves historical candles for an instrument
func (r *CandleRepository) GetCandles(
	instrumentID string,
	interval string,
	from time.Time,
	to time.Time,
	limit int,
) ([]*models.Candle, error) {
	objID, err := primitive.ObjectIDFromHex(instrumentID)
	if err != nil {
		return nil, fmt.Errorf("invalid instrument ID: %w", err)
	}

	filter := bson.M{
		"instrument_id": objID,
		"interval":      interval,
		"time": bson.M{
			"$gte": from,
			"$lte": to,
		},
	}

	// Fetch LATEST candles first (descending order) to ensure we get recent data
	opts := options.Find().
		SetSort(bson.D{{Key: "time", Value: -1}}). // Descending - newest first
		SetLimit(int64(limit))

	cursor, err := r.collection.Find(context.Background(), filter, opts)
	if err != nil {
		return nil, fmt.Errorf("failed to find candles: %w", err)
	}
	defer cursor.Close(context.Background())

	var candles []*models.Candle
	if err = cursor.All(context.Background(), &candles); err != nil {
		return nil, fmt.Errorf("failed to decode candles: %w", err)
	}

	// Reverse to ascending order for chart display (oldest to newest)
	for i, j := 0, len(candles)-1; i < j; i, j = i+1, j-1 {
		candles[i], candles[j] = candles[j], candles[i]
	}

	return candles, nil
}

// GetLatestCandle retrieves the most recent candle for an instrument/interval
func (r *CandleRepository) GetLatestCandle(
	instrumentID string,
	interval string,
) (*models.Candle, error) {
	objID, err := primitive.ObjectIDFromHex(instrumentID)
	if err != nil {
		return nil, fmt.Errorf("invalid instrument ID: %w", err)
	}

	filter := bson.M{
		"instrument_id": objID,
		"interval":      interval,
	}

	opts := options.FindOne().SetSort(bson.D{{Key: "time", Value: -1}})

	var candle models.Candle
	err = r.collection.FindOne(context.Background(), filter, opts).Decode(&candle)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find latest candle: %w", err)
	}

	return &candle, nil
}

// CleanupAllCandles performs cleanup for all instruments and intervals
func (r *CandleRepository) CleanupAllCandles(keepCount int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	// Get all unique instrument_id and interval combinations
	pipeline := []bson.M{
		{
			"$group": bson.M{
				"_id": bson.M{
					"instrument_id": "$instrument_id",
					"interval":      "$interval",
				},
			},
		},
	}

	cursor, err := r.collection.Aggregate(ctx, pipeline)
	if err != nil {
		return fmt.Errorf("failed to get instrument/interval combinations: %w", err)
	}
	defer cursor.Close(ctx)

	var combinations []struct {
		ID struct {
			InstrumentID primitive.ObjectID `bson:"instrument_id"`
			Interval     string             `bson:"interval"`
		} `bson:"_id"`
	}

	if err := cursor.All(ctx, &combinations); err != nil {
		return fmt.Errorf("failed to decode combinations: %w", err)
	}

	fmt.Printf("🧹 Starting periodic cleanup for %d instrument/interval combinations...\n", len(combinations))

	totalDeleted := 0
	for _, combo := range combinations {
		deleted := r.cleanupSingleInstrument(combo.ID.InstrumentID, combo.ID.Interval, keepCount)
		totalDeleted += deleted
	}

	if totalDeleted > 0 {
		fmt.Printf("✅ Periodic cleanup complete: removed %d old candles\n", totalDeleted)
	}

	return nil
}

// cleanupSingleInstrument cleans up a single instrument/interval combination and returns count deleted
func (r *CandleRepository) cleanupSingleInstrument(instrumentID primitive.ObjectID, interval string, keepCount int) int {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{
		"instrument_id": instrumentID,
		"interval":      interval,
	}

	count, err := r.collection.CountDocuments(ctx, filter)
	if err != nil || count <= int64(keepCount) {
		return 0
	}

	opts := options.Find().
		SetSort(bson.D{{Key: "time", Value: -1}}).
		SetSkip(int64(keepCount)).
		SetLimit(1).
		SetProjection(bson.M{"time": 1})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return 0
	}
	defer cursor.Close(ctx)

	var result struct {
		Time time.Time `bson:"time"`
	}

	if cursor.Next(ctx) {
		if err := cursor.Decode(&result); err != nil {
			return 0
		}

		deleteFilter := bson.M{
			"instrument_id": instrumentID,
			"interval":      interval,
			"time":          bson.M{"$lt": result.Time},
		}

		deleteResult, err := r.collection.DeleteMany(ctx, deleteFilter)
		if err == nil && deleteResult.DeletedCount > 0 {
			return int(deleteResult.DeletedCount)
		}
	}

	return 0
}
