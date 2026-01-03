package repositories

import (
	"context"
	"fmt"

	"aequitas/internal/models"

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
