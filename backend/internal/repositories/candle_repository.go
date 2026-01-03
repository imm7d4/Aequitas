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

// SaveCandle persists a completed candle to MongoDB
func (r *CandleRepository) SaveCandle(candle *models.Candle) error {
	candle.CreatedAt = time.Now()

	_, err := r.collection.InsertOne(context.Background(), candle)
	if err != nil {
		return fmt.Errorf("failed to save candle: %w", err)
	}

	return nil
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

	opts := options.Find().
		SetSort(bson.D{{Key: "time", Value: 1}}). // Ascending order
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
