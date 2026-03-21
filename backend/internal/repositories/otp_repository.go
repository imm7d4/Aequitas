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

type OTPRepository struct {
	collection *mongo.Collection
}

func NewOTPRepository(db *mongo.Database) *OTPRepository {
	repo := &OTPRepository{
		collection: db.Collection("otps"),
	}
	repo.setupIndexes()
	return repo
}

func (r *OTPRepository) setupIndexes() {
	// TTL index to automatically delete expired OTPs
	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "expires_at", Value: 1}},
		Options: options.Index().SetExpireAfterSeconds(0),
	}
	_, _ = r.collection.Indexes().CreateOne(context.Background(), indexModel)
}

func (r *OTPRepository) Create(otp *models.OTPRecord) error {
	otp.CreatedAt = time.Now()
	_, err := r.collection.InsertOne(context.Background(), otp)
	return err
}

func (r *OTPRepository) FindLatest(userID string, purpose models.OTPPurpose) (*models.OTPRecord, error) {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	var otp models.OTPRecord
	filter := bson.M{
		"user_id": objID,
		"purpose": purpose,
		"expires_at": bson.M{"$gt": time.Now()},
	}
	err = r.collection.FindOne(
		context.Background(),
		filter,
		options.FindOne().SetSort(bson.D{{Key: "created_at", Value: -1}}),
	).Decode(&otp)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &otp, err
}

func (r *OTPRepository) FindLatestByEmail(email string, purpose models.OTPPurpose) (*models.OTPRecord, error) {
	var otp models.OTPRecord
	filter := bson.M{
		"email":   email,
		"purpose": purpose,
		"expires_at": bson.M{"$gt": time.Now()},
	}
	err := r.collection.FindOne(
		context.Background(),
		filter,
		options.FindOne().SetSort(bson.D{{Key: "created_at", Value: -1}}),
	).Decode(&otp)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &otp, err
}

func (r *OTPRepository) DeleteAllForUser(userID string, purpose models.OTPPurpose) error {
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}
	_, err = r.collection.DeleteMany(context.Background(), bson.M{"user_id": objID, "purpose": purpose})
	return err
}

func (r *OTPRepository) DeleteAllByEmail(email string, purpose models.OTPPurpose) error {
	_, err := r.collection.DeleteMany(context.Background(), bson.M{"email": email, "purpose": purpose})
	return err
}
