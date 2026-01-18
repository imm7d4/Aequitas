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

type ActiveTradeUnitRepository struct {
	collection *mongo.Collection
}

func NewActiveTradeUnitRepository(db *mongo.Database) *ActiveTradeUnitRepository {
	return &ActiveTradeUnitRepository{
		collection: db.Collection("active_trade_units"),
	}
}

func (r *ActiveTradeUnitRepository) FindOpenUnit(userID, instrumentID string) (*models.ActiveTradeUnit, error) {
	uID, _ := primitive.ObjectIDFromHex(userID)
	iID, _ := primitive.ObjectIDFromHex(instrumentID)

	var unit models.ActiveTradeUnit
	err := r.collection.FindOne(context.Background(), bson.M{
		"user_id":       uID,
		"instrument_id": iID,
	}).Decode(&unit)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &unit, err
}

func (r *ActiveTradeUnitRepository) Upsert(unit *models.ActiveTradeUnit) error {
	if unit.ID.IsZero() {
		unit.ID = primitive.NewObjectID()
		unit.CreatedAt = time.Now()
	}

	opts := options.Replace().SetUpsert(true)
	filter := bson.M{"_id": unit.ID}
	_, err := r.collection.ReplaceOne(context.Background(), filter, unit, opts)
	return err
}

func (r *ActiveTradeUnitRepository) Delete(id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	return err
}
