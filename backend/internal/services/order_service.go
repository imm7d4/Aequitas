package services

import (
	"context"
	"errors"
	"fmt"
	"log"
	"math"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderService struct {
	orderRepo           *repositories.OrderRepository
	instrumentRepo      *repositories.InstrumentRepository
	tradingAccountRepo  *repositories.TradingAccountRepository
	marketDataRepo      *repositories.MarketDataRepository
	matchingService     *MatchingService
	portfolioService    *PortfolioService
	notificationService *NotificationService
}

func NewOrderService(
	orderRepo *repositories.OrderRepository,
	instrumentRepo *repositories.InstrumentRepository,
	tradingAccountRepo *repositories.TradingAccountRepository,
	marketDataRepo *repositories.MarketDataRepository,
	matchingService *MatchingService,
	portfolioService *PortfolioService,
	notificationService *NotificationService,
) *OrderService {
	return &OrderService{
		orderRepo:           orderRepo,
		instrumentRepo:      instrumentRepo,
		tradingAccountRepo:  tradingAccountRepo,
		marketDataRepo:      marketDataRepo,
		matchingService:     matchingService,
		portfolioService:    portfolioService,
		notificationService: notificationService,
	}
}

func (s *OrderService) PlaceOrder(userID string, req models.Order) (*models.Order, error) {
	// 1. Basic Input Validation
	if req.Side == "" || req.OrderType == "" || req.InstrumentID.IsZero() || req.Quantity <= 0 {
		return nil, errors.New("side, type, instrument, and quantity are mandatory fields")
	}

	// Validate side
	if req.Side != "BUY" && req.Side != "SELL" {
		return nil, errors.New("invalid order side. Must be BUY or SELL")
	}

	// Validate order type
	validOrderTypes := []string{"MARKET", "LIMIT", "STOP", "STOP_LIMIT", "TRAILING_STOP"}
	isValidType := false
	for _, validType := range validOrderTypes {
		if req.OrderType == validType {
			isValidType = true
			break
		}
	}
	if !isValidType {
		return nil, errors.New("invalid order type. Must be MARKET, LIMIT, STOP, STOP_LIMIT, or TRAILING_STOP")
	}

	// Market orders must not have a price
	if req.OrderType == "MARKET" && req.Price != nil {
		return nil, errors.New("market orders must not specify a price")
	}

	// Quantity must be positive
	if req.Quantity <= 0 {
		return nil, errors.New("quantity must be positive")
	}

	// Validate Validity
	if req.Validity == "" {
		req.Validity = "DAY" // Default
	}
	if req.Validity != "DAY" && req.Validity != "IOC" && req.Validity != "GTC" {
		return nil, errors.New("invalid validity. Must be DAY, IOC, or GTC")
	}

	// MARKET orders cannot be GTC
	if req.OrderType == "MARKET" && req.Validity == "GTC" {
		return nil, errors.New("market orders cannot be GTC")
	}

	// 2. Get Instrument for Validation (needed for stop order validation)
	instrument, err := s.instrumentRepo.FindByID(req.InstrumentID.Hex())
	if err != nil || instrument == nil {
		return nil, errors.New("instrument not found or inactive")
	}
	if instrument.Status != "ACTIVE" {
		return nil, errors.New("instrument is not active for trading")
	}

	// 3. Stop Order Validation (if applicable)
	if req.OrderType == "STOP" || req.OrderType == "STOP_LIMIT" || req.OrderType == "TRAILING_STOP" {
		// Get current market price for validation
		marketData, err := s.marketDataRepo.FindByInstrumentID(instrument.ID.Hex())
		if err != nil || marketData == nil {
			return nil, errors.New("market data unavailable for stop order validation")
		}
		currentPrice := marketData.LastPrice

		if err := s.validateStopOrder(&req, instrument, currentPrice); err != nil {
			return nil, err
		}

		// Initialize trailing stop if applicable
		if req.OrderType == "TRAILING_STOP" {
			s.initializeTrailingStop(&req, currentPrice)
		}
	}

	// 4. Lot Size Validation
	if req.Quantity%instrument.LotSize != 0 {
		return nil, fmt.Errorf("quantity must be a multiple of lot size (%d)", instrument.LotSize)
	}

	// 6. Price & Tick Size Validation
	var orderPrice float64
	if req.OrderType == "LIMIT" {
		if req.Price == nil || *req.Price <= 0 {
			return nil, errors.New("price is required for limit orders")
		}

		// Tick size check
		// Using a small epsilon for float precision
		remainder := math.Mod(*req.Price, instrument.TickSize)
		if remainder > 0.000001 && instrument.TickSize-remainder > 0.000001 {
			return nil, fmt.Errorf("price must be a multiple of tick size (%v)", instrument.TickSize)
		}
		orderPrice = *req.Price
	} else if req.OrderType == "MARKET" {
		// Fetch LTP for risk check
		marketData, err := s.marketDataRepo.FindByInstrumentID(instrument.ID.Hex())
		if err != nil || marketData == nil {
			return nil, errors.New("market data unavailable for this instrument")
		}
		// Market orders don't have a fixed price, but we use LTP + 1% buffer for risk check
		orderPrice = marketData.LastPrice * 1.01
	} else if req.OrderType == "STOP" || req.OrderType == "STOP_LIMIT" || req.OrderType == "TRAILING_STOP" {
		// For stop orders, use stop price for balance validation
		if req.StopPrice != nil {
			orderPrice = *req.StopPrice
		} else if req.CurrentStopPrice != nil {
			// For trailing stops
			orderPrice = *req.CurrentStopPrice
		} else {
			return nil, errors.New("stop price required for stop orders")
		}
	} else {
		return nil, errors.New("invalid order type")
	}

	// 7. Get Trading Account and Risk Check
	account, err := s.tradingAccountRepo.FindByUserID(userID)
	if err != nil || account == nil {
		return nil, errors.New("trading account not found")
	}

	// Risk Check based on side
	// 8. Intent Validation & Specific Checks
	if req.Intent == "" {
		// Infer intent if missing (Backward compatibility)
		if req.Side == "BUY" {
			req.Intent = string(models.IntentOpenLong)
		} else {
			req.Intent = string(models.IntentCloseLong)
		}
	}

	// Validate Side vs Intent
	// CRITICAL FIX: Auto-correct logic if Frontend sends OPEN_LONG for a SELL order (Short Sell bug)
	if req.Side == "SELL" && req.Intent == string(models.IntentOpenLong) {
		log.Printf("WARNING: Detected SELL order with OPEN_LONG intent. Auto-correcting to OPEN_SHORT for user %s", userID)
		req.Intent = string(models.IntentOpenShort)
	}

	if (req.Intent == string(models.IntentOpenLong) || req.Intent == string(models.IntentCloseShort)) && req.Side != "BUY" {
		return nil, errors.New("invalid intent for BUY order")
	}
	if (req.Intent == string(models.IntentCloseLong) || req.Intent == string(models.IntentOpenShort)) && req.Side != "SELL" {
		return nil, errors.New("invalid intent for SELL order")
	}

	// Specific Validation Logic
	if req.Intent == string(models.IntentOpenShort) {
		// 1. Check if instrument is shortable
		if !instrument.IsShortable {
			return nil, errors.New("this instrument is not eligible for short selling")
		}

		// 2. Check Margin Availability (20% Requirement)
		// Margin = Price * Qty * 0.20
		requiredMargin := orderPrice * float64(req.Quantity) * 0.20

		// Check available funds
		if account.Balance-account.BlockedMargin < requiredMargin {
			return nil, fmt.Errorf("insufficient margin. Required: ₹%0.2f, Available: ₹%0.2f", requiredMargin, account.Balance-account.BlockedMargin)
		}
	} else if req.Intent == string(models.IntentCloseShort) {
		// Validate that we have a short position to cover
		holding, err := s.portfolioService.GetHolding(context.Background(), userID, instrument.ID.Hex())
		if err != nil {
			return nil, fmt.Errorf("failed to validate holdings: %v", err)
		}
		if holding == nil || holding.PositionType != models.PositionShort {
			return nil, errors.New("no short position found to cover")
		}

		// Check Pending Orders to prevent Over-Covering
		pendingQty, err := s.orderRepo.GetPendingQuantity(userID, instrument.ID.Hex(), req.Intent)
		if err != nil {
			return nil, fmt.Errorf("failed to check pending orders: %v", err)
		}

		totalCommitted := pendingQty + req.Quantity
		if holding.Quantity < totalCommitted {
			return nil, fmt.Errorf("insufficient short quantity. Open: %d, Committed: %d, Converting: %d", holding.Quantity, pendingQty, req.Quantity)
		}

	} else if req.Intent == string(models.IntentCloseLong) {
		// Standard Sell Check
		holding, err := s.portfolioService.GetHolding(context.Background(), userID, instrument.ID.Hex())
		if err != nil {
			return nil, fmt.Errorf("failed to validate holdings: %v", err)
		}
		if holding == nil || holding.PositionType == models.PositionShort {
			return nil, errors.New("no long position found to sell")
		}

		// Check Pending Orders to prevent Over-Selling
		pendingQty, err := s.orderRepo.GetPendingQuantity(userID, instrument.ID.Hex(), req.Intent)
		if err != nil {
			return nil, fmt.Errorf("failed to check pending orders: %v", err)
		}

		totalCommitted := pendingQty + req.Quantity
		if holding.Quantity < totalCommitted {
			return nil, fmt.Errorf("insufficient holdings to sell. Owned: %d, Committed: %d, Requested: %d", holding.Quantity, pendingQty, req.Quantity)
		}
	} else if req.Intent == string(models.IntentOpenLong) {
		// Standard Buy Check (Full Cash)
		requiredFunds := float64(req.Quantity) * orderPrice
		if account.Balance-account.BlockedMargin < requiredFunds {
			return nil, fmt.Errorf("insufficient funds. Required: ₹%0.2f, Available: ₹%0.2f", requiredFunds, account.Balance-account.BlockedMargin)
		}
	}

	// 9. Finalize Order
	userUID, _ := primitive.ObjectIDFromHex(userID)
	req.UserID = userUID
	req.AccountID = account.ID

	// Set status based on order type
	if req.OrderType == "STOP" || req.OrderType == "STOP_LIMIT" || req.OrderType == "TRAILING_STOP" {
		req.Status = "PENDING" // Stop orders start as PENDING
	} else {
		req.Status = "NEW" // Regular orders start as NEW
	}

	req.OrderID = fmt.Sprintf("ORD-%d", time.Now().UnixNano())
	req.ValidatedAt = time.Now()

	order, err := s.orderRepo.Create(&req)
	if err != nil {
		return nil, err
	}

	// 9. Immediate Execution for MARKET orders
	if order.OrderType == "MARKET" {
		_, execErr := s.matchingService.ExecuteMarketOrder(order)
		if execErr != nil {
			log.Printf("ERROR: Failed to execute market order %s immediately: %v", order.OrderID, execErr)
			// We don't return error here because the order IS saved, just execution failed (background will try later or manual)
			// But for MARKET orders, current price SHOULD be available.
		}
	}

	return order, nil
}
func (s *OrderService) GetUserOrders(userID string, filters map[string]interface{}, skip int, limit int) ([]*models.Order, int64, error) {
	return s.orderRepo.FindByUserID(userID, filters, skip, limit)
}

func (s *OrderService) CancelOrder(userID string, orderID string) (*models.Order, error) {
	order, err := s.orderRepo.FindByID(orderID)
	if err != nil || order == nil {
		return nil, errors.New("order not found")
	}

	// Double check ownership
	if order.UserID.Hex() != userID {
		return nil, errors.New("unauthorized")
	}

	// Only NEW and PENDING orders can be cancelled
	if order.Status != "NEW" && order.Status != "PENDING" {
		return nil, fmt.Errorf("cannot cancel order with status: %s", order.Status)
	}

	order.Status = "CANCELLED"
	updatedOrder, err := s.orderRepo.Update(order)
	if err != nil {
		return nil, err
	}

	// Send Notification
	go func() {
		_ = s.notificationService.SendNotification(
			context.Background(),
			userID,
			models.NotificationTypeOrder,
			"Order Cancelled",
			fmt.Sprintf("Your %s order for %d %s has been cancelled.", order.Side, order.Quantity, order.Symbol),
			map[string]interface{}{"orderId": order.ID.Hex(), "symbol": order.Symbol},
			nil,
		)
	}()

	return updatedOrder, nil
}

func (s *OrderService) ModifyOrder(userID string, orderID string, newQuantity int, newPrice *float64) (*models.Order, error) {
	// 1. Find and validate order
	order, err := s.orderRepo.FindByID(orderID)
	if err != nil || order == nil {
		return nil, errors.New("order not found")
	}

	// 2. Check ownership
	if order.UserID.Hex() != userID {
		return nil, errors.New("unauthorized")
	}

	// 3. Only NEW orders can be modified
	if order.Status != "NEW" {
		return nil, fmt.Errorf("cannot modify order with status: %s", order.Status)
	}

	// 4. Get instrument for validation
	instrument, err := s.instrumentRepo.FindByID(order.InstrumentID.Hex())
	if err != nil || instrument == nil {
		return nil, errors.New("instrument not found")
	}

	// 5. Validate new quantity (lot size)
	if newQuantity <= 0 {
		return nil, errors.New("quantity must be positive")
	}
	if newQuantity%instrument.LotSize != 0 {
		return nil, fmt.Errorf("quantity must be a multiple of lot size (%d)", instrument.LotSize)
	}

	// 6. Validate new price (tick size) if provided
	var orderPrice float64
	if order.OrderType == "LIMIT" {
		if newPrice == nil || *newPrice <= 0 {
			return nil, errors.New("price is required for limit orders")
		}
		// Tick size check
		remainder := math.Mod(*newPrice, instrument.TickSize)
		if remainder > 0.000001 && instrument.TickSize-remainder > 0.000001 {
			return nil, fmt.Errorf("price must be a multiple of tick size (%v)", instrument.TickSize)
		}
		orderPrice = *newPrice
	} else {
		// Market orders - use current LTP for balance check
		marketData, err := s.marketDataRepo.FindByInstrumentID(instrument.ID.Hex())
		if err != nil || marketData == nil {
			return nil, errors.New("market data unavailable")
		}
		orderPrice = marketData.LastPrice * 1.01
	}

	// 7. Re-check balance for BUY orders
	if order.Side == "BUY" {
		account, err := s.tradingAccountRepo.FindByUserID(userID)
		if err != nil || account == nil {
			return nil, errors.New("trading account not found")
		}

		requiredFunds := float64(newQuantity) * orderPrice
		if account.Balance < requiredFunds {
			return nil, fmt.Errorf("insufficient balance. Required: %0.2f, Available: %0.2f", requiredFunds, account.Balance)
		}
	}

	// 8. Update order
	order.Quantity = newQuantity
	if order.OrderType == "LIMIT" {
		order.Price = newPrice
	}
	order.UpdatedAt = time.Now()

	return s.orderRepo.Update(order)
}

// validateStopOrder validates stop-specific order fields
func (s *OrderService) validateStopOrder(order *models.Order, instrument *models.Instrument, currentPrice float64) error {
	// 1. Validate stop price for STOP and STOP_LIMIT orders
	if order.OrderType == "STOP" || order.OrderType == "STOP_LIMIT" {
		if order.StopPrice == nil || *order.StopPrice <= 0 {
			return errors.New("stop price is required and must be positive")
		}

		// Tick size validation
		remainder := math.Mod(*order.StopPrice, instrument.TickSize)
		if remainder > 0.000001 && instrument.TickSize-remainder > 0.000001 {
			return fmt.Errorf("stop price must be a multiple of tick size (%v)", instrument.TickSize)
		}

		// Logical placement validation
		if order.Side == "SELL" && *order.StopPrice >= currentPrice {
			return fmt.Errorf("SELL stop price must be below current market price (₹%.2f). You entered ₹%.2f. Tip: SELL stops protect long positions by triggering when price falls", currentPrice, *order.StopPrice)
		}
		if order.Side == "BUY" && *order.StopPrice <= currentPrice {
			return fmt.Errorf("BUY stop price must be above current market price (₹%.2f). You entered ₹%.2f. Tip: BUY stops trigger breakout entries when price rises", currentPrice, *order.StopPrice)
		}

		// Warning for stop price too close to market (within 0.5%)
		minDistance := currentPrice * 0.005
		if math.Abs(currentPrice-*order.StopPrice) < minDistance {
			// This is a warning, not an error - allow the order but user should be warned in UI
			// For now, we'll allow it
		}
	}

	// 2. Validate limit price for STOP_LIMIT orders
	if order.OrderType == "STOP_LIMIT" {
		if order.LimitPrice == nil || *order.LimitPrice <= 0 {
			return errors.New("limit price is required for stop-limit orders")
		}

		// Tick size validation
		remainder := math.Mod(*order.LimitPrice, instrument.TickSize)
		if remainder > 0.000001 && instrument.TickSize-remainder > 0.000001 {
			return fmt.Errorf("limit price must be a multiple of tick size (%v)", instrument.TickSize)
		}

		// Validate logical relationship between stop and limit price
		if order.Side == "BUY" && *order.LimitPrice < *order.StopPrice {
			return fmt.Errorf("BUY stop-limit: limit price (₹%.2f) must be >= stop price (₹%.2f). Tip: After price rises to ₹%.2f, you're willing to buy up to ₹%.2f", *order.LimitPrice, *order.StopPrice, *order.StopPrice, *order.LimitPrice)
		}
		if order.Side == "SELL" && *order.LimitPrice > *order.StopPrice {
			return fmt.Errorf("SELL stop-limit: limit price (₹%.2f) must be <= stop price (₹%.2f). Tip: After price falls to ₹%.2f, you're willing to sell down to ₹%.2f", *order.LimitPrice, *order.StopPrice, *order.StopPrice, *order.LimitPrice)
		}
	}

	// 3. Validate trailing stop parameters
	if order.OrderType == "TRAILING_STOP" {
		if order.TrailAmount == nil || *order.TrailAmount <= 0 {
			return errors.New("trail amount is required and must be positive")
		}

		if order.TrailType == "" {
			return errors.New("trail type is required (ABSOLUTE or PERCENTAGE)")
		}

		if order.TrailType != "ABSOLUTE" && order.TrailType != "PERCENTAGE" {
			return errors.New("trail type must be ABSOLUTE or PERCENTAGE")
		}

		// Validate percentage range
		if order.TrailType == "PERCENTAGE" {
			if *order.TrailAmount < 0.1 || *order.TrailAmount > 50 {
				return errors.New("percentage trail amount must be between 0.1% and 50%")
			}
		}

		// Validate absolute amount
		if order.TrailType == "ABSOLUTE" {
			if *order.TrailAmount < instrument.TickSize {
				return fmt.Errorf("absolute trail amount must be >= tick size (%v)", instrument.TickSize)
			}
		}
	}

	return nil
}

// initializeTrailingStop initializes trailing stop fields based on current price
func (s *OrderService) initializeTrailingStop(order *models.Order, currentPrice float64) {
	if order.TrailAmount == nil || order.TrailType == "" {
		return
	}

	var initialStopPrice float64

	if order.Side == "SELL" {
		// For SELL trailing stops (protecting long positions)
		order.HighestPrice = &currentPrice

		if order.TrailType == "PERCENTAGE" {
			initialStopPrice = currentPrice * (1 - *order.TrailAmount/100)
		} else {
			// ABSOLUTE
			initialStopPrice = currentPrice - *order.TrailAmount
		}
	} else {
		// For BUY trailing stops (protecting short positions)
		order.LowestPrice = &currentPrice

		if order.TrailType == "PERCENTAGE" {
			initialStopPrice = currentPrice * (1 + *order.TrailAmount/100)
		} else {
			// ABSOLUTE
			initialStopPrice = currentPrice + *order.TrailAmount
		}
	}

	order.CurrentStopPrice = &initialStopPrice
	order.StopPrice = &initialStopPrice // Also set StopPrice for consistency
}
