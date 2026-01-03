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

type WatchlistRepository struct {
	collection *mongo.Collection
}

func NewWatchlistRepository(db *mongo.Database) *WatchlistRepository {
	return &WatchlistRepository{
		collection: db.Collection("watchlists"),
	}
}

func (r *WatchlistRepository) Create(watchlist *models.Watchlist) error {
	watchlist.CreatedAt = time.Now()
	watchlist.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(context.Background(), watchlist)
	if err != nil {
		return fmt.Errorf("failed to create watchlist: %w", err)
	}

	watchlist.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *WatchlistRepository) FindByUserID(userID string) ([]*models.Watchlist, error) {
	uid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	cursor, err := r.collection.Find(context.Background(), bson.M{"user_id": uid})
	if err != nil {
		return nil, fmt.Errorf("failed to find watchlists: %w", err)
	}
	defer cursor.Close(context.Background())

	watchlists := make([]*models.Watchlist, 0)
	if err := cursor.All(context.Background(), &watchlists); err != nil {
		return nil, fmt.Errorf("failed to decode watchlists: %w", err)
	}

	return watchlists, nil
}

func (r *WatchlistRepository) FindByID(id string) (*models.Watchlist, error) {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid watchlist ID: %w", err)
	}

	var watchlist models.Watchlist
	err = r.collection.FindOne(context.Background(), bson.M{"_id": oid}).Decode(&watchlist)
	if err == mongo.ErrNoDocuments {
		return nil, fmt.Errorf("watchlist not found")
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find watchlist: %w", err)
	}

	return &watchlist, nil
}

func (r *WatchlistRepository) Update(id string, updates bson.M) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid watchlist ID: %w", err)
	}

	updates["updated_at"] = time.Now()
	_, err = r.collection.UpdateOne(context.Background(), bson.M{"_id": oid}, bson.M{"$set": updates})
	if err != nil {
		return fmt.Errorf("failed to update watchlist: %w", err)
	}

	return nil
}

func (r *WatchlistRepository) Delete(id string) error {
	oid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid watchlist ID: %w", err)
	}

	_, err = r.collection.DeleteOne(context.Background(), bson.M{"_id": oid})
	if err != nil {
		return fmt.Errorf("failed to delete watchlist: %w", err)
	}

	return nil
}

func (r *WatchlistRepository) AddInstrument(watchlistID, instrumentID string) error {
	wid, err := primitive.ObjectIDFromHex(watchlistID)
	if err != nil {
		return fmt.Errorf("invalid watchlist ID: %w", err)
	}

	iid, err := primitive.ObjectIDFromHex(instrumentID)
	if err != nil {
		return fmt.Errorf("invalid instrument ID: %w", err)
	}

	_, err = r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": wid},
		bson.M{
			"$addToSet": bson.M{"instrument_ids": iid},
			"$set":      bson.M{"updated_at": time.Now()},
		},
	)
	if err != nil {
		return fmt.Errorf("failed to add instrument to watchlist: %w", err)
	}

	return nil
}

func (r *WatchlistRepository) RemoveInstrument(watchlistID, instrumentID string) error {
	wid, err := primitive.ObjectIDFromHex(watchlistID)
	if err != nil {
		return fmt.Errorf("invalid watchlist ID: %w", err)
	}

	iid, err := primitive.ObjectIDFromHex(instrumentID)
	if err != nil {
		return fmt.Errorf("invalid instrument ID: %w", err)
	}

	_, err = r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": wid},
		bson.M{
			"$pull": bson.M{"instrument_ids": iid},
			"$set":  bson.M{"updated_at": time.Now()},
		},
	)
	if err != nil {
		return fmt.Errorf("failed to remove instrument from watchlist: %w", err)
	}

	return nil
}

func (r *WatchlistRepository) UnsetDefault(userID string) error {
	uid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return fmt.Errorf("invalid user ID: %w", err)
	}

	_, err = r.collection.UpdateMany(
		context.Background(),
		bson.M{"user_id": uid, "is_default": true},
		bson.M{"$set": bson.M{"is_default": false, "updated_at": time.Now()}},
	)
	return err
}
