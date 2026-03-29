package services

import (
	"context"
	"fmt"
	"log"
	"time"

	"aequitas/internal/config"
	"aequitas/internal/models"
	"aequitas/internal/repositories"

	"go.mongodb.org/mongo-driver/mongo"
)

type MatchingService struct {
	config              *config.Config
	orderRepo           *repositories.OrderRepository
	tradeRepo           *repositories.TradeRepository
	marketDataRepo      *repositories.MarketDataRepository
	accountService      *TradingAccountService
	portfolioService    *PortfolioService
	notificationService *NotificationService
	auditService        *AuditService
	stopChan            chan struct{}
}

func NewMatchingService(
	cfg *config.Config,
	orderRepo *repositories.OrderRepository,
	tradeRepo *repositories.TradeRepository,
	marketDataRepo *repositories.MarketDataRepository,
	accountService *TradingAccountService,
	portfolioService *PortfolioService,
	notificationService *NotificationService,
	auditService *AuditService,
) *MatchingService {
	return &MatchingService{
		config:              cfg,
		orderRepo:           orderRepo,
		tradeRepo:           tradeRepo,
		marketDataRepo:      marketDataRepo,
		accountService:      accountService,
		portfolioService:    portfolioService,
		notificationService: notificationService,
		auditService:        auditService,
		stopChan:            make(chan struct{}),
	}
}

