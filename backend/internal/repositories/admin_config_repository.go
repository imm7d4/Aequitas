package repositories

import (
	"context"
	"time"

	"aequitas/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type AdminConfigRepository struct {
	collection *mongo.Collection
}

func NewAdminConfigRepository(db *mongo.Database) *AdminConfigRepository {
	return &AdminConfigRepository{
		collection: db.Collection("admin_configs"),
	}
}

func (r *AdminConfigRepository) GetConfig(ctx context.Context) (*models.AdminConfig, error) {
	var config models.AdminConfig
	err := r.collection.FindOne(ctx, bson.M{}).Decode(&config)
	if err == mongo.ErrNoDocuments {
		// Return default config if none exists
		return &models.AdminConfig{
			AlertThresholds: []models.ThresholdConfig{
				{MetricName: "high_error_rate", Value: 2.0, Severity: models.SeverityCritical, IsEnabled: true},
				{MetricName: "api_latency", Value: 500.0, Severity: models.SeverityWarning, IsEnabled: true},
			},
			UpdatedAt: time.Now(),
		}, nil
	}
	return &config, err
}

func (r *AdminConfigRepository) UpdateConfig(ctx context.Context, config *models.AdminConfig) error {
	config.UpdatedAt = time.Now()
	opts := options.Replace().SetUpsert(true)
	_, err := r.collection.ReplaceOne(ctx, bson.M{}, config, opts)
	return err
}
