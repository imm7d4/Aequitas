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

// TradeStatsResult holds aggregated stats for a user's trades
type TradeStatsResult struct {
	TotalTrades  int64 `bson:"totalTrades"`
	ClosedTrades int64 `bson:"closedTrades"`
}

// GetStatsForUser returns total closed trades, win count (net_value > avg_entry_price * qty), and count
// Win = a CLOSE_LONG trade where execution price > avg entry, estimated via net_value > cost
// For simplicity, we count total executions and wins where net_value is positive (SELL) or advantageous (BUY cover)
func (r *TradeRepository) GetStatsForUser(ctx context.Context, userID string) (*TradeStatsResult, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	// Count all trades
	total, err := r.collection.CountDocuments(ctx, bson.M{"user_id": objID})
	if err != nil {
		return nil, err
	}

	// Count closing trades (CLOSE_LONG and CLOSE_SHORT) as "attempted trades"
	closingTrades, err := r.collection.CountDocuments(ctx, bson.M{
		"user_id": objID,
		"intent":  bson.M{"$in": bson.A{"CLOSE_LONG", "CLOSE_SHORT"}},
	})
	if err != nil {
		return nil, err
	}

	return &TradeStatsResult{
		TotalTrades:  total,
		ClosedTrades: closingTrades,
	}, nil
}


