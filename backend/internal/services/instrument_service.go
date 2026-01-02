package services

import (
	"fmt"
	"strings"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/utils"
)

type InstrumentService struct {
	repo *repositories.InstrumentRepository
}

func NewInstrumentService(repo *repositories.InstrumentRepository) *InstrumentService {
	return &InstrumentService{repo: repo}
}

type CreateInstrumentRequest struct {
	Symbol      string  `json:"symbol"`
	Name        string  `json:"name"`
	ISIN        string  `json:"isin"`
	Exchange    string  `json:"exchange"`
	Type        string  `json:"type"`
	Sector      string  `json:"sector"`
	LotSize     int     `json:"lotSize"`
	TickSize    float64 `json:"tickSize"`
	ListingDate string  `json:"listingDate"`
}

type UpdateInstrumentRequest struct {
	Name     string  `json:"name,omitempty"`
	Sector   string  `json:"sector,omitempty"`
	LotSize  int     `json:"lotSize,omitempty"`
	TickSize float64 `json:"tickSize,omitempty"`
	Status   string  `json:"status,omitempty"`
}

func (s *InstrumentService) CreateInstrument(
	req CreateInstrumentRequest,
) (*models.Instrument, error) {
	// Validate required fields
	if err := s.validateCreateRequest(req); err != nil {
		return nil, err
	}

	// Validate ISIN format
	if !utils.ValidateISIN(req.ISIN) {
		return nil, fmt.Errorf("invalid ISIN format")
	}

	// Check for duplicate symbol on same exchange
	existing, err := s.repo.FindBySymbol(req.Symbol, req.Exchange)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, fmt.Errorf("symbol already exists on this exchange")
	}

	// Determine listing date
	listingDate := time.Now()
	if req.ListingDate != "" {
		if parsed, err := time.Parse("2006-01-02", req.ListingDate); err == nil {
			listingDate = parsed
		}
	}

	// Create instrument
	instrument := &models.Instrument{
		Symbol:      strings.ToUpper(req.Symbol),
		Name:        req.Name,
		ISIN:        strings.ToUpper(req.ISIN),
		Exchange:    strings.ToUpper(req.Exchange),
		Type:        strings.ToUpper(req.Type),
		Sector:      req.Sector,
		LotSize:     req.LotSize,
		TickSize:    req.TickSize,
		Status:      "ACTIVE",
		ListingDate: listingDate,
	}

	if err := s.repo.Create(instrument); err != nil {
		return nil, err
	}

	return instrument, nil
}

func (s *InstrumentService) GetInstruments(
	isAdmin bool,
) ([]*models.Instrument, error) {
	filter := make(map[string]interface{})

	// Non-admin users only see ACTIVE instruments
	if !isAdmin {
		filter["status"] = "ACTIVE"
	}

	return s.repo.FindAll(filter)
}

func (s *InstrumentService) SearchInstruments(
	query string,
) ([]*models.Instrument, error) {
	if query == "" {
		return []*models.Instrument{}, nil
	}

	return s.repo.Search(query)
}

func (s *InstrumentService) GetInstrumentByID(
	id string,
) (*models.Instrument, error) {
	return s.repo.FindByID(id)
}

func (s *InstrumentService) UpdateInstrument(
	id string,
	req UpdateInstrumentRequest,
) (*models.Instrument, error) {
	// Validate status if provided
	if req.Status != "" {
		validStatuses := map[string]bool{
			"ACTIVE": true, "SUSPENDED": true, "DELISTED": true,
		}
		if !validStatuses[req.Status] {
			return nil, fmt.Errorf("invalid status")
		}
	}

	// Validate lot size and tick size
	if req.LotSize < 1 {
		return nil, fmt.Errorf("lot size must be at least 1")
	}
	if req.TickSize < 0.01 {
		return nil, fmt.Errorf("tick size must be at least 0.01")
	}

	// Build updates map
	updates := make(map[string]interface{})
	if req.Name != "" {
		updates["name"] = req.Name
	}
	if req.Sector != "" {
		updates["sector"] = req.Sector
	}
	if req.LotSize > 0 {
		updates["lot_size"] = req.LotSize
	}
	if req.TickSize > 0 {
		updates["tick_size"] = req.TickSize
	}
	if req.Status != "" {
		updates["status"] = req.Status
	}

	if err := s.repo.Update(id, updates); err != nil {
		return nil, err
	}

	return s.repo.FindByID(id)
}

func (s *InstrumentService) DeactivateInstrument(id string) error {
	updates := map[string]interface{}{
		"status": "DELISTED",
	}
	return s.repo.Update(id, updates)
}

func (s *InstrumentService) validateCreateRequest(
	req CreateInstrumentRequest,
) error {
	if req.Symbol == "" {
		return fmt.Errorf("symbol is required")
	}
	if len(req.Symbol) > 20 {
		return fmt.Errorf("symbol must be max 20 characters")
	}
	if req.Name == "" {
		return fmt.Errorf("name is required")
	}
	if len(req.Name) > 200 {
		return fmt.Errorf("name must be max 200 characters")
	}
	if req.ISIN == "" {
		return fmt.Errorf("ISIN is required")
	}
	if len(req.ISIN) != 12 {
		return fmt.Errorf("ISIN must be exactly 12 characters")
	}

	validExchanges := map[string]bool{"NSE": true, "BSE": true}
	if !validExchanges[strings.ToUpper(req.Exchange)] {
		return fmt.Errorf("exchange must be NSE or BSE")
	}

	validTypes := map[string]bool{
		"STOCK": true, "ETF": true, "BOND": true, "MUTUAL_FUND": true,
	}
	if !validTypes[strings.ToUpper(req.Type)] {
		return fmt.Errorf("invalid instrument type")
	}

	if req.LotSize < 1 {
		return fmt.Errorf("lot size must be at least 1")
	}
	if req.TickSize < 0.01 {
		return fmt.Errorf("tick size must be at least 0.01")
	}

	return nil
}
