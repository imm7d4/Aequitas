package services

import (
	"fmt"

	"aequitas/internal/models"
	"aequitas/internal/repositories"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WatchlistService struct {
	repo           *repositories.WatchlistRepository
	instrumentRepo *repositories.InstrumentRepository
}

func NewWatchlistService(
	repo *repositories.WatchlistRepository,
	instrumentRepo *repositories.InstrumentRepository,
) *WatchlistService {
	return &WatchlistService{
		repo:           repo,
		instrumentRepo: instrumentRepo,
	}
}

func (s *WatchlistService) CreateWatchlist(userID, name string) (*models.Watchlist, error) {
	// Check existing watchlists count
	existing, err := s.repo.FindByUserID(userID)
	if err != nil {
		return nil, err
	}

	if len(existing) >= 5 {
		return nil, fmt.Errorf("maximum 5 watchlists allowed")
	}

	uid, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID")
	}

	watchlist := &models.Watchlist{
		UserID:        uid,
		Name:          name,
		InstrumentIDs: make([]primitive.ObjectID, 0),
		IsDefault:     len(existing) == 0, // First one is default
	}

	if err := s.repo.Create(watchlist); err != nil {
		return nil, err
	}

	return watchlist, nil
}

func (s *WatchlistService) GetUserWatchlists(userID string) ([]*models.Watchlist, error) {
	return s.repo.FindByUserID(userID)
}

func (s *WatchlistService) AddToWatchlist(userID, watchlistID, instrumentID string) error {
	// Verify watchlist ownership
	watchlist, err := s.repo.FindByID(watchlistID)
	if err != nil {
		return err
	}

	if watchlist.UserID.Hex() != userID {
		return fmt.Errorf("unauthorized")
	}

	// Check limit
	if len(watchlist.InstrumentIDs) >= 50 {
		return fmt.Errorf("maximum 50 instruments per watchlist")
	}

	// Verify instrument exists
	_, err = s.instrumentRepo.FindByID(instrumentID)
	if err != nil {
		return fmt.Errorf("instrument not found")
	}

	return s.repo.AddInstrument(watchlistID, instrumentID)
}

func (s *WatchlistService) RemoveFromWatchlist(userID, watchlistID, instrumentID string) error {
	// Verify watchlist ownership
	watchlist, err := s.repo.FindByID(watchlistID)
	if err != nil {
		return err
	}

	if watchlist.UserID.Hex() != userID {
		return fmt.Errorf("unauthorized")
	}

	return s.repo.RemoveInstrument(watchlistID, instrumentID)
}

func (s *WatchlistService) RenameWatchlist(userID, watchlistID, newName string) error {
	// Verify watchlist ownership
	watchlist, err := s.repo.FindByID(watchlistID)
	if err != nil {
		return err
	}

	if watchlist.UserID.Hex() != userID {
		return fmt.Errorf("unauthorized")
	}

	updates := bson.M{"name": newName}
	return s.repo.Update(watchlistID, updates)
}

func (s *WatchlistService) SetDefaultWatchlist(userID, watchlistID string) error {
	// Verify watchlist ownership
	watchlist, err := s.repo.FindByID(watchlistID)
	if err != nil {
		return err
	}

	if watchlist.UserID.Hex() != userID {
		return fmt.Errorf("unauthorized")
	}

	// Unset existing default
	if err := s.repo.UnsetDefault(userID); err != nil {
		return err
	}

	// Set new default
	updates := bson.M{"is_default": true}
	return s.repo.Update(watchlistID, updates)
}

func (s *WatchlistService) DeleteWatchlist(userID, watchlistID string) error {
	// Verify watchlist ownership
	watchlist, err := s.repo.FindByID(watchlistID)
	if err != nil {
		return err
	}

	if watchlist.UserID.Hex() != userID {
		return fmt.Errorf("unauthorized")
	}

	if watchlist.IsDefault {
		return fmt.Errorf("cannot delete default watchlist")
	}

	return s.repo.Delete(watchlistID)
}
