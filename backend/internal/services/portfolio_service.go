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
	portfolioRepo    *repositories.PortfolioRepository
	marketService    *MarketService
	accountService   *TradingAccountService
	analyticsService *AnalyticsService
}

func NewPortfolioService(
	portfolioRepo *repositories.PortfolioRepository,
	marketService *MarketService,
	accountService *TradingAccountService,
	analyticsService *AnalyticsService,
) *PortfolioService {
	return &PortfolioService{
		portfolioRepo:    portfolioRepo,
		marketService:    marketService,
		accountService:   accountService,
		analyticsService: analyticsService,
	}
}

// GetHoldings returns all active holdings for a user
func (s *PortfolioService) GetHoldings(ctx context.Context, userID string) ([]models.Holding, error) {
	return s.portfolioRepo.GetHoldings(ctx, userID)
}

// GetHolding returns a specific holding for validation
func (s *PortfolioService) GetHolding(ctx context.Context, userID, instrumentID string) (*models.Holding, error) {
	return s.portfolioRepo.GetHolding(ctx, userID, instrumentID)
}

// GetTradingAccount returns the user's trading account (wrapper)
func (s *PortfolioService) GetTradingAccount(ctx context.Context, userID string) (*models.TradingAccount, error) {
	return s.accountService.GetByUserID(userID)
}

