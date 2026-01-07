package repositories

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"aequitas/internal/models"
)

type TradingAccountRepository struct {
	collection *mongo.Collection
}

func NewTradingAccountRepository(db *mongo.Database) *TradingAccountRepository {
	collection := db.Collection("trading_accounts")

	// Create unique index on user_id
	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "user_id", Value: 1}},
		Options: options.Index().SetUnique(true),
	}
	collection.Indexes().CreateOne(context.Background(), indexModel)

	return &TradingAccountRepository{collection: collection}
}

// Create creates a new trading account
func (r *TradingAccountRepository) Create(account *models.TradingAccount) (*models.TradingAccount, error) {
	account.CreatedAt = time.Now()
	account.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(context.Background(), account)
	if err != nil {
		return nil, err
	}

	account.ID = result.InsertedID.(primitive.ObjectID)
	return account, nil
}

// FindByUserID finds a trading account by user ID
func (r *TradingAccountRepository) FindByUserID(userID string) (*models.TradingAccount, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	var account models.TradingAccount
	err = r.collection.FindOne(
		context.Background(),
		bson.M{"user_id": objectID},
	).Decode(&account)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}

	return &account, err
}

// UpdateBalance updates the balance of a trading account
func (r *TradingAccountRepository) UpdateBalance(accountID primitive.ObjectID, newBalance float64) error {
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": accountID},
		bson.M{"$set": bson.M{"balance": newBalance, "updated_at": time.Now()}},
	)
	return err
}

// Update updates a trading account (generic)
func (r *TradingAccountRepository) Update(account *models.TradingAccount) (*models.TradingAccount, error) {
	account.UpdatedAt = time.Now()
	_, err := r.collection.UpdateOne(
		context.Background(),
		bson.M{"_id": account.ID},
		bson.M{"$set": account},
	)
	if err != nil {
		return nil, err
	}
	return account, nil
}
