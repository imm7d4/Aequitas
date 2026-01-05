package services

import (
	"errors"
	"fmt"
	"math"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderService struct {
	orderRepo          *repositories.OrderRepository
	instrumentRepo     *repositories.InstrumentRepository
	tradingAccountRepo *repositories.TradingAccountRepository
	marketDataRepo     *repositories.MarketDataRepository
}

func NewOrderService(
	orderRepo *repositories.OrderRepository,
	instrumentRepo *repositories.InstrumentRepository,
	tradingAccountRepo *repositories.TradingAccountRepository,
	marketDataRepo *repositories.MarketDataRepository,
) *OrderService {
	return &OrderService{
		orderRepo:          orderRepo,
		instrumentRepo:     instrumentRepo,
		tradingAccountRepo: tradingAccountRepo,
		marketDataRepo:     marketDataRepo,
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
	if req.OrderType != "MARKET" && req.OrderType != "LIMIT" {
		return nil, errors.New("invalid order type. Must be MARKET or LIMIT")
	}

	// Market orders must not have a price
	if req.OrderType == "MARKET" && req.Price != nil {
		return nil, errors.New("market orders must not specify a price")
	}

	// Quantity must be positive
	if req.Quantity <= 0 {
		return nil, errors.New("quantity must be positive")
	}

	// 2. Instrument Validation
	instrument, err := s.instrumentRepo.FindByID(req.InstrumentID.Hex())
	if err != nil || instrument == nil {
		return nil, errors.New("instrument not found or inactive")
	}
	if instrument.Status != "ACTIVE" {
		return nil, errors.New("instrument is not active for trading")
	}

	// 3. Lot Size Validation
	if req.Quantity%instrument.LotSize != 0 {
		return nil, fmt.Errorf("quantity must be a multiple of lot size (%d)", instrument.LotSize)
	}

	// 4. Price & Tick Size Validation
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
	} else {
		return nil, errors.New("invalid order type")
	}

	// 5. Get Trading Account and Risk Check
	account, err := s.tradingAccountRepo.FindByUserID(userID)
	if err != nil || account == nil {
		return nil, errors.New("trading account not found")
	}

	// Risk Check based on side
	if req.Side == "BUY" {
		requiredFunds := float64(req.Quantity) * orderPrice
		if account.Balance < requiredFunds {
			return nil, fmt.Errorf("insufficient balance. Required: ₹%0.2f, Available: ₹%0.2f (includes 1%% market buffer if applicable)", requiredFunds, account.Balance)
		}
	} else if req.Side == "SELL" {
		// TODO: Implement position tracking in Phase 7
		// For now, reject all SELL orders to prevent short selling
		return nil, errors.New("SELL orders are not yet supported. Position tracking will be implemented in Phase 7")
	}

	// 6. Finalize Order
	userUID, _ := primitive.ObjectIDFromHex(userID)
	req.UserID = userUID
	req.AccountID = account.ID
	req.Status = "NEW"
	req.OrderID = fmt.Sprintf("ORD-%d", time.Now().UnixNano())
	req.ValidatedAt = time.Now()

	return s.orderRepo.Create(&req)
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

	// Only NEW orders can be cancelled
	if order.Status != "NEW" {
		return nil, fmt.Errorf("cannot cancel order with status: %s", order.Status)
	}

	order.Status = "CANCELLED"
	return s.orderRepo.Update(order)
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
