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

type UserRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(db *mongo.Database) *UserRepository {
	collection := db.Collection("users")
	
	// Create unique index on email
	indexModel := mongo.IndexModel{
		Keys:    bson.D{{Key: "email", Value: 1}},
		Options: options.Index().SetUnique(true),
	}
	collection.Indexes().CreateOne(context.Background(), indexModel)
	
	return &UserRepository{collection: collection}
}

// Create creates a new user
func (r *UserRepository) Create(user *models.User) (*models.User, error) {
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	
	result, err := r.collection.InsertOne(context.Background(), user)
	if err != nil {
		return nil, err
	}
	
	user.ID = result.InsertedID.(primitive.ObjectID)
	return user, nil
}

// FindByEmail finds a user by email
func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.collection.FindOne(
		context.Background(),
		bson.M{"email": email},
	).Decode(&user)
	
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	
	return &user, err
}

// FindByID finds a user by ID
func (r *UserRepository) FindByID(id string) (*models.User, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	
	var user models.User
	err = r.collection.FindOne(
		context.Background(),
		bson.M{"_id": objectID},
	).Decode(&user)
	
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	
	return &user, err
}
