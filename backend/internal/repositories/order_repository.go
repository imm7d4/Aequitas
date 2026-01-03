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

type OrderRepository struct {
	collection *mongo.Collection
}

func NewOrderRepository(db *mongo.Database) *OrderRepository {
	collection := db.Collection("orders")

	// Create unique index on client_order_id + user_id for idempotency
	indexModel := mongo.IndexModel{
		Keys: bson.D{
			{Key: "user_id", Value: 1},
			{Key: "client_order_id", Value: 1},
		},
		Options: options.Index().SetUnique(true),
	}
	collection.Indexes().CreateOne(context.Background(), indexModel)

	return &OrderRepository{
		collection: collection,
	}
}

func (r *OrderRepository) Create(order *models.Order) (*models.Order, error) {
	order.ID = primitive.NewObjectID()
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()

	_, err := r.collection.InsertOne(context.Background(), order)
	if err != nil {
		return nil, err
	}
	return order, nil
}

func (r *OrderRepository) FindByUserID(userID string) ([]*models.Order, error) {
	objID, _ := primitive.ObjectIDFromHex(userID)
	cursor, err := r.collection.Find(
		context.Background(),
		bson.M{"user_id": objID},
		options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}),
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var orders []*models.Order
	if err = cursor.All(context.Background(), &orders); err != nil {
		return nil, err
	}
	return orders, nil
}

func (r *OrderRepository) FindByID(id string) (*models.Order, error) {
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var order models.Order
	err = r.collection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&order)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &order, err
}
