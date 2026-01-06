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

func (r *OrderRepository) FindByUserID(userID string, filters map[string]interface{}, skip int, limit int) ([]*models.Order, int64, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, 0, err
	}

	// Build query
	query := bson.M{"user_id": objID}

	// Add filters
	if instrumentID, ok := filters["instrumentId"].(string); ok && instrumentID != "" {
		instrObjID, err := primitive.ObjectIDFromHex(instrumentID)
		if err == nil {
			query["instrument_id"] = instrObjID
		}
	}

	if status, ok := filters["status"].(string); ok && status != "" {
		query["status"] = status
	}

	if startDate, ok := filters["startDate"].(time.Time); ok {
		if endDate, ok := filters["endDate"].(time.Time); ok {
			query["created_at"] = bson.M{
				"$gte": startDate,
				"$lte": endDate,
			}
		} else {
			query["created_at"] = bson.M{"$gte": startDate}
		}
	} else if endDate, ok := filters["endDate"].(time.Time); ok {
		query["created_at"] = bson.M{"$lte": endDate}
	}

	// Get total count
	total, err := r.collection.CountDocuments(context.Background(), query)
	if err != nil {
		return nil, 0, err
	}

	// Find with pagination
	opts := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}).
		SetSkip(int64(skip)).
		SetLimit(int64(limit))

	cursor, err := r.collection.Find(context.Background(), query, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(context.Background())

	var orders []*models.Order
	if err = cursor.All(context.Background(), &orders); err != nil {
		return nil, 0, err
	}

	return orders, total, nil
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
func (r *OrderRepository) Update(order *models.Order) (*models.Order, error) {
	order.UpdatedAt = time.Now()
	_, err := r.collection.ReplaceOne(
		context.Background(),
		bson.M{"_id": order.ID},
		order,
	)
	if err != nil {
		return nil, err
	}
	return order, nil
}

// FindPendingStopOrders returns all orders with PENDING status for monitoring
func (r *OrderRepository) FindPendingStopOrders() ([]*models.Order, error) {
	query := bson.M{"status": "PENDING"}

	cursor, err := r.collection.Find(context.Background(), query)
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

// FindNewLimitOrders returns all orders with status NEW and type LIMIT
func (r *OrderRepository) FindNewLimitOrders() ([]*models.Order, error) {
	query := bson.M{
		"status":     "NEW",
		"order_type": "LIMIT",
	}

	cursor, err := r.collection.Find(context.Background(), query)
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
