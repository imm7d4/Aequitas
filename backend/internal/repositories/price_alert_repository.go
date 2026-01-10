package repositories

import (
	"context"
	"time"

	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type PriceAlertRepository struct {
	collection *mongo.Collection
}

func NewPriceAlertRepository(db *mongo.Database) *PriceAlertRepository {
	return &PriceAlertRepository{
		collection: db.Collection("price_alerts"),
	}
}

func (r *PriceAlertRepository) Create(ctx context.Context, alert *models.PriceAlert) error {
	alert.CreatedAt = time.Now()
	alert.Status = models.AlertStatusActive
	result, err := r.collection.InsertOne(ctx, alert)
	if err != nil {
		return err
	}
	alert.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *PriceAlertRepository) GetByUserID(ctx context.Context, userID string) ([]*models.PriceAlert, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	cursor, err := r.collection.Find(ctx, bson.M{"userId": objID, "status": models.AlertStatusActive})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var alerts []*models.PriceAlert
	if err := cursor.All(ctx, &alerts); err != nil {
		return nil, err
	}
	return alerts, nil
}

func (r *PriceAlertRepository) GetActiveByInstrument(ctx context.Context, instrumentID string) ([]*models.PriceAlert, error) {
	objID, err := primitive.ObjectIDFromHex(instrumentID)
	if err != nil {
		return nil, err
	}

	cursor, err := r.collection.Find(ctx, bson.M{"instrumentId": objID, "status": models.AlertStatusActive})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var alerts []*models.PriceAlert
	if err := cursor.All(ctx, &alerts); err != nil {
		return nil, err
	}
	return alerts, nil
}

func (r *PriceAlertRepository) Delete(ctx context.Context, id string) error {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objID}, bson.M{"$set": bson.M{"status": models.AlertStatusCancelled}})
	return err
}

func (r *PriceAlertRepository) MarkTriggered(ctx context.Context, id primitive.ObjectID) error {
	now := time.Now()
	_, err := r.collection.UpdateOne(ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"status":      models.AlertStatusTriggered,
			"triggeredAt": now,
		}},
	)
	return err
}
