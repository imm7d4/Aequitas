package repositories

import (
	"context"
	"fmt"
	"time"

	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type InstrumentRepository struct {
	collection *mongo.Collection
}

func NewInstrumentRepository(db *mongo.Database) *InstrumentRepository {
	return &InstrumentRepository{
		collection: db.Collection("instruments"),
	}
}

func (r *InstrumentRepository) Create(instrument *models.Instrument) error {
	instrument.CreatedAt = time.Now()
	instrument.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(context.Background(), instrument)
	if err != nil {
		return fmt.Errorf("failed to create instrument: %w", err)
	}

	instrument.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *InstrumentRepository) FindByID(id string) (*models.Instrument, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid instrument ID: %w", err)
	}

	var instrument models.Instrument
	err = r.collection.FindOne(
		context.Background(),
		bson.M{"_id": objectID},
	).Decode(&instrument)

	if err == mongo.ErrNoDocuments {
		return nil, fmt.Errorf("instrument not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find instrument: %w", err)
	}

	return &instrument, nil
}

func (r *InstrumentRepository) FindBySymbol(
	symbol, exchange string,
) (*models.Instrument, error) {
	var instrument models.Instrument
	err := r.collection.FindOne(
		context.Background(),
		bson.M{"symbol": symbol, "exchange": exchange},
	).Decode(&instrument)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find instrument: %w", err)
	}

	return &instrument, nil
}

func (r *InstrumentRepository) FindByISIN(isin string) (*models.Instrument, error) {
	var instrument models.Instrument
	err := r.collection.FindOne(
		context.Background(),
		bson.M{"isin": isin},
	).Decode(&instrument)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find instrument: %w", err)
	}

	return &instrument, nil
}

func (r *InstrumentRepository) Search(query string) ([]*models.Instrument, error) {
	filter := bson.M{
		"$or": []bson.M{
			{"symbol": bson.M{"$regex": query, "$options": "i"}},
			{"name": bson.M{"$regex": query, "$options": "i"}},
			{"isin": bson.M{"$regex": query, "$options": "i"}},
		},
	}

	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, fmt.Errorf("failed to search instruments: %w", err)
	}
	defer cursor.Close(context.Background())

	var instruments []*models.Instrument
	if err = cursor.All(context.Background(), &instruments); err != nil {
		return nil, fmt.Errorf("failed to decode instruments: %w", err)
	}

	return instruments, nil
}

func (r *InstrumentRepository) FindAll(
	filter map[string]interface{},
) ([]*models.Instrument, error) {
	cursor, err := r.collection.Find(context.Background(), filter)
	if err != nil {
		return nil, fmt.Errorf("failed to find instruments: %w", err)
	}
	defer cursor.Close(context.Background())

	var instruments []*models.Instrument
	if err = cursor.All(context.Background(), &instruments); err != nil {
		return nil, fmt.Errorf("failed to decode instruments: %w", err)
	}

	return instruments, nil
}

func (r *InstrumentRepository) Update(
	id string,
	updates map[string]interface{},
) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid instrument ID: %w", err)
	}

	updates["updated_at"] = time.Now()

	result, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": objectID},
		bson.M{"$set": updates},
	)

	if err != nil {
		return fmt.Errorf("failed to update instrument: %w", err)
	}

	if result.MatchedCount == 0 {
		return fmt.Errorf("instrument not found")
	}

	return nil
}

func (r *InstrumentRepository) Delete(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid instrument ID: %w", err)
	}

	result, err := r.collection.DeleteOne(
		context.Background(),
		bson.M{"_id": objectID},
	)

	if err != nil {
		return fmt.Errorf("failed to delete instrument: %w", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("instrument not found")
	}

	return nil
}
