package repositories

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"time"

	"aequitas/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type AuditLogRepository struct {
	collection *mongo.Collection
}

func NewAuditLogRepository(db *mongo.Database) *AuditLogRepository {
	return &AuditLogRepository{
		collection: db.Collection("audit_logs"),
	}
}

func (r *AuditLogRepository) Create(log *models.AuditLog) error {
	ctx := context.Background()

	// 1. Find the last log entry to get its hash
	var lastLog models.AuditLog
	findOptions := options.FindOne().SetSort(bson.D{{Key: "timestamp", Value: -1}})
	err := r.collection.FindOne(ctx, bson.M{}, findOptions).Decode(&lastLog)
	
	if err == mongo.ErrNoDocuments {
		log.PreviousHash = "0000000000000000000000000000000000000000000000000000000000000000"
	} else if err != nil {
		return fmt.Errorf("failed to fetch last audit log: %w", err)
	} else {
		log.PreviousHash = lastLog.Hash
	}

	// 2. Generate Hash for this entry
	log.Timestamp = time.Now()
	hashInput := fmt.Sprintf("%v|%s|%s|%s|%s|%v|%v|%s|%s", 
		log.Timestamp.UnixNano(), 
		log.ActorID, 
		log.Action, 
		log.ResourceID, 
		log.ResourceType, 
		serialize(log.OldValue), 
		serialize(log.NewValue), 
		log.PreviousHash,
		log.CorrelationID)
	
	h := sha256.New()
	h.Write([]byte(hashInput))
	log.Hash = fmt.Sprintf("%x", h.Sum(nil))

	// 3. Insert into DB
	_, err = r.collection.InsertOne(ctx, log)
	if err != nil {
		return fmt.Errorf("failed to save audit log: %w", err)
	}

	// 4. US-12.4: Periodically anchor the chain hash (every 1000 logs)
	count, _ := r.collection.CountDocuments(ctx, bson.M{})
	if count > 0 && count%1000 == 0 {
		_ = r.AnchorChain(ctx, log.Hash)
	}

	return nil
}

// US-12.4: External Anchoring Simulation
func (r *AuditLogRepository) AnchorChain(ctx context.Context, hash string) error {
	// In production, this would send the hash to an immutable store like S3 Object Lock or a vault.
	// For Phase 12, we record an internal ANCHOR event and simulate an external snapshot.
	anchor := bson.M{
		"timestamp": time.Now(),
		"hash":      hash,
		"type":      "EXTERNAL_ANCHOR_SNAPSHOT",
		"status":    "VERIFIED_IMMUTABLE",
	}
	_, err := r.collection.Database().Collection("audit_anchors").InsertOne(ctx, anchor)
	return err
}

// US-12.4: Truth Checker Utility
func (r *AuditLogRepository) VerifyChain(ctx context.Context) (bool, error) {
	cursor, err := r.collection.Find(ctx, bson.M{}, options.Find().SetSort(bson.D{{Key: "timestamp", Value: 1}}))
	if err != nil {
		return false, err
	}
	defer cursor.Close(ctx)

	var prevHash string = "0000000000000000000000000000000000000000000000000000000000000000"
	for cursor.Next(ctx) {
		var log models.AuditLog
		if err := cursor.Decode(&log); err != nil {
			return false, err
		}

		// Re-calculate hash
		hashInput := fmt.Sprintf("%v|%s|%s|%s|%s|%v|%v|%s|%s", 
			log.Timestamp.UnixNano(), 
			log.ActorID, 
			log.Action, 
			log.ResourceID, 
			log.ResourceType, 
			serialize(log.OldValue), 
			serialize(log.NewValue), 
			log.PreviousHash,
			log.CorrelationID)
		
		h := sha256.New()
		h.Write([]byte(hashInput))
		calculatedHash := fmt.Sprintf("%x", h.Sum(nil))

		if calculatedHash != log.Hash {
			return false, fmt.Errorf("integrity violation at log %s: expected %s, got %s", log.ID.Hex(), calculatedHash, log.Hash)
		}

		if log.PreviousHash != prevHash {
			return false, fmt.Errorf("chain break at log %s: previous hash mismatch", log.ID.Hex())
		}
		
		prevHash = log.Hash
	}

	return true, nil
}

func (r *AuditLogRepository) FindAll(ctx context.Context) ([]models.AuditLog, error) {
	var logs []models.AuditLog
	cursor, err := r.collection.Find(ctx, bson.M{}, options.Find().SetSort(bson.D{{Key: "timestamp", Value: -1}}))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	
	if err := cursor.All(ctx, &logs); err != nil {
		return nil, err
	}
	return logs, nil
}

func serialize(v interface{}) string {
	if v == nil {
		return "null"
	}
	b, _ := json.Marshal(v)
	return string(b)
}
