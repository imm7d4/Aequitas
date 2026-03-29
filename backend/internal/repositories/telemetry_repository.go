package repositories

import (
	"context"
	"fmt"
	"time"

	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type TelemetryRepository struct {
	collection *mongo.Collection
}

func NewTelemetryRepository(db *mongo.Database) *TelemetryRepository {
	return &TelemetryRepository{
		collection: db.Collection("telemetry"),
	}
}

func (r *TelemetryRepository) BatchInsert(events []models.TelemetryEvent) error {
	if len(events) == 0 {
		return nil
	}

	docs := make([]interface{}, len(events))
	for i, event := range events {
		docs[i] = event
	}

	_, err := r.collection.InsertMany(context.Background(), docs)
	if err != nil {
		return fmt.Errorf("failed to batch insert telemetry: %w", err)
	}

	return nil
}
func (r *TelemetryRepository) CountUniqueUsers(ctx context.Context, duration time.Duration) (int64, error) {
	since := time.Now().Add(-duration)
	values, err := r.collection.Distinct(ctx, "user_id", bson.M{"timestamp": bson.M{"$gte": since}})
	if err != nil {
		return 0, err
	}
	return int64(len(values)), nil
}

func (r *TelemetryRepository) CountActiveSessions(ctx context.Context, duration time.Duration) (int64, error) {
	since := time.Now().Add(-duration)
	// Unique sessions with activity in last 'duration' minutes
	values, err := r.collection.Distinct(ctx, "session_id", bson.M{"timestamp": bson.M{"$gte": since}})
	if err != nil {
		return 0, err
	}
	return int64(len(values)), nil
}
