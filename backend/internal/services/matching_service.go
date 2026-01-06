package services

import (
	"fmt"
	"log"
	"time"

	"aequitas/internal/models"
	"aequitas/internal/repositories"
)

type MatchingService struct {
	orderRepo      *repositories.OrderRepository
	tradeRepo      *repositories.TradeRepository
	marketDataRepo *repositories.MarketDataRepository
	accountService *TradingAccountService
	stopChan       chan struct{}
}

func NewMatchingService(
	orderRepo *repositories.OrderRepository,
	tradeRepo *repositories.TradeRepository,
	marketDataRepo *repositories.MarketDataRepository,
	accountService *TradingAccountService,
) *MatchingService {
	return &MatchingService{
		orderRepo:      orderRepo,
		tradeRepo:      tradeRepo,
		marketDataRepo: marketDataRepo,
		accountService: accountService,
		stopChan:       make(chan struct{}),
	}
}

func (s *MatchingService) Start() {
	ticker := time.NewTicker(3 * time.Second)
	go func() {
		for {
			select {
			case <-ticker.C:
				s.MatchLimitOrders()
			case <-s.stopChan:
				ticker.Stop()
				return
			}
		}
	}()
	log.Println("Matching engine started (polling limit orders 3s)")
}

func (s *MatchingService) Stop() {
	close(s.stopChan)
}

// ExecuteMarketOrder performs an immediate fill for an order at current LTP
func (s *MatchingService) ExecuteMarketOrder(order *models.Order) (*models.Trade, error) {
	// 1. Get current market price
	marketData, err := s.marketDataRepo.FindByInstrumentID(order.InstrumentID.Hex())
	if err != nil || marketData == nil {
		return nil, fmt.Errorf("matching engine: market data unavailable for %s", order.Symbol)
	}

	executionPrice := marketData.LastPrice

	// 2. Create trade record
	trade, err := s.createTrade(order, executionPrice)
	if err != nil {
		return nil, err
	}

	// 3. Update order status
	order.Status = "FILLED"
	order.FilledQuantity = order.Quantity
	order.AvgFillPrice = executionPrice
	now := time.Now()
	order.FilledAt = &now

	_, err = s.orderRepo.Update(order)
	if err != nil {
		log.Printf("ERROR: Matching engine failed to update order %s to FILLED: %v", order.OrderID, err)
		return nil, err
	}

	// 4. Update Finance (Settlement)
	err = s.accountService.SettleTrade(order.UserID.Hex(), trade.NetValue, trade.TradeID, trade.Side)
	if err != nil {
		log.Printf("ERROR: Settlement failed for trade %s: %v", trade.TradeID, err)
	}

	log.Printf("MATCHED: Market Order %s FILLED at ₹%.2f (Qty: %d)", order.OrderID, executionPrice, order.Quantity)
	return trade, nil
}

// MatchLimitOrders scans for NEW limit orders and matches them against current LTP
func (s *MatchingService) MatchLimitOrders() {
	// Use the generic FindByUserID or a specialized query in repo if needed
	// For now, let's use a specialized query if it exists, otherwise we filter NEW orders

	// We'll need a way to find all NEW LIMIT orders across all users
	// Updating repository to support this
	orders, err := s.orderRepo.FindNewLimitOrders()
	if err != nil {
		log.Printf("Matching engine error: failed to fetch new limit orders: %v", err)
		return
	}

	for _, order := range orders {
		marketData, err := s.marketDataRepo.FindByInstrumentID(order.InstrumentID.Hex())
		if err != nil || marketData == nil {
			continue
		}

		executionPrice := marketData.LastPrice
		shouldFill := false

		if order.Side == "BUY" {
			// BUY LIMIT: Fill if market price <= limit price
			if executionPrice <= *order.Price {
				shouldFill = true
			}
		} else if order.Side == "SELL" {
			// SELL LIMIT: Fill if market price >= limit price
			if executionPrice >= *order.Price {
				shouldFill = true
			}
		}

		if shouldFill {
			// Use the limit price for execution in a simple matching engine (no slippage)
			// or use executionPrice if it's better than limit price?
			// Standard behavior: limit price or better. For simplicity, use limit price.
			fillPrice := *order.Price

			trade, err := s.createTrade(order, fillPrice)
			if err != nil {
				log.Printf("Matching engine error: failed to create trade for %s: %v", order.OrderID, err)
				continue
			}

			order.Status = "FILLED"
			order.FilledQuantity = order.Quantity
			order.AvgFillPrice = fillPrice
			now := time.Now()
			order.FilledAt = &now

			_, err = s.orderRepo.Update(order)
			if err != nil {
				log.Printf("Matching engine error: failed to update order %s to FILLED: %v", order.OrderID, err)
			}

			// Update Finance (Settlement)
			settleErr := s.accountService.SettleTrade(order.UserID.Hex(), trade.NetValue, trade.TradeID, trade.Side)
			if settleErr != nil {
				log.Printf("ERROR: Settlement failed for limit trade %s: %v", trade.TradeID, settleErr)
			}

			log.Printf("MATCHED: Limit Order %s FILLED at ₹%.2f (Target: ₹%.2f, Qty: %d)", order.OrderID, fillPrice, *order.Price, order.Quantity)
		}
	}
}

func (s *MatchingService) createTrade(order *models.Order, price float64) (*models.Trade, error) {
	value := float64(order.Quantity) * price

	// Commission: 0.05%
	commission := value * 0.0005
	// Flat fee: ₹10
	flatFee := 10.0

	totalFees := commission + flatFee
	var netValue float64

	if order.Side == "BUY" {
		netValue = value + totalFees
	} else {
		netValue = value - totalFees
	}

	trade := &models.Trade{
		TradeID:      fmt.Sprintf("%s-T-%d", order.OrderID, time.Now().Unix()%10000),
		OrderID:      order.ID,
		UserID:       order.UserID,
		AccountID:    order.AccountID,
		InstrumentID: order.InstrumentID,
		Symbol:       order.Symbol,
		Side:         order.Side,
		Quantity:     order.Quantity,
		Price:        price,
		Value:        value,
		Commission:   commission,
		Fees:         flatFee,
		NetValue:     netValue,
		ExecutedAt:   time.Now(),
	}

	return s.tradeRepo.Create(trade)
}
