package services

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type PortfolioService struct {
	portfolioRepo  *repositories.PortfolioRepository
	marketService  *MarketService
	accountService *TradingAccountService
}

func NewPortfolioService(
	portfolioRepo *repositories.PortfolioRepository,
	marketService *MarketService,
	accountService *TradingAccountService,
) *PortfolioService {
	return &PortfolioService{
		portfolioRepo:  portfolioRepo,
		marketService:  marketService,
		accountService: accountService,
	}
}

// GetHoldings returns all holdings for a user
func (s *PortfolioService) GetHoldings(ctx context.Context, userID string) ([]models.Holding, error) {
	return s.portfolioRepo.GetHoldings(ctx, userID)
}

// UpdatePosition processes a trade and updates the user's holding (Average Cost or Realized P&L)
func (s *PortfolioService) UpdatePosition(ctx context.Context, trade *models.Trade) error {
	log.Printf("[Portfolio] Updating position for Trade %s: %s %s Qty:%d Price:%f", trade.TradeID, trade.Side, trade.Symbol, trade.Quantity, trade.Price)

	// Fetch existing holding (if any)
	userID := trade.UserID.Hex()
	instrumentID := trade.InstrumentID.Hex()
	holding, err := s.portfolioRepo.GetHolding(ctx, userID, instrumentID)
	if err != nil {
		log.Printf("[Portfolio] Error fetching holding: %v", err)
		return err
	}

	// Initialize new holding if none exists
	if holding == nil {
		holding = &models.Holding{
			UserID:       trade.UserID,
			AccountID:    trade.AccountID,
			InstrumentID: trade.InstrumentID,
			Symbol:       trade.Symbol,
			Quantity:     0,
			AvgCost:      0,
			TotalCost:    0,
			RealizedPL:   0,
		}
	}

	if trade.Side == "BUY" {
		// --- BUY LOGIC (Weighted Average Price) ---
		// New Cost Basis = Old Total Cost + (Trade Price * Qty) + Fees
		// Note: We capitalize fees into the cost basis for conservative P&L
		costOfTrade := trade.Value + trade.Commission + trade.Fees

		newTotalCost := holding.TotalCost + costOfTrade
		newQuantity := holding.Quantity + trade.Quantity

		if newQuantity > 0 {
			holding.AvgCost = newTotalCost / float64(newQuantity)
		} else {
			holding.AvgCost = 0
		}

		holding.TotalCost = newTotalCost
		holding.Quantity = newQuantity

	} else if trade.Side == "SELL" {
		// --- SELL LOGIC (Realized P&L) ---
		if holding.Quantity < trade.Quantity {
			log.Printf("[Portfolio] Error: Selling more than owned. Owned: %d, Sold: %d", holding.Quantity, trade.Quantity)
			return errors.New("insufficient holdings to sell")
		}

		// Calculate Cost of Goods Sold (COGS) based on current AvgCost
		costOfSoldShares := float64(trade.Quantity) * holding.AvgCost

		// Net Proceeds = Trade Value - Fees
		netProceeds := trade.NetValue // Already has fees deducted in Trade model (Price*Qty - Fees)

		// Realized P&L for this specific trade
		tradeRealizedPL := netProceeds - costOfSoldShares

		// Update Holding Stats
		holding.RealizedPL += tradeRealizedPL
		holding.Quantity -= trade.Quantity

		// Update TotalCost to reflect remaining shares (AvgCost stays same during simple sell)
		holding.TotalCost = float64(holding.Quantity) * holding.AvgCost
	}

	// If quantity becomes 0 (or less, though safeguards exist), we generally keep record for history/RealizedP&L
	// But usually 'GetHoldings' filters Qty > 0. We will Upsert.
	// If the requirement is to delete closed positions, we can do that, but keeping them allows showing realized P&L later.
	// We'll keep it upserted.

	err = s.portfolioRepo.UpsertHolding(ctx, holding)
	if err != nil {
		log.Printf("[Portfolio] Failed to upsert holding: %v", err)
		return err
	}

	log.Printf("[Portfolio] Position updated successfully. New Qty: %d, Avg: %.2f", holding.Quantity, holding.AvgCost)
	return nil
}

// CaptureSnapshot calculates current portfolio value and saves a snapshot
func (s *PortfolioService) CaptureSnapshot(ctx context.Context, userID string) (*models.PortfolioSnapshot, error) {
	// 1. Get Cash Balance
	account, err := s.accountService.GetByUserID(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get account: %w", err)
	}

	// 2. Get Holdings
	holdings, err := s.portfolioRepo.GetHoldings(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get holdings: %w", err)
	}

	// 3. Calculate Holdings Value using Live Prices
	var holdingsValue float64
	var instrumentIDs []string
	for _, h := range holdings {
		instrumentIDs = append(instrumentIDs, h.InstrumentID.Hex())
	}

	if len(instrumentIDs) > 0 {
		prices, err := s.marketService.GetBatchPrices(instrumentIDs)
		if err != nil {
			log.Printf("Failed to get prices for snapshot: %v", err)
			// Decide: Fail or continue with AvgCost? Let's fail for now to ensure data quality
			// Or soft fail? Let's soft fail and use AvgCost as fallback if price logic is strict
			// But GetBatchPrices should return what it has.
		}

		priceMap := make(map[string]float64)
		for _, p := range prices {
			priceMap[p.InstrumentID.Hex()] = p.LastPrice
		}

		for _, h := range holdings {
			price, ok := priceMap[h.InstrumentID.Hex()]
			if !ok {
				price = h.AvgCost // Fallback
			}
			holdingsValue += float64(h.Quantity) * price
		}
	}

	// 4. Create Snapshot
	snapshot := &models.PortfolioSnapshot{
		UserID:        account.UserID,
		Date:          time.Now(),
		TotalEquity:   account.Balance + holdingsValue,
		CashBalance:   account.Balance,
		HoldingsValue: holdingsValue,
		CreatedAt:     time.Now(),
	}

	if err := s.portfolioRepo.CreateSnapshot(ctx, snapshot); err != nil {
		return nil, err
	}

	return snapshot, nil
}

// GetSnapshotHistory returns snapshots for charts
func (s *PortfolioService) GetSnapshotHistory(ctx context.Context, userID string, limit int) ([]models.PortfolioSnapshot, error) {
	return s.portfolioRepo.GetSnapshots(ctx, userID, limit)
}
