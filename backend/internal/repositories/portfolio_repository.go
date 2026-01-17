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

type PortfolioRepository struct {
	collection *mongo.Collection
}

func NewPortfolioRepository(db *mongo.Database) *PortfolioRepository {
	return &PortfolioRepository{
		collection: db.Collection("holdings"),
	}
}

// GetHoldings returns all active holdings for a user
func (r *PortfolioRepository) GetHoldings(ctx context.Context, userID string) ([]models.Holding, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{
		"user_id":  objID,
		"quantity": bson.M{"$gt": 0}, // Only return active positions
	}

	cursor, err := r.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var holdings []models.Holding
	if err = cursor.All(ctx, &holdings); err != nil {
		return nil, err
	}
	return holdings, nil
}

// GetHolding returns a specific holding for a user and instrument
func (r *PortfolioRepository) GetHolding(ctx context.Context, userID, instrumentID string) (*models.Holding, error) {
	uID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	iID, err := primitive.ObjectIDFromHex(instrumentID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{
		"user_id":       uID,
		"instrument_id": iID,
	}

	var holding models.Holding
	err = r.collection.FindOne(ctx, filter).Decode(&holding)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &holding, nil
}

// UpsertHolding updates or inserts a holding
func (r *PortfolioRepository) UpsertHolding(ctx context.Context, holding *models.Holding) error {
	filter := bson.M{
		"user_id":       holding.UserID,
		"instrument_id": holding.InstrumentID,
	}

	update := bson.M{
		"$set": bson.M{
			"quantity":        holding.Quantity,
			"avg_entry_price": holding.AvgEntryPrice,
			"total_cost":      holding.TotalCost,
			"realized_pl":     holding.RealizedPL,
			"unrealized_pl":   holding.UnrealizedPL,
			"total_pl":        holding.TotalPL,
			"position_type":   holding.PositionType,
			"blocked_margin":  holding.BlockedMargin,
			"initial_margin":  holding.InitialMargin,
			"margin_status":   holding.MarginStatus,
			"last_updated":    time.Now(),
			"symbol":          holding.Symbol,
			"account_id":      holding.AccountID,
		},
		"$setOnInsert": bson.M{
			"created_at": time.Now(),
		},
	}

	opts := options.Update().SetUpsert(true)
	_, err := r.collection.UpdateOne(ctx, filter, update, opts)
	return err
}

// DeleteHolding removes a holding record (used when fully exited)
func (r *PortfolioRepository) DeleteHolding(ctx context.Context, holdingID string) error {
	objID, err := primitive.ObjectIDFromHex(holdingID)
	if err != nil {
		return err
	}
	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objID})
	return err
}

// CreateSnapshot saves a daily portfolio snapshot
func (r *PortfolioRepository) CreateSnapshot(ctx context.Context, snapshot *models.PortfolioSnapshot) error {
	// Use a separate collection for history
	historyCollection := r.collection.Database().Collection("portfolio_history")
	_, err := historyCollection.InsertOne(ctx, snapshot)
	return err
}

// GetSnapshots retrieves portfolio history for a user, sorted by date descending
func (r *PortfolioRepository) GetSnapshots(ctx context.Context, userID string, limit int) ([]models.PortfolioSnapshot, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	historyCollection := r.collection.Database().Collection("portfolio_history")

	opts := options.Find().SetSort(bson.M{"date": 1}) // Ascending for charts
	if limit > 0 {
		// If limit is needed, we might want to sort desc first, take limit, then reverse, but for now let's just get all
		// or if specific logic is needed. For charts, usually we want text 1 month, 3 months etc.
		// Let's keep it simple: return all for now and filter in service/frontend
	}

	filter := bson.M{"user_id": objID}

	cursor, err := historyCollection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var snapshots []models.PortfolioSnapshot
	if err = cursor.All(ctx, &snapshots); err != nil {
		return nil, err
	}
	return snapshots, nil
}
