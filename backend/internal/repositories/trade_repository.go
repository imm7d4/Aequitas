package repositories

import (
	"context"
	"time"

	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type TradeRepository struct {
	collection *mongo.Collection
}

func NewTradeRepository(db *mongo.Database) *TradeRepository {
	return &TradeRepository{
		collection: db.Collection("trades"),
	}
}

func (r *TradeRepository) Create(ctx context.Context, trade *models.Trade) (*models.Trade, error) {
	trade.ID = primitive.NewObjectID()
	trade.CreatedAt = time.Now()

	_, err := r.collection.InsertOne(ctx, trade)
	if err != nil {
		return nil, err
	}
	return trade, nil
}

func (r *TradeRepository) FindByUserID(ctx context.Context, userID string) ([]*models.Trade, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	cursor, err := r.collection.Find(ctx, bson.M{"user_id": objID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	trades := []*models.Trade{}
	if err = cursor.All(ctx, &trades); err != nil {
		return nil, err
	}

	return trades, nil
}

func (r *TradeRepository) FindByOrderID(orderID string) ([]*models.Trade, error) {
	objID, err := primitive.ObjectIDFromHex(orderID)
	if err != nil {
		return nil, err
	}

	cursor, err := r.collection.Find(context.Background(), bson.M{"order_id": objID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	trades := []*models.Trade{}
	if err = cursor.All(context.Background(), &trades); err != nil {
		return nil, err
	}

	return trades, nil
}
func (r *TradeRepository) CountRecent(ctx context.Context, duration time.Duration) (int64, error) {
	since := time.Now().Add(-duration)
	count, err := r.collection.CountDocuments(ctx, bson.M{"created_at": bson.M{"$gte": since}})
	return count, err
}
