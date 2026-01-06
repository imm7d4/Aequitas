package services

import (
	"fmt"
	"log"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type StopOrderService struct {
	orderRepo      *repositories.OrderRepository
	marketDataRepo *repositories.MarketDataRepository
	orderService   *OrderService
	stopChan       chan struct{}
}

func NewStopOrderService(
	orderRepo *repositories.OrderRepository,
	marketDataRepo *repositories.MarketDataRepository,
	orderService *OrderService,
) *StopOrderService {
	return &StopOrderService{
		orderRepo:      orderRepo,
		marketDataRepo: marketDataRepo,
		orderService:   orderService,
		stopChan:       make(chan struct{}),
	}
}

// Start begins the background monitoring service
func (s *StopOrderService) Start() {
	ticker := time.NewTicker(3 * time.Second)
	go func() {
		for {
			select {
			case <-ticker.C:
				s.MonitorStopOrders()
			case <-s.stopChan:
				ticker.Stop()
				return
			}
		}
	}()
	log.Println("Stop order monitoring service started (polling 3s)")
}

// Stop gracefully shuts down the monitoring service
func (s *StopOrderService) Stop() {
	close(s.stopChan)
	log.Println("Stop order monitoring service stopped")
}

// MonitorStopOrders checks all PENDING stop orders for trigger conditions
func (s *StopOrderService) MonitorStopOrders() {
	// Fetch all PENDING stop orders
	pendingOrders, err := s.orderRepo.FindPendingStopOrders()
	if err != nil {
		log.Printf("Stop monitor error: failed to fetch pending orders: %v", err)
		return
	}

	if len(pendingOrders) == 0 {
		return // No pending orders to monitor
	}

	log.Printf("🔍 Monitoring %d pending stop orders", len(pendingOrders))

	for _, order := range pendingOrders {
		// Fetch current market data
		marketData, err := s.marketDataRepo.FindByInstrumentID(order.InstrumentID.Hex())
		if err != nil || marketData == nil {
			log.Printf("Stop monitor warning: market data unavailable for %s (order %s)", order.Symbol, order.OrderID)
			continue
		}

		currentPrice := marketData.LastPrice

		// Handle trailing stops first (they need price updates)
		if order.OrderType == "TRAILING_STOP" {
			if s.UpdateTrailingStop(order, currentPrice) {
				// Trailing stop was updated, save changes
				if _, err := s.orderRepo.Update(order); err != nil {
					log.Printf("Stop monitor error: failed to update trailing stop %s: %v", order.OrderID, err)
				}
			}
		}

		// Check if order should trigger
		if s.CheckTriggerConditions(order, currentPrice) {
			log.Printf("🎯 Stop order triggered: %s (%s %s at ₹%.2f, current: ₹%.2f)",
				order.OrderID, order.Side, order.OrderType, s.getStopPrice(order), currentPrice)

			if err := s.TriggerStopOrder(order, currentPrice); err != nil {
				log.Printf("Stop monitor error: failed to trigger order %s: %v", order.OrderID, err)
			}
		}
	}
}

// CheckTriggerConditions determines if a stop order should trigger
func (s *StopOrderService) CheckTriggerConditions(order *models.Order, currentPrice float64) bool {
	if order.OrderType == "STOP" || order.OrderType == "STOP_LIMIT" {
		if order.StopPrice == nil {
			return false
		}

		if order.Side == "BUY" {
			// BUY stop triggers when price rises to or above stop price
			return currentPrice >= *order.StopPrice
		} else {
			// SELL stop triggers when price falls to or below stop price
			return currentPrice <= *order.StopPrice
		}
	}

	if order.OrderType == "TRAILING_STOP" {
		if order.CurrentStopPrice == nil {
			return false
		}

		if order.Side == "BUY" {
			// BUY trailing stop triggers when price rises to or above current stop
			return currentPrice >= *order.CurrentStopPrice
		} else {
			// SELL trailing stop triggers when price falls to or below current stop
			return currentPrice <= *order.CurrentStopPrice
		}
	}

	return false
}

// UpdateTrailingStop adjusts the trailing stop price as market moves favorably
// Returns true if stop price was updated
func (s *StopOrderService) UpdateTrailingStop(order *models.Order, currentPrice float64) bool {
	if order.TrailAmount == nil || order.TrailType == "" {
		return false
	}

	updated := false

	if order.Side == "SELL" {
		// For SELL trailing stops, track highest price and trail below it
		if order.HighestPrice == nil || currentPrice > *order.HighestPrice {
			// New high reached, update highest price
			order.HighestPrice = &currentPrice
			updated = true

			// Recalculate stop price
			var newStopPrice float64
			if order.TrailType == "PERCENTAGE" {
				newStopPrice = currentPrice * (1 - *order.TrailAmount/100)
			} else {
				// ABSOLUTE
				newStopPrice = currentPrice - *order.TrailAmount
			}

			// Stop price only moves UP for SELL orders (never down)
			if order.CurrentStopPrice == nil || newStopPrice > *order.CurrentStopPrice {
				order.CurrentStopPrice = &newStopPrice
				log.Printf("📈 Trailing stop updated: %s - New stop: ₹%.2f (High: ₹%.2f, Trail: %s%.2f)",
					order.OrderID, newStopPrice, currentPrice,
					map[bool]string{true: "", false: "₹"}[order.TrailType == "PERCENTAGE"],
					*order.TrailAmount)
			}
		}
	} else {
		// For BUY trailing stops, track lowest price and trail above it
		if order.LowestPrice == nil || currentPrice < *order.LowestPrice {
			// New low reached, update lowest price
			order.LowestPrice = &currentPrice
			updated = true

			// Recalculate stop price
			var newStopPrice float64
			if order.TrailType == "PERCENTAGE" {
				newStopPrice = currentPrice * (1 + *order.TrailAmount/100)
			} else {
				// ABSOLUTE
				newStopPrice = currentPrice + *order.TrailAmount
			}

			// Stop price only moves DOWN for BUY orders (never up)
			if order.CurrentStopPrice == nil || newStopPrice < *order.CurrentStopPrice {
				order.CurrentStopPrice = &newStopPrice
				log.Printf("📉 Trailing stop updated: %s - New stop: ₹%.2f (Low: ₹%.2f, Trail: %s%.2f)",
					order.OrderID, newStopPrice, currentPrice,
					map[bool]string{true: "", false: "₹"}[order.TrailType == "PERCENTAGE"],
					*order.TrailAmount)
			}
		}
	}

	return updated
}

// TriggerStopOrder converts a PENDING stop order to a MARKET or LIMIT order
func (s *StopOrderService) TriggerStopOrder(order *models.Order, triggerPrice float64) error {
	// Mark original order as TRIGGERED
	now := time.Now()
	order.TriggeredAt = &now
	order.TriggerPrice = &triggerPrice
	order.Status = "TRIGGERED"

	if _, err := s.orderRepo.Update(order); err != nil {
		return fmt.Errorf("failed to update triggered order: %w", err)
	}

	// Create new order based on stop type
	var newOrder models.Order

	if order.OrderType == "STOP" || order.OrderType == "TRAILING_STOP" {
		// Convert to MARKET order
		newOrder = models.Order{
			UserID:        order.UserID,
			AccountID:     order.AccountID,
			InstrumentID:  order.InstrumentID,
			Symbol:        order.Symbol,
			Side:          order.Side,
			OrderType:     "MARKET",
			Quantity:      order.Quantity,
			Source:        "STOP_TRIGGER",
			ClientOrderID: fmt.Sprintf("STOP-%s", order.OrderID),
			ParentOrderID: &order.ID,
		}
	} else if order.OrderType == "STOP_LIMIT" {
		// Convert to LIMIT order
		newOrder = models.Order{
			UserID:        order.UserID,
			AccountID:     order.AccountID,
			InstrumentID:  order.InstrumentID,
			Symbol:        order.Symbol,
			Side:          order.Side,
			OrderType:     "LIMIT",
			Quantity:      order.Quantity,
			Price:         order.LimitPrice, // Use the limit price from stop-limit order
			Source:        "STOP_TRIGGER",
			ClientOrderID: fmt.Sprintf("STOP-%s", order.OrderID),
			ParentOrderID: &order.ID,
		}
	}

	// Place the triggered order through OrderService (validates balance, etc.)
	// NOTE: SELL orders will be rejected here until position tracking is implemented (Phase 7)
	// This is intentional - users can place SELL stop orders, but they won't execute until
	// we have position tracking to verify holdings
	triggeredOrder, err := s.orderService.PlaceOrder(order.UserID.Hex(), newOrder)
	if err != nil {
		// Order trigger failed (likely insufficient balance or no position for SELL)
		log.Printf("❌ Stop order trigger failed: %s - %v", order.OrderID, err)

		// Mark original order as REJECTED with reason
		order.Status = "REJECTED"
		if _, updateErr := s.orderRepo.Update(order); updateErr != nil {
			log.Printf("Failed to mark order as rejected: %v", updateErr)
		}

		return fmt.Errorf("trigger failed: %w", err)
	}

	log.Printf("✅ Stop order executed: %s → %s (triggered at ₹%.2f)",
		order.OrderID, triggeredOrder.OrderID, triggerPrice)

	return nil
}

// getStopPrice is a helper to get the relevant stop price for logging
func (s *StopOrderService) getStopPrice(order *models.Order) float64 {
	if order.CurrentStopPrice != nil {
		return *order.CurrentStopPrice
	}
	if order.StopPrice != nil {
		return *order.StopPrice
	}
	return 0
}
