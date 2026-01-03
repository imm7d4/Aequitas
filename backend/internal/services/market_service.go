package services

import (
	"fmt"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/utils"
)

type MarketService struct {
	repo           *repositories.MarketRepository
	marketDataRepo *repositories.MarketDataRepository
}

func NewMarketService(
	repo *repositories.MarketRepository,
	marketDataRepo *repositories.MarketDataRepository,
) *MarketService {
	return &MarketService{
		repo:           repo,
		marketDataRepo: marketDataRepo,
	}
}

func (s *MarketService) GetBatchPrices(instrumentIDs []string) ([]*models.MarketData, error) {
	return s.marketDataRepo.FindByInstrumentIDs(instrumentIDs)
}

type CreateMarketHoursRequest struct {
	Exchange        string `json:"exchange"`
	DayOfWeek       int    `json:"dayOfWeek"`
	PreMarketStart  string `json:"preMarketStart"`
	PreMarketEnd    string `json:"preMarketEnd"`
	MarketOpen      string `json:"marketOpen"`
	MarketClose     string `json:"marketClose"`
	PostMarketStart string `json:"postMarketStart"`
	PostMarketEnd   string `json:"postMarketEnd"`
	IsClosed        bool   `json:"isClosed"`
}

type CreateHolidayRequest struct {
	Exchange string `json:"exchange"`
	Date     string `json:"date"`
	Name     string `json:"name"`
}

type UpdateWeeklyHoursRequest struct {
	Hours []CreateMarketHoursRequest `json:"hours"`
}

func (s *MarketService) IsMarketOpen(
	exchange string,
) (bool, *models.MarketStatus, error) {
	status, err := s.GetMarketStatus(exchange)
	if err != nil {
		return false, nil, err
	}

	return status.Status == "OPEN", status, nil
}

func (s *MarketService) GetMarketStatus(
	exchange string,
) (*models.MarketStatus, error) {
	currentTime := utils.GetISTTime()

	// Check if holiday
	isHoliday, err := s.repo.IsHoliday(exchange, currentTime)
	if err != nil {
		return nil, err
	}
	if isHoliday {
		nextOpen := s.getNextMarketOpen(currentTime, exchange)
		return &models.MarketStatus{
			Exchange:    exchange,
			Status:      "CLOSED",
			CurrentTime: currentTime,
			NextOpen:    nextOpen,
			NextClose:   time.Time{},
		}, nil
	}

	// Get market hours for today
	dayOfWeek := int(currentTime.Weekday())
	if dayOfWeek == 0 {
		dayOfWeek = 7 // Sunday = 7
	}

	hours, err := s.repo.FindMarketHours(exchange, dayOfWeek)
	if err != nil {
		return nil, err
	}

	// If no hours configured or market is marked as closed for this day
	if hours == nil || hours.IsClosed {
		nextOpen := s.getNextMarketOpen(currentTime, exchange)
		return &models.MarketStatus{
			Exchange:    exchange,
			Status:      "CLOSED",
			CurrentTime: currentTime,
			NextOpen:    nextOpen,
			NextClose:   time.Time{},
		}, nil
	}

	// Parse market hours
	preMarketStart, _ := utils.CombineDateTime(currentTime, hours.PreMarketStart)
	preMarketEnd, _ := utils.CombineDateTime(currentTime, hours.PreMarketEnd)
	marketOpen, _ := utils.CombineDateTime(currentTime, hours.MarketOpen)
	marketClose, _ := utils.CombineDateTime(currentTime, hours.MarketClose)
	postMarketStart, _ := utils.CombineDateTime(currentTime, hours.PostMarketStart)
	postMarketEnd, _ := utils.CombineDateTime(currentTime, hours.PostMarketEnd)

	// Determine current status
	var status string
	var nextOpen, nextClose time.Time

	if utils.IsTimeInRange(currentTime, preMarketStart, preMarketEnd) {
		status = "PRE_MARKET"
		nextOpen = marketOpen
		nextClose = preMarketEnd
	} else if utils.IsTimeInRange(currentTime, marketOpen, marketClose) {
		status = "OPEN"
		nextOpen = time.Time{}
		nextClose = marketClose
	} else if utils.IsTimeInRange(currentTime, postMarketStart, postMarketEnd) {
		status = "POST_MARKET"
		nextOpen = s.getNextMarketOpen(currentTime, exchange)
		nextClose = postMarketEnd
	} else {
		status = "CLOSED"
		if currentTime.Before(preMarketStart) {
			nextOpen = preMarketStart
		} else {
			nextOpen = s.getNextMarketOpen(currentTime, exchange)
		}
		nextClose = time.Time{}
	}

	return &models.MarketStatus{
		Exchange:    exchange,
		Status:      status,
		CurrentTime: currentTime,
		NextOpen:    nextOpen,
		NextClose:   nextClose,
	}, nil
}

func (s *MarketService) ValidateTradingTime(exchange string) error {
	isOpen, status, err := s.IsMarketOpen(exchange)
	if err != nil {
		return err
	}

	if !isOpen {
		if status.Status == "CLOSED" {
			return fmt.Errorf(
				"market is currently closed. Trading hours: 09:15 - 15:30 IST",
			)
		}
		return fmt.Errorf(
			"market is in %s session. Regular trading: 09:15 - 15:30 IST",
			status.Status,
		)
	}

	return nil
}