// UpdatePosition processes a trade and updates the user's holding (Average Cost or Realized P&L)
func (s *PortfolioService) UpdatePosition(ctx context.Context, trade *models.Trade) error {
	log.Printf("[Portfolio] Updating position for Trade %s: %s %s Qty:%d Price:%f Intent:%s", trade.TradeID, trade.Side, trade.Symbol, trade.Quantity, trade.Price, trade.Intent)

	// Fetch existing holding (if any)
	userID := trade.UserID.Hex()
	instrumentID := trade.InstrumentID.Hex()
	holding, err := s.portfolioRepo.GetHolding(ctx, userID, instrumentID)
	if err != nil {
		log.Printf("[Portfolio] Error fetching holding: %v", err)
		return err
	}

	totalTradeCost := trade.Price * float64(trade.Quantity)
	fees := trade.Commission + trade.Fees

	// Determine Intent if missing (Backward Compatibility)
	intent := trade.Intent
	if intent == "" {
		if trade.Side == "BUY" {
			intent = string(models.IntentOpenLong)
		} else {
			intent = string(models.IntentCloseLong)
		}
	}

	if intent == string(models.IntentOpenLong) {
		// --- OPEN LONG (Standard Buy) ---
		if holding == nil {
			holding = &models.Holding{
				UserID:        trade.UserID,
				AccountID:     trade.AccountID,
				InstrumentID:  trade.InstrumentID,
				Symbol:        trade.Symbol,
				Quantity:      trade.Quantity,
				PositionType:  models.PositionLong,
				AvgEntryPrice: trade.Price, // Initial price
				TotalCost:     totalTradeCost,
				TotalFees:     fees,
				CreatedAt:     time.Now(),
				LastUpdated:   time.Now(),
				MarginStatus:  models.MarginOK,
			}
		} else {
			if holding.PositionType == models.PositionShort {
				return errors.New("cannot open long on existing short position. Use CLOSE_SHORT")
			}
			// timeTypedQty removed
			newTotalCost := holding.TotalCost + totalTradeCost
			newQuantity := holding.Quantity + trade.Quantity

			// Weighted Average Price
			if newQuantity > 0 {
				holding.AvgEntryPrice = newTotalCost / float64(newQuantity)
			}

			holding.TotalCost = newTotalCost
			holding.Quantity = newQuantity
			holding.TotalFees += fees
			holding.PositionType = models.PositionLong // Ensure type is set
			holding.LastUpdated = time.Now()
		}
	} else if intent == string(models.IntentCloseLong) {
		// --- CLOSE LONG (Standard Sell) ---
		if holding == nil || holding.Quantity < trade.Quantity {
			return errors.New("insufficient holdings to sell")
		}
		if holding.PositionType == models.PositionShort {
			return errors.New("cannot close long on short position")
		}

		// Calculate Realized P&L
		// Profit = (Sell Price - Buy Price) * Qty
		pnl := (trade.Price - holding.AvgEntryPrice) * float64(trade.Quantity)

		holding.Quantity -= trade.Quantity
		holding.TotalCost = float64(holding.Quantity) * holding.AvgEntryPrice
		holding.RealizedPL += pnl
		holding.TotalFees += fees
		holding.LastUpdated = time.Now()

		if err := s.accountService.UpdateRealizedPL(userID, pnl); err != nil {
			log.Printf("[Portfolio] Failed to update realized P&L: %v", err)
		}

	} else if intent == string(models.IntentOpenShort) {
		// --- OPEN SHORT ---
		if holding == nil {
			holding = &models.Holding{
				UserID:        trade.UserID,
				AccountID:     trade.AccountID,
				InstrumentID:  trade.InstrumentID,
				Symbol:        trade.Symbol,
				Quantity:      trade.Quantity,
				PositionType:  models.PositionShort,
				AvgEntryPrice: trade.Price,    // Entry price for short
				TotalCost:     totalTradeCost, // Tracks total value shorted (Liability)
				TotalFees:     fees,
				CreatedAt:     time.Now(),
				LastUpdated:   time.Now(),
				MarginStatus:  models.MarginOK,
			}
		} else {
			if holding.PositionType == models.PositionLong {
				return errors.New("cannot open short on existing long position")
			}
			newTotalCost := holding.TotalCost + totalTradeCost
			newQuantity := holding.Quantity + trade.Quantity

			// Weighted Average Entry Price for Short
			if newQuantity > 0 {
				holding.AvgEntryPrice = newTotalCost / float64(newQuantity)
			}
			holding.TotalCost = newTotalCost
			holding.Quantity = newQuantity
			holding.TotalFees += fees
			holding.PositionType = models.PositionShort // CRITICAL FIX: Force Type to Short
			holding.LastUpdated = time.Now()
		}

		// BLOCK MARGIN LOGIC
		// Requirement: 20% of Value
		marginToBlock := totalTradeCost * 0.20
		if err := s.accountService.BlockMargin(userID, marginToBlock); err != nil {
			return fmt.Errorf("failed to block margin: %v", err)
		}
		holding.BlockedMargin += marginToBlock
		holding.InitialMargin += marginToBlock

	} else if intent == string(models.IntentCloseShort) {
		// --- CLOSE SHORT (Buy to Cover) ---
		if holding == nil || holding.PositionType != models.PositionShort {
			return errors.New("no short position to cover")
		}
		if holding.Quantity < trade.Quantity {
			return errors.New("insufficient short quantity to cover")
		}

		// Calculate P&L: (EntryPrice - ExitPrice) * Qty
		// Short logic: Profit if Price goes DOWN (Entry - Exit > 0)
		pnl := (holding.AvgEntryPrice - trade.Price) * float64(trade.Quantity)

		// Calculate Margin Release
		// CRITICAL FIX: If fully closing position, release ALL remaining margin
		// Otherwise, use proportional release to avoid rounding errors
		preTradeQty := float64(holding.Quantity)
		marginRelease := 0.0

		if trade.Quantity >= holding.Quantity {
			// Full close - release ALL remaining margin to avoid rounding errors
			marginRelease = holding.BlockedMargin
			log.Printf("[Portfolio] Full close detected. Releasing all margin: %.2f", marginRelease)
		} else if preTradeQty > 0 {
			// Partial close - proportional release
			marginRelease = holding.BlockedMargin * (float64(trade.Quantity) / preTradeQty)
			log.Printf("[Portfolio] Partial close. Releasing proportional margin: %.2f (%.2f%%)", marginRelease, (float64(trade.Quantity)/preTradeQty)*100)
		}

		if err := s.accountService.ReleaseMargin(userID, marginRelease); err != nil {
			log.Printf("[Portfolio] Failed to release margin: %v", err)
		} else {
			holding.BlockedMargin -= marginRelease
			if holding.BlockedMargin < 0 {
				holding.BlockedMargin = 0
			}
		}

		holding.Quantity -= trade.Quantity
		holding.TotalCost = float64(holding.Quantity) * holding.AvgEntryPrice
		holding.RealizedPL += pnl
		holding.TotalFees += fees
		holding.LastUpdated = time.Now()

		if err := s.accountService.UpdateRealizedPL(userID, pnl); err != nil {
			log.Printf("[Portfolio] Failed to update P&L: %v", err)
		}
	}

	// Upsert Holding
	err = s.portfolioRepo.UpsertHolding(ctx, holding)
	if err != nil {
		log.Printf("[Portfolio] Failed to upsert holding: %v", err)
		return err
	}

	log.Printf("[Portfolio] Position updated successfully. New Qty: %d, Avg: %.2f", holding.Quantity, holding.AvgEntryPrice)

	// Trigger Analytics Engine (Diagnostics)
	go func() {
		if err := s.analyticsService.ProcessTrade(context.Background(), trade); err != nil {
			log.Printf("[Portfolio] Analytics processing error: %v", err)
		}
	}()

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
		staleCount := 0
		for _, p := range prices {
			// Check if price data is stale (>1 minute old)
			if time.Since(p.UpdatedAt) > 1*time.Minute {
				log.Printf("[Portfolio] WARNING: Stale market data for instrument %s (age: %v). Using fallback pricing.",
					p.InstrumentID.Hex(), time.Since(p.UpdatedAt))
				staleCount++
				continue // Skip stale data, will use AvgEntryPrice fallback
			}
			priceMap[p.InstrumentID.Hex()] = p.LastPrice
		}

		if staleCount > 0 {
			log.Printf("[Portfolio] Skipped %d stale price entries in snapshot calculation", staleCount)
		}

		for _, h := range holdings {
			price, ok := priceMap[h.InstrumentID.Hex()]
			if !ok {
				price = h.AvgEntryPrice // Fallback
			}

			value := float64(h.Quantity) * price
			if h.PositionType == models.PositionShort {
				holdingsValue -= value // Liability subtracts from equity
			} else {
				holdingsValue += value // Asset adds to equity
			}
		}
	}

	// 4. Create Snapshot
	totalEquity := account.Balance + holdingsValue

	snapshot := &models.PortfolioSnapshot{
		UserID:        account.UserID,
		Date:          time.Now(),
		TotalEquity:   totalEquity,
		CashBalance:   account.Balance,
		HoldingsValue: holdingsValue,
		CreatedAt:     time.Now(),
	}

	// CRITICAL: Circuit Breaker for Negative Equity
	// This prevents platform from owing money due to unlimited short losses
	if totalEquity < 0 {
		log.Printf("🚨 CRITICAL ALERT: User %s has NEGATIVE EQUITY: %.2f", userID, totalEquity)
		log.Printf("   Cash Balance: %.2f, Holdings Value: %.2f", account.Balance, holdingsValue)

		// Log all short positions for debugging
		for _, h := range holdings {
			if h.PositionType == models.PositionShort {
				log.Printf("   Short Position: %s Qty:%d AvgEntry:%.2f BlockedMargin:%.2f",
					h.Symbol, h.Quantity, h.AvgEntryPrice, h.BlockedMargin)
			}
		}

		// TODO: Implement auto-liquidation
		// For now, just log critical alert
		// In production, this should:
		// 1. Force liquidate all short positions immediately
		// 2. Notify admin via PagerDuty/email
		// 3. Lock account to prevent further trading
		log.Printf("⚠️  AUTO-LIQUIDATION NOT IMPLEMENTED - Manual intervention required!")
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
