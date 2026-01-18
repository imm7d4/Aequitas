package repositories

import (
	"context"
	"time"

	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TradeResultRepository struct {
	collection *mongo.Collection
}

func NewTradeResultRepository(db *mongo.Database) *TradeResultRepository {
	return &TradeResultRepository{
		collection: db.Collection("trade_results"),
	}
}

func (r *TradeResultRepository) Create(tr *models.TradeResult) (*models.TradeResult, error) {
	tr.ID = primitive.NewObjectID()
	tr.CreatedAt = time.Now()

	_, err := r.collection.InsertOne(context.Background(), tr)
	if err != nil {
		return nil, err
	}
	return tr, nil
}

func (r *TradeResultRepository) FindByUserID(userID string) ([]*models.TradeResult, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	// Sort by ExitTime descending (newest first)
	opts := options.Find().SetSort(bson.D{{Key: "exit_time", Value: -1}})

	cursor, err := r.collection.Find(context.Background(), bson.M{"user_id": objID}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	results := []*models.TradeResult{}
	if err = cursor.All(context.Background(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

func (r *TradeResultRepository) CountByUserID(userID string) (int64, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return 0, err
	}
	return r.collection.CountDocuments(context.Background(), bson.M{"user_id": objID})
}
