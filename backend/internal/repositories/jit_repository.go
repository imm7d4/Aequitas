package repositories

import (
	"context"
	"time"

	"aequitas/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type JITRepository struct {
	collection *mongo.Collection
}

func NewJITRepository(db *mongo.Database) *JITRepository {
	return &JITRepository{
		collection: db.Collection("jit_requests"),
	}
}

func (r *JITRepository) Create(ctx context.Context, req *models.JITRequest) error {
	req.CreatedAt = time.Now()
	req.Status = models.JITStatusPending
	_, err := r.collection.InsertOne(ctx, req)
	return err
}

func (r *JITRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*models.JITRequest, error) {
	var req models.JITRequest
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&req)
	return &req, err
}

func (r *JITRepository) AddChecker(ctx context.Context, id primitive.ObjectID, checkerID primitive.ObjectID, status models.JITStatus) error {
	now := time.Now()
	update := bson.M{
		"$set": bson.M{
			"status":      status,
			"approved_at": &now,
		},
		"$addToSet": bson.M{
			"checkers": checkerID,
		},
	}
	_, err := r.collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
}

func (r *JITRepository) IncrementUses(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.collection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$inc": bson.M{"current_uses": 1}})
	return err
}

func (r *JITRepository) UpdateStatus(ctx context.Context, id primitive.ObjectID, status models.JITStatus) error {
	_, err := r.collection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": bson.M{"status": status}})
	return err
}

func (r *JITRepository) GetPending(ctx context.Context) ([]models.JITRequest, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"status": models.JITStatusPending})
	if err != nil {
		return nil, err
	}
	var results []models.JITRequest
	err = cursor.All(ctx, &results)
	return results, err
}
