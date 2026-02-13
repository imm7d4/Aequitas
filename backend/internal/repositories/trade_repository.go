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

func (r *TradeRepository) Create(trade *models.Trade) (*models.Trade, error) {
	trade.ID = primitive.NewObjectID()
	trade.CreatedAt = time.Now()

	_, err := r.collection.InsertOne(context.Background(), trade)
	if err != nil {
		return nil, err
	}
	return trade, nil
}

func (r *TradeRepository) FindByUserID(userID string) ([]*models.Trade, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	cursor, err := r.collection.Find(context.Background(), bson.M{"user_id": objID})
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
