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

type NotificationRepository struct {
	collection *mongo.Collection
}

func NewNotificationRepository(db *mongo.Database) *NotificationRepository {
	return &NotificationRepository{
		collection: db.Collection("notifications"),
	}
}

// Create saves a new notification to the database
func (r *NotificationRepository) Create(ctx context.Context, notification *models.Notification) error {
	notification.CreatedAt = time.Now()
	notification.IsRead = false

	result, err := r.collection.InsertOne(ctx, notification)
	if err != nil {
		return err
	}

	notification.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

// GetByUserID fetches non-expired notifications for a user, sorted by newest first
func (r *NotificationRepository) GetByUserID(ctx context.Context, userID string, limit int) ([]models.Notification, error) {
	filter := bson.M{
		"userId": userID,
		"$or": []bson.M{
			{"expiresAt": bson.M{"$exists": false}},
			{"expiresAt": nil},
			{"expiresAt": bson.M{"$gt": time.Now()}},
		},
	}

	opts := options.Find().
		SetSort(bson.M{"createdAt": -1}).
		SetLimit(int64(limit))

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	notifications := make([]models.Notification, 0)
	if err := cursor.All(ctx, &notifications); err != nil {
		return nil, err
	}

	return notifications, nil
}

// MarkAsRead marks a specific notification as read
func (r *NotificationRepository) MarkAsRead(ctx context.Context, notificationID string, userID string) error {
	objID, err := primitive.ObjectIDFromHex(notificationID)
	if err != nil {
		return err
	}

	filter := bson.M{
		"_id":    objID,
		"userId": userID,
	}

	update := bson.M{
		"$set": bson.M{"isRead": true},
	}

	_, err = r.collection.UpdateOne(ctx, filter, update)
	return err
}

// MarkAllAsRead marks all notifications for a user as read
func (r *NotificationRepository) MarkAllAsRead(ctx context.Context, userID string) error {
	filter := bson.M{"userId": userID}
	update := bson.M{"$set": bson.M{"isRead": true}}

	_, err := r.collection.UpdateMany(ctx, filter, update)
	return err
}

// DeleteExpired removes expired notifications
func (r *NotificationRepository) DeleteExpired(ctx context.Context) error {
	filter := bson.M{
		"expiresAt": bson.M{"$lt": time.Now()},
	}

	_, err := r.collection.DeleteMany(ctx, filter)
	return err
}

// DeleteAllForUser removes all notifications for a specific user
func (r *NotificationRepository) DeleteAllForUser(ctx context.Context, userID string) error {
	filter := bson.M{"userId": userID}
	_, err := r.collection.DeleteMany(ctx, filter)
	return err
}
