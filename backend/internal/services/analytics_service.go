package services

import (
	"context"
	"fmt"
	"log"
	"math"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type AnalyticsService struct {
	tradeResultRepo *repositories.TradeResultRepository
	activeUnitRepo  *repositories.ActiveTradeUnitRepository
	candleRepo      *repositories.CandleRepository
}

func NewAnalyticsService(
	tradeResultRepo *repositories.TradeResultRepository,
	activeUnitRepo *repositories.ActiveTradeUnitRepository,
	candleRepo *repositories.CandleRepository,
) *AnalyticsService {
	return &AnalyticsService{
		tradeResultRepo: tradeResultRepo,
		activeUnitRepo:  activeUnitRepo,
		candleRepo:      candleRepo,
	}
}

// ProcessTrade processes a trade through the FIFO engine to track diagnostics.
func (s *AnalyticsService) ProcessTrade(ctx context.Context, trade *models.Trade) error {
	userID := trade.UserID.Hex()
	instrumentID := trade.InstrumentID.Hex()

	// 1. Get or Create Active Unit
	unit, err := s.activeUnitRepo.FindOpenUnit(userID, instrumentID)
	if err != nil {
		return fmt.Errorf("failed to find open unit: %w", err)
	}

	if unit == nil {
		unit = &models.ActiveTradeUnit{
			UserID:         trade.UserID,
			InstrumentID:   trade.InstrumentID,
			Symbol:         trade.Symbol,
			CreatedAt:      time.Now(),
			FirstEntryTime: trade.ExecutedAt,
		}
		// Determine Side based on Intent
		if trade.Intent == string(models.IntentOpenLong) {
			unit.Side = "LONG"
		} else if trade.Intent == string(models.IntentOpenShort) {
			unit.Side = "SHORT"
		} else {
			// If we get a CLOSE intent without an open unit, something is out of sync
			// but we'll ignore it for diagnostics as it's not a round-trip we can track from start.
			log.Printf("[Analytics] Orphaned close trade detected for %s: %s", trade.Symbol, trade.Intent)
			return nil
		}
	}

	// 2. Classify trade action (Entry vs Exit)
	isEntry := false
	if unit.Side == "LONG" {
		isEntry = trade.Side == "BUY"
	} else {
		isEntry = trade.Side == "SELL"
	}

	if isEntry {
		unit.EntryQuantity += trade.Quantity
		unit.TotalEntryVal += trade.Price * float64(trade.Quantity)
		unit.EntryOrderIDs = append(unit.EntryOrderIDs, trade.OrderID)
		if unit.FirstEntryTime.IsZero() {
			unit.FirstEntryTime = trade.ExecutedAt
		}
	} else {
		unit.ExitQuantity += trade.Quantity
		unit.TotalExitVal += trade.Price * float64(trade.Quantity)
		unit.ExitOrderIDs = append(unit.ExitOrderIDs, trade.OrderID)
		unit.LastExitTime = trade.ExecutedAt
	}

	unit.TotalComms += trade.Commission + trade.Fees

	// 3. Check for Square-Off (Deterministic Identity)
	if unit.RemainingQty() == 0 && unit.EntryQuantity > 0 {
		// unit complete! Generate TradeResult
		go s.finalizeTradeResult(ctx, unit)
		return s.activeUnitRepo.Delete(unit.ID)
	}

	// 4. Persistence
	return s.activeUnitRepo.Upsert(unit)
}

func (s *AnalyticsService) finalizeTradeResult(ctx context.Context, unit *models.ActiveTradeUnit) {
	log.Printf("[Analytics] Finalizing TradeResult for %s (Qty: %d)", unit.Symbol, unit.EntryQuantity)

	avgEntry := unit.TotalEntryVal / float64(unit.EntryQuantity)
	avgExit := unit.TotalExitVal / float64(unit.ExitQuantity)

	res := &models.TradeResult{
		UserID:             unit.UserID,
		AccountID:          unit.UserID, // AccountID mapping if different
		InstrumentID:       unit.InstrumentID,
		Symbol:             unit.Symbol,
		Side:               unit.Side,
		Quantity:           unit.EntryQuantity,
		AvgEntryPrice:      avgEntry,
		AvgExitPrice:       avgExit,
		EntryNotional:      unit.TotalEntryVal,
		ExitNotional:       unit.TotalExitVal,
		TotalCommissions:   unit.TotalComms,
		EntryTime:          unit.FirstEntryTime,
		ExitTime:           unit.LastExitTime,
		EntryOrderIDs:      unit.EntryOrderIDs,
		ExitOrderIDs:       unit.ExitOrderIDs,
		CalculationVersion: 1,
	}

	// Calculate P&L
	if unit.Side == "LONG" {
		res.GrossPNL = res.ExitNotional - res.EntryNotional
	} else {
		res.GrossPNL = res.EntryNotional - res.ExitNotional
	}
	res.NetPNL = res.GrossPNL - res.TotalCommissions

	// Calculate Returns
	if res.EntryNotional > 0 {
		res.GrossReturnPct = (res.GrossPNL / res.EntryNotional) * 100
		res.NetReturnPct = (res.NetPNL / (res.EntryNotional + unit.TotalComms)) * 100
	}

	// Calculate Duration
	res.Duration = formatDuration(res.ExitTime.Sub(res.EntryTime))

	// Calculate MAE/MFE with Tiered Priority Fallback
	s.calculateExcursionsWithFallback(res)

	_, err := s.tradeResultRepo.Create(res)
	if err != nil {
		log.Printf("[Analytics] Failed to save TradeResult: %v", err)
	}
}

func (s *AnalyticsService) calculateExcursionsWithFallback(res *models.TradeResult) {
	// Priority 1: Intraday 1m Candles
	candles, err := s.candleRepo.GetCandles(res.InstrumentID.Hex(), "1m", res.EntryTime, res.ExitTime, 10000)

	if err == nil && len(candles) > 0 {
		var minPrice, maxPrice float64
		minPrice = math.MaxFloat64
		maxPrice = -math.MaxFloat64

		for _, c := range candles {
			if c.Low < minPrice {
				minPrice = c.Low
			}
			if c.High > maxPrice {
				maxPrice = c.High
			}
		}
		s.applyExcursionLogic(res, minPrice, maxPrice)
		return
	}

	// Priority 2: Fallback to Execution Prices (Reduced Accuracy)
	log.Printf("[Analytics] Candle data missing for %s, falling back to execution prices", res.Symbol)
	// In the absence of candles, the best we know is the AvgEntry and AvgExit
	// This is logically correct but not "Deep" diagnostics.
	s.applyExcursionLogic(res, math.Min(res.AvgEntryPrice, res.AvgExitPrice), math.Max(res.AvgEntryPrice, res.AvgExitPrice))
}

func (s *AnalyticsService) applyExcursionLogic(res *models.TradeResult, minPrice, maxPrice float64) {
	if res.Side == "LONG" {
		res.MAE = minPrice - res.AvgEntryPrice
		res.MFE = maxPrice - res.AvgEntryPrice
	} else {
		// SHORT: MAE = highest peak ABOVE entry (Adverse)
		res.MAE = maxPrice - res.AvgEntryPrice
		// SHORT: MFE = deepest drop BELOW entry (Favorable)
		res.MFE = minPrice - res.AvgEntryPrice
	}
}

func formatDuration(d time.Duration) string {
	d = d.Round(time.Second)
	h := d / time.Hour
	d -= h * time.Hour
	m := d / time.Minute
	d -= m * time.Minute
	s := d / time.Second

	if h > 0 {
		return fmt.Sprintf("%dh %dm %ds", h, m, s)
	}
	if m > 0 {
		return fmt.Sprintf("%dm %ds", m, s)
	}
	return fmt.Sprintf("%ds", s)
}

func (s *AnalyticsService) GetUserTradeDiagnostics(userID string) ([]*models.TradeResult, error) {
	return s.tradeResultRepo.FindByUserID(userID)
}