func (s *MarketService) CreateMarketHours(
	req CreateMarketHoursRequest,
) error {
	// Validate time formats only if market is not closed
	if !req.IsClosed {
		if _, _, err := utils.ParseTimeString(req.PreMarketStart); err != nil {
			return fmt.Errorf("invalid pre-market start time: %w", err)
		}
		if _, _, err := utils.ParseTimeString(req.MarketOpen); err != nil {
			return fmt.Errorf("invalid market open time: %w", err)
		}
		if _, _, err := utils.ParseTimeString(req.MarketClose); err != nil {
			return fmt.Errorf("invalid market close time: %w", err)
		}
	}

	hours := &models.MarketHours{
		Exchange:        req.Exchange,
		DayOfWeek:       req.DayOfWeek,
		PreMarketStart:  req.PreMarketStart,
		PreMarketEnd:    req.PreMarketEnd,
		MarketOpen:      req.MarketOpen,
		MarketClose:     req.MarketClose,
		PostMarketStart: req.PostMarketStart,
		PostMarketEnd:   req.PostMarketEnd,
		IsClosed:        req.IsClosed,
	}

	return s.repo.CreateMarketHours(hours)
}

func (s *MarketService) GetWeeklyHours(exchange string) ([]*models.MarketHours, error) {
	hours, err := s.repo.FindAllMarketHoursByExchange(exchange)
	if err != nil {
		return nil, err
	}

	// Create a map for quick lookup
	hoursMap := make(map[int]*models.MarketHours)
	for _, h := range hours {
		hoursMap[h.DayOfWeek] = h
	}

	// Ensure we have entries for all 7 days (Monday=1 to Sunday=7)
	result := make([]*models.MarketHours, 7)
	for day := 1; day <= 7; day++ {
		if h, exists := hoursMap[day]; exists {
			result[day-1] = h
		} else {
			// Return nil for days without configuration
			result[day-1] = nil
		}
	}

	return result, nil
}

func (s *MarketService) UpdateWeeklyHours(
	exchange string,
	requests []CreateMarketHoursRequest,
) error {
	// Validate all requests first
	for _, req := range requests {
		if req.Exchange != exchange {
			return fmt.Errorf("exchange mismatch in request")
		}
		if req.DayOfWeek < 1 || req.DayOfWeek > 7 {
			return fmt.Errorf("invalid day of week: %d", req.DayOfWeek)
		}

		// Validate time formats only if market is not closed
		if !req.IsClosed {
			if _, _, err := utils.ParseTimeString(req.PreMarketStart); err != nil {
				return fmt.Errorf("invalid pre-market start time for day %d: %w", req.DayOfWeek, err)
			}
			if _, _, err := utils.ParseTimeString(req.MarketOpen); err != nil {
				return fmt.Errorf("invalid market open time for day %d: %w", req.DayOfWeek, err)
			}
			if _, _, err := utils.ParseTimeString(req.MarketClose); err != nil {
				return fmt.Errorf("invalid market close time for day %d: %w", req.DayOfWeek, err)
			}
		}
	}

	// Upsert all hours
	for _, req := range requests {
		hours := &models.MarketHours{
			Exchange:        req.Exchange,
			DayOfWeek:       req.DayOfWeek,
			PreMarketStart:  req.PreMarketStart,
			PreMarketEnd:    req.PreMarketEnd,
			MarketOpen:      req.MarketOpen,
			MarketClose:     req.MarketClose,
			PostMarketStart: req.PostMarketStart,
			PostMarketEnd:   req.PostMarketEnd,
			IsClosed:        req.IsClosed,
		}

		if err := s.repo.UpsertMarketHours(hours); err != nil {
			return fmt.Errorf("failed to update hours for day %d: %w", req.DayOfWeek, err)
		}
	}

	return nil
}

func (s *MarketService) CreateHoliday(req CreateHolidayRequest) error {
	date, err := time.Parse("2006-01-02", req.Date)
	if err != nil {
		return fmt.Errorf("invalid date format (use YYYY-MM-DD): %w", err)
	}

	holiday := &models.MarketHoliday{
		Exchange: req.Exchange,
		Date:     date,
		Name:     req.Name,
	}

	return s.repo.CreateHoliday(holiday)
}

func (s *MarketService) GetHolidays(exchange string) ([]*models.MarketHoliday, error) {
	return s.repo.FindAllHolidays(exchange)
}

func (s *MarketService) DeleteHoliday(id string) error {
	return s.repo.DeleteHoliday(id)
}

func (s *MarketService) getNextMarketOpen(
	currentTime time.Time,
	exchange string,
) time.Time {
	// Find next open day by checking market hours configuration
	nextDay := currentTime.Add(24 * time.Hour)

	// Check up to 14 days ahead to find next open day
	for i := 0; i < 14; i++ {
		dayOfWeek := int(nextDay.Weekday())
		if dayOfWeek == 0 {
			dayOfWeek = 7
		}

		hours, err := s.repo.FindMarketHours(exchange, dayOfWeek)
		if err == nil && hours != nil && !hours.IsClosed {
			// Found an open day
			nextOpen, _ := utils.CombineDateTime(nextDay, hours.PreMarketStart)
			return nextOpen
		}

		nextDay = nextDay.Add(24 * time.Hour)
	}

	// Fallback: return next day at 09:15 if no configuration found
	nextOpen, _ := utils.CombineDateTime(nextDay, "09:15")
	return nextOpen
}
