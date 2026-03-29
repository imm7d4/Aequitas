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

type SupportTicketRepository struct {
	collection *mongo.Collection
}

func NewSupportTicketRepository(db *mongo.Database) *SupportTicketRepository {
	return &SupportTicketRepository{
		collection: db.Collection("support_tickets"),
	}
}

func (r *SupportTicketRepository) Create(ctx context.Context, ticket *models.SupportTicket) (*models.SupportTicket, error) {
	ticket.CreatedAt = time.Now()
	ticket.UpdatedAt = time.Now()
	res, err := r.collection.InsertOne(ctx, ticket)
	if err != nil {
		return nil, err
	}
	ticket.ID = res.InsertedID.(primitive.ObjectID)
	return ticket, nil
}

func (r *SupportTicketRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*models.SupportTicket, error) {
	var ticket models.SupportTicket
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&ticket)
	return &ticket, err
}

func (r *SupportTicketRepository) FindByUserID(ctx context.Context, userID primitive.ObjectID) ([]models.SupportTicket, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"user_id": userID}, options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tickets []models.SupportTicket
	if err := cursor.All(ctx, &tickets); err != nil {
		return nil, err
	}
	return tickets, nil
}

func (r *SupportTicketRepository) FindAll(ctx context.Context, filter bson.M) ([]models.SupportTicket, error) {
	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})
	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var tickets []models.SupportTicket
	if err := cursor.All(ctx, &tickets); err != nil {
		return nil, err
	}
	return tickets, nil
}

func (r *SupportTicketRepository) Update(ctx context.Context, id primitive.ObjectID, update bson.M) error {
	update["updated_at"] = time.Now()
	_, err := r.collection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	return err
}

func (r *SupportTicketRepository) AddComment(ctx context.Context, ticketID primitive.ObjectID, comment models.SupportComment) error {
	comment.ID = primitive.NewObjectID()
	comment.CreatedAt = time.Now()
	
	update := bson.M{
		"$push": bson.M{"comments": comment},
		"$set":  bson.M{"updated_at": time.Now()},
	}
	
	_, err := r.collection.UpdateOne(ctx, bson.M{"_id": ticketID}, update)
	return err
}

func (r *SupportTicketRepository) UpdateStatus(ctx context.Context, id primitive.ObjectID, status models.TicketStatus) error {
	_, err := r.collection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": bson.M{"status": status, "updated_at": time.Now()}})
	return err
}
