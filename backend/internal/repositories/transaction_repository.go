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

func (r *TransactionRepository) Create(tx *models.Transaction) (*models.Transaction, error) {
	tx.ID = primitive.NewObjectID()
	tx.CreatedAt = time.Now()
	_, err := r.collection.InsertOne(context.Background(), tx)
	if err != nil {
		return nil, err
	}
	return tx, nil
}

func (r *TransactionRepository) FindByAccountID(accountID string) ([]*models.Transaction, error) {
	objID, _ := primitive.ObjectIDFromHex(accountID)
	cursor, err := r.collection.Find(
		context.Background(),
		bson.M{"account_id": objID},
		options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}).SetLimit(50),
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	transactions := make([]*models.Transaction, 0)
	if err = cursor.All(context.Background(), &transactions); err != nil {
		return nil, err
	}
	return transactions, nil
}
