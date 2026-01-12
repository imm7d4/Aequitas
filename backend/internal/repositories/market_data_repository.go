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

type MarketDataRepository struct {
	collection *mongo.Collection
}

func NewMarketDataRepository(db *mongo.Database) *MarketDataRepository {
	return &MarketDataRepository{
		collection: db.Collection("market_data"),
	}
}

func (r *MarketDataRepository) Upsert(data *models.MarketData) error {
	data.UpdatedAt = time.Now()

	opts := options.Update().SetUpsert(true)
	filter := bson.M{"instrument_id": data.InstrumentID}
	update := bson.M{"$set": data}

	_, err := r.collection.UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return fmt.Errorf("failed to upsert market data: %w", err)
	}

	return nil
}

func (r *MarketDataRepository) FindByInstrumentID(instrumentID string) (*models.MarketData, error) {
	oid, err := primitive.ObjectIDFromHex(instrumentID)
	if err != nil {
		return nil, fmt.Errorf("invalid instrument ID: %w", err)
	}

	var data models.MarketData
	err = r.collection.FindOne(context.Background(), bson.M{"instrument_id": oid}).Decode(&data)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find market data: %w", err)
	}

	return &data, nil
}

func (r *MarketDataRepository) FindByInstrumentIDs(instrumentIDs []string) ([]*models.MarketData, error) {
	oids := make([]primitive.ObjectID, 0, len(instrumentIDs))
	for _, id := range instrumentIDs {
		oid, err := primitive.ObjectIDFromHex(id)
		if err == nil {
			oids = append(oids, oid)
		}
	}

	cursor, err := r.collection.Find(context.Background(), bson.M{"instrument_id": bson.M{"$in": oids}})
	if err != nil {
		return nil, fmt.Errorf("failed to find market data: %w", err)
	}
	defer cursor.Close(context.Background())

	results := make([]*models.MarketData, 0)
	if err := cursor.All(context.Background(), &results); err != nil {
		return nil, fmt.Errorf("failed to decode market data: %w", err)
	}

	return results, nil
}

func (r *MarketDataRepository) GetAll(ctx context.Context) ([]*models.MarketData, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("failed to find all market data: %w", err)
	}
	defer cursor.Close(ctx)

	results := make([]*models.MarketData, 0)
	if err := cursor.All(ctx, &results); err != nil {
		return nil, fmt.Errorf("failed to decode market data: %w", err)
	}

	return results, nil
}
