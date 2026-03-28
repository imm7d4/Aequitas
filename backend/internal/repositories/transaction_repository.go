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

type TransactionRepository struct {
	collection *mongo.Collection
}

func NewTransactionRepository(db *mongo.Database) *TransactionRepository {
	return &TransactionRepository{
		collection: db.Collection("transactions"),
	}
}

func (r *TransactionRepository) Create(ctx context.Context, tx *models.Transaction) (*models.Transaction, error) {
	tx.ID = primitive.NewObjectID()
	tx.CreatedAt = time.Now()
	_, err := r.collection.InsertOne(ctx, tx)
	if err != nil {
		return nil, err
	}
	return tx, nil
}

func (r *TransactionRepository) FindByAccountID(ctx context.Context, accountID string) ([]*models.Transaction, error) {
	objID, _ := primitive.ObjectIDFromHex(accountID)
	cursor, err := r.collection.Find(
		ctx,
		bson.M{"account_id": objID},
		options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}).SetLimit(50),
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	transactions := make([]*models.Transaction, 0)
	if err = cursor.All(ctx, &transactions); err != nil {
		return nil, err
	}
	return transactions, nil
}

func (r *TransactionRepository) FindByID(ctx context.Context, id string) (*models.Transaction, error) {
	objID, _ := primitive.ObjectIDFromHex(id)
	var tx models.Transaction
	err := r.collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&tx)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &tx, err
}

func (r *TransactionRepository) UpdateStatus(ctx context.Context, id string, status string, reference string) error {
	objID, _ := primitive.ObjectIDFromHex(id)
	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": objID},
		bson.M{"$set": bson.M{
			"status":    status,
			"reference": reference,
		}},
	)
	return err
}