func (s *MatchingService) Start() {
	ticker := time.NewTicker(3 * time.Second)
	go func() {
		for {
			select {
			case <-ticker.C:
				s.MatchLimitOrders(context.Background())
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
func (s *MatchingService) ExecuteMarketOrder(ctx context.Context, order *models.Order) (*models.Trade, error) {
	// 1. Get current market price
	marketData, err := s.marketDataRepo.FindByInstrumentID(order.InstrumentID.Hex())
	if err != nil || marketData == nil {
		return nil, fmt.Errorf("matching engine: market data unavailable for %s", order.Symbol)
	}

	executionPrice := marketData.LastPrice

	// Start a session for the transaction
	session, err := s.orderRepo.GetDatabase().Client().StartSession()
	if err != nil {
		return nil, err
	}
	defer session.EndSession(ctx)

	var trade *models.Trade
	_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
		// 2. Create trade record
		t, err := s.createTrade(sessCtx, order, executionPrice)
		if err != nil {
			return nil, err
		}
		trade = t

		// 3. Update order status
		order.Status = "FILLED"
		order.FilledQuantity = order.Quantity
		order.AvgFillPrice = executionPrice
		now := time.Now()
		order.FilledAt = &now

		_, err = s.orderRepo.Update(sessCtx, order)
		if err != nil {
			return nil, err
		}

		// 4. Update Finance (Settlement)
		err = s.accountService.SettleTrade(sessCtx, order.UserID.Hex(), trade.NetValue, trade.TradeID, trade.Side)
		if err != nil {
			return nil, err
		}

		// 5. Update Portfolio (Holdings)
		err = s.portfolioService.UpdatePosition(sessCtx, trade)
		if err != nil {
			return nil, err
		}

		return nil, nil
	})

	if err != nil {
		log.Printf("ERROR: Market Order %s failed within transaction: %v", order.OrderID, err)
		return nil, err
	}

	// 6. Audit Log
	s.auditService.Log(order.UserID.Hex(), "System", "SYSTEM", "ORDER_FILLED",
		order.ID.Hex(), "ORDER",
		fmt.Sprintf("FILL %d %s @ ₹%.2f (Market)", order.Quantity, order.Symbol, executionPrice),
		nil, order)

	// 7. Send Notification (outside transaction)
	go func() {
		_ = s.notificationService.SendNotification(
			context.Background(),
			order.UserID.Hex(),
			models.NotificationTypeOrder,
			"Order Filled",
			fmt.Sprintf("Your MARKET %s order for %d %s was filled at ₹%.2f", order.Side, order.Quantity, order.Symbol, executionPrice),
			map[string]interface{}{"orderId": order.ID.Hex(), "symbol": order.Symbol},
			nil,
		)
	}()

	log.Printf("MATCHED: Market Order %s FILLED at ₹%.2f (Qty: %d)", order.OrderID, executionPrice, order.Quantity)
	return trade, nil
}

// MatchLimitOrders scans for NEW limit orders and matches them against current LTP
func (s *MatchingService) MatchLimitOrders(ctx context.Context) {
	// Use the generic FindByUserID or a specialized query in repo if needed
	// For now, let's use a specialized query if it exists, otherwise we filter NEW orders

	// We'll need a way to find all NEW LIMIT orders across all users
	// Updating repository to support this
	orders, err := s.orderRepo.FindNewLimitOrders(ctx)
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
			// CRITICAL FIX: Always fill at the best available price (Market Price), not the Limit Price.
			// A Limit Order guarantees "Limit Price or Better".
			// If I Buy @ 1058 but Market is 1055, I should pay 1055.
			fillPrice := executionPrice

			// Start session for atomic match
			session, err := s.orderRepo.GetDatabase().Client().StartSession()
			if err != nil {
				log.Printf("Error: matching engine failed to start session: %v", err)
				continue
			}

			_, err = session.WithTransaction(ctx, func(sessCtx mongo.SessionContext) (interface{}, error) {
				trade, err := s.createTrade(sessCtx, order, fillPrice)
				if err != nil {
					return nil, err
				}

				order.Status = "FILLED"
				order.FilledQuantity = order.Quantity
				order.AvgFillPrice = fillPrice
				now := time.Now()
				order.FilledAt = &now

				_, err = s.orderRepo.Update(sessCtx, order)
				if err != nil {
					return nil, err
				}

				// Update Finance (Settlement)
				settleErr := s.accountService.SettleTrade(sessCtx, order.UserID.Hex(), trade.NetValue, trade.TradeID, trade.Side)
				if settleErr != nil {
					return nil, settleErr
				}

				// Update Portfolio (Holdings)
				portfolioErr := s.portfolioService.UpdatePosition(sessCtx, trade)
				if portfolioErr != nil {
					return nil, portfolioErr
				}

				// All good
				return nil, nil
			})

			session.EndSession(ctx)

			if err != nil {
				log.Printf("ERROR: Limit Order %s failed within transaction: %v", order.OrderID, err)
				continue
			}

			// 6. Audit Log
			s.auditService.Log(order.UserID.Hex(), "System", "SYSTEM", "ORDER_FILLED",
				order.ID.Hex(), "ORDER",
				fmt.Sprintf("FILL %d %s @ ₹%.2f (Limit)", order.Quantity, order.Symbol, fillPrice),
				nil, order)

			// 7. Send Notification (outside transaction)
			orderToNotify := order // Capture for goroutine
			go func() {
				_ = s.notificationService.SendNotification(
					context.Background(),
					orderToNotify.UserID.Hex(),
					models.NotificationTypeOrder,
					"Order Filled",
					fmt.Sprintf("Your LIMIT %s order for %d %s was filled at ₹%.2f", orderToNotify.Side, orderToNotify.Quantity, orderToNotify.Symbol, fillPrice),
					map[string]interface{}{"orderId": orderToNotify.ID.Hex(), "symbol": orderToNotify.Symbol},
					nil,
				)
			}()

			log.Printf("MATCHED: Limit Order %s FILLED at ₹%.2f (Target: ₹%.2f, Qty: %d)", order.OrderID, fillPrice, *order.Price, order.Quantity)
		} else {
			// Order NOT matched in this cycle
			if order.Validity == "IOC" {
				// IOC orders must be cancelled immediately if not filled
				log.Printf("IOC Order %s not filled immediately, CANCELLING", order.OrderID)

				order.Status = "CANCELLED"
				_, _ = s.orderRepo.Update(ctx, order)

				// Send Cancellation Notification
				orderToCancel := order // Capture for goroutine
				go func() {
					_ = s.notificationService.SendNotification(
						context.Background(),
						orderToCancel.UserID.Hex(),
						models.NotificationTypeOrder,
						"IOC Order Cancelled",
						fmt.Sprintf("Your IOC %s order for %d %s was cancelled because it could not be filled immediately.", orderToCancel.Side, orderToCancel.Quantity, orderToCancel.Symbol),
						map[string]interface{}{"orderId": orderToCancel.ID.Hex(), "symbol": orderToCancel.Symbol},
						nil,
					)
				}()
			}
		}
	}
}

func (s *MatchingService) createTrade(ctx context.Context, order *models.Order, price float64) (*models.Trade, error) {
	value := float64(order.Quantity) * price

	// Commission: 0.05%
	// Calculate commission: Min(TradeValue * Rate, MaxCap)
	rawCommission := value * s.config.CommissionRate
	commission := rawCommission
	if s.config.MaxCommission > 0 && commission > s.config.MaxCommission {
		commission = s.config.MaxCommission
	}

	// Flat fee from config (if any, default 0)
	flatFee := s.config.FlatFee

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
		Intent:       order.Intent,
		Quantity:     order.Quantity,
		Price:        price,
		Value:        value,
		Commission:   commission,
		Fees:         flatFee,
		NetValue:     netValue,
		ExecutedAt:   time.Now(),
	}

	return s.tradeRepo.Create(ctx, trade)
}
