package repositories

import (
	"context"
	"fmt"
	"time"

	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type MarketRepository struct {
	hoursCollection   *mongo.Collection
	holidayCollection *mongo.Collection
}

func NewMarketRepository(db *mongo.Database) *MarketRepository {
	return &MarketRepository{
		hoursCollection:   db.Collection("market_hours"),
		holidayCollection: db.Collection("market_holidays"),
	}
}

func (r *MarketRepository) CreateMarketHours(hours *models.MarketHours) error {
	hours.CreatedAt = time.Now()
	hours.UpdatedAt = time.Now()

	_, err := r.hoursCollection.InsertOne(context.Background(), hours)
	if err != nil {
		return fmt.Errorf("failed to create market hours: %w", err)
	}

	return nil
}

func (r *MarketRepository) FindMarketHours(
	exchange string,
	dayOfWeek int,
) (*models.MarketHours, error) {
	var hours models.MarketHours
	err := r.hoursCollection.FindOne(
		context.Background(),
		bson.M{"exchange": exchange, "day_of_week": dayOfWeek},
	).Decode(&hours)

	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to find market hours: %w", err)
	}

	return &hours, nil
}

func (r *MarketRepository) CreateHoliday(holiday *models.MarketHoliday) error {
	holiday.CreatedAt = time.Now()

	_, err := r.holidayCollection.InsertOne(context.Background(), holiday)
	if err != nil {
		return fmt.Errorf("failed to create holiday: %w", err)
	}

	return nil
}

func (r *MarketRepository) FindHolidays(
	exchange string,
	startDate, endDate time.Time,
) ([]*models.MarketHoliday, error) {
	filter := bson.M{
		"exchange": exchange,
		"date": bson.M{
			"$gte": startDate,
			"$lte": endDate,
		},
	}

	cursor, err := r.holidayCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, fmt.Errorf("failed to find holidays: %w", err)
	}
	defer cursor.Close(context.Background())

	var holidays []*models.MarketHoliday
	if err = cursor.All(context.Background(), &holidays); err != nil {
		return nil, fmt.Errorf("failed to decode holidays: %w", err)
	}

	return holidays, nil
}

func (r *MarketRepository) FindAllHolidays(
	exchange string,
) ([]*models.MarketHoliday, error) {
	filter := bson.M{}
	if exchange != "" {
		filter["exchange"] = exchange
	}

	cursor, err := r.holidayCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, fmt.Errorf("failed to find holidays: %w", err)
	}
	defer cursor.Close(context.Background())

	var holidays []*models.MarketHoliday
	if err = cursor.All(context.Background(), &holidays); err != nil {
		return nil, fmt.Errorf("failed to decode holidays: %w", err)
	}

	return holidays, nil
}

func (r *MarketRepository) DeleteHoliday(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid holiday ID: %w", err)
	}

	result, err := r.holidayCollection.DeleteOne(
		context.Background(),
		bson.M{"_id": objectID},
	)
	if err != nil {
		return fmt.Errorf("failed to delete holiday: %w", err)
	}

	if result.DeletedCount == 0 {
		return fmt.Errorf("holiday not found")
	}

	return nil
}

func (r *MarketRepository) IsHoliday(exchange string, date time.Time) (bool, error) {
	// Normalize date to start of day
	startOfDay := time.Date(
		date.Year(),
		date.Month(),
		date.Day(),
		0, 0, 0, 0,
		date.Location(),
	)
	endOfDay := startOfDay.Add(24 * time.Hour)

	count, err := r.holidayCollection.CountDocuments(
		context.Background(),
		bson.M{
			"exchange": exchange,
			"date": bson.M{
				"$gte": startOfDay,
				"$lt":  endOfDay,
			},
		},
	)

	if err != nil {
		return false, fmt.Errorf("failed to check holiday: %w", err)
	}

	return count > 0, nil
}
