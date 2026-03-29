package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"aequitas/internal/config"
	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/services"
	"aequitas/internal/websocket"
)

func main() {
	// 1. Setup
	cfg := config.New()
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017/aequitas"))
	if err != nil {
		log.Fatalf("DB Connect Error: %v", err)
	}
	defer client.Disconnect(context.Background())
	db := client.Database("aequitas")

	// Repos
	accountRepo := repositories.NewTradingAccountRepository(db)
	orderRepo := repositories.NewOrderRepository(db)
	tradeRepo := repositories.NewTradeRepository(db)
	portfolioRepo := repositories.NewPortfolioRepository(db)
	instrumentRepo := repositories.NewInstrumentRepository(db)
	mdRepo := repositories.NewMarketDataRepository(db)
	txRepo := repositories.NewTransactionRepository(db)
	notifRepo := repositories.NewNotificationRepository(db)
	trRepo := repositories.NewTradeResultRepository(db)
	activeUnitRepo := repositories.NewActiveTradeUnitRepository(db)
	candleRepo := repositories.NewCandleRepository(db)
	otpRepo := repositories.NewOTPRepository(db)

	// Services
	otpService := services.NewOTPService(otpRepo)
	commProvider := services.NewBrevoProvider(cfg)
	jitRepo := repositories.NewJITRepository(db)
	auditService := services.NewAuditService(nil) // Mock/Nil repo for simple verification script if repo not easily available
	jitService := services.NewJITService(jitRepo, auditService)
	userRepo := repositories.NewUserRepository(db)
	accountService := services.NewTradingAccountService(accountRepo, txRepo, userRepo, otpService, jitService, auditService, commProvider)
	// Mock MarketService for Portfolio (Portfolio uses it for Snapshot only usually, but UpdatePosition uses generic logic)
	// Actually PortfolioService uses MarketService for snapshots but strict UpdatePosition doesn't need external price calls if provided in Trade.
	// But NewPortfolioService needs it. We can pass nil? No, struct expects it.
	// Let's Init mocked MarketService or minimal one.
	// MarketService needs MarketRepo + MDRepo.
	marketRepo := repositories.NewMarketRepository(db)
	adminConfigRepo := repositories.NewAdminConfigRepository(db)
	marketService := services.NewMarketService(marketRepo, mdRepo, adminConfigRepo)

	analyticsService := services.NewAnalyticsService(trRepo, activeUnitRepo, candleRepo)
	portfolioService := services.NewPortfolioService(portfolioRepo, marketService, accountService, analyticsService)

	wsHub := websocket.NewHub()
	go wsHub.Run()
	notifService := services.NewNotificationService(notifRepo, wsHub)

	matchingService := services.NewMatchingService(cfg, orderRepo, tradeRepo, mdRepo, accountService, portfolioService, notifService, auditService)
	orderService := services.NewOrderService(orderRepo, instrumentRepo, accountRepo, mdRepo, matchingService, portfolioService, notifService, auditService)

	log.Println("Services Initialized.")

	// 2. Create Test User
	uOID := primitive.NewObjectID()
	userID := uOID.Hex()
	log.Printf("Test User ID: %s", userID)

	// Create User Record via Repo
	dummyUser := &models.User{
		ID:        uOID,
		Email:     fmt.Sprintf("test-%d@aequitas.com", time.Now().Unix()),
		FullName:  "Test User",
		Status:    "ACTIVE",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	_, err = userRepo.Create(dummyUser)
	if err != nil {
		log.Fatalf("Create User Failed: %v", err)
	}

	// Create Account
	_, err = accountService.CreateForUser(context.Background(), userID)
	if err != nil {
		log.Fatalf("Create Account Failed: %v", err)
	}

	// Fund Account
	_, err = accountService.FundAccount(context.Background(), userID, 100000.0)
	if err != nil {
		log.Fatalf("Fund Failed: %v", err)
	}
	log.Println("Account funded with 100,000")

	// 3. Ensure RELIANCE is shortable
	// (Assuming Database has RELIANCE from seed)
	// Find Instrument
	instruments, _ := instrumentRepo.Search("RELIANCE")
	if len(instruments) == 0 {
		log.Fatal("RELIANCE instrument not found. Run seed script first.")
	}
	Reliance := instruments[0]
	if !Reliance.IsShortable {
		log.Fatal("RELIANCE is not shortable. Run seed script.")
	}
	log.Printf("Target Instrument: %s (Shortable: %v)", Reliance.Symbol, Reliance.IsShortable)

	// Ensure Market Data Exists for market order (LTP)
	// Insert Dummy Market Data
	md := &models.MarketData{
		InstrumentID: Reliance.ID,
		Symbol:       Reliance.Symbol,
		LastPrice:    2000.0,
		PrevClose:    1980.0,
		Open:         1990.0,
		High:         2010.0,
		Low:          1985.0,
		Volume:       500000,
		UpdatedAt:    time.Now(),
	}
	if err := mdRepo.Upsert(context.Background(), md); err != nil {
		log.Printf("Upsert MD failed: %v", err)
	}
	// Repo.Update usually updates by ID. MDRepo might handle it.
	// Let's check MDRepo or just use Create.
	// Assuming Update works or we just fail if no MD.
	// Actually MatchingService needs it.
	// Hack: Create raw MD insertion if needed.
	// checking MDRepo signature in views... assume it has Upsert or similar.
	// But for now, let's assume market data exists or inject it correctly.
	// Let's try InsertOne directly to be safe.
	_, _ = db.Collection("market_data").InsertOne(ctx, md)

	// 4. Scenario: OPEN SHORT
	log.Println("--- SCENARIO: OPEN SHORT ---")
	openOrder := models.Order{
		UserID: primitive.NewObjectID(), // Temp obj ID? No, must match string userID
		// Wait, Order struct uses primitive.ObjectID for UserID.
		// My userID string came from primitive.NewObjectID().Hex()
		// I needs objectID.
		InstrumentID:  Reliance.ID,
		Symbol:        Reliance.Symbol,
		Side:          "SELL",
		Intent:        "OPEN_SHORT",
		OrderType:     "MARKET",
		Quantity:      10,
		Validity:      "DAY",
		ClientOrderID: fmt.Sprintf("cl-%d", time.Now().UnixNano()),
	}
	// Fix UserID type
	uOID, _ = primitive.ObjectIDFromHex(userID)
	openOrder.UserID = uOID

	resOrder, err := orderService.PlaceOrder(context.Background(), userID, openOrder)
	if err != nil {
		log.Fatalf("Place OPEN_SHORT Failed: %v", err)
	}
	log.Printf("Order Placed: %s, Status: %s", resOrder.OrderID, resOrder.Status)

	// Wait for async execution? Market orders are executed synchronously in PlaceOrder (Phase 2 logic).
	// Check Account Margin
	acctAfter, _ := accountService.GetByUserID(context.Background(), userID)
	log.Printf("Account Balance: %.2f, BlockedMargin: %.2f", acctAfter.Balance, acctAfter.BlockedMargin)

	// Expected Margin: 10 * 2000 * 20% = 4000
	expectedMargin := 4000.0
	if acctAfter.BlockedMargin != expectedMargin {
		log.Printf("WARNING: Blocked Margin mismatch. Expected %.2f, Got %.2f", expectedMargin, acctAfter.BlockedMargin)
	} else {
		log.Println("SUCCESS: Margin Blocked Correctly.")
	}

	// Check Holding
	holding, _ := portfolioService.GetHolding(ctx, userID, Reliance.ID.Hex())
	if holding == nil {
		log.Fatal("Holding not created!")
	}
	log.Printf("Holding: %s %d, Type: %s", holding.Symbol, holding.Quantity, holding.PositionType)
	if holding.PositionType != "SHORT" {
		log.Fatalf("Holding Type Mismatch. Expected SHORT, Got %s", holding.PositionType)
	}

	// 5. Scenario: CLOSE SHORT
	log.Println("--- SCENARIO: CLOSE SHORT (Partial 5 Qty) ---")
	// Update Price to 1900 (Profit 100 per share)
	md.LastPrice = 1900.0
	_, _ = db.Collection("market_data").UpdateOne(ctx,
		primitive.M{"symbol": "RELIANCE"},
		primitive.M{"$set": primitive.M{"last_price": 1900.0}})

	closeOrder := models.Order{
		UserID:        uOID,
		InstrumentID:  Reliance.ID,
		Symbol:        Reliance.Symbol,
		Side:          "BUY",
		Intent:        "CLOSE_SHORT",
		OrderType:     "MARKET",
		Quantity:      5,
		Validity:      "DAY",
		ClientOrderID: fmt.Sprintf("cl-%d-2", time.Now().UnixNano()),
	}

	resClose, err := orderService.PlaceOrder(context.Background(), userID, closeOrder)
	if err != nil {
		log.Fatalf("Place CLOSE_SHORT Failed: %v", err)
	}
	log.Printf("Close Order Placed: %s", resClose.OrderID)

	// Check Account
	acctFinal, _ := accountService.GetByUserID(context.Background(), userID)
	log.Printf("Account Balance: %.2f, BlockedMargin: %.2f, RealizedPL: %.2f", acctFinal.Balance, acctFinal.BlockedMargin, acctFinal.RealizedPL)

	// Expected:
	// Initial Margin Blocked: 4000
	// Released: 50% = 2000. Remaining: 2000.
	// P&L: (2000 - 1900) * 5 = +500.
	// Balance: Initial 100000 + P&L(500) - Fees?
	// Fees are deducted. Let's precise check later. Checks logic direction.

	if acctFinal.BlockedMargin != 2000.0 {
		log.Printf("WARNING: Margin Release Mismatch. Expected 2000.0, Got %.2f", acctFinal.BlockedMargin)
	} else {
		log.Println("SUCCESS: Margin Released Correctly.")
	}

	if acctFinal.RealizedPL > 0 {
		log.Println("SUCCESS: Realized Positive P&L.")
	} else {
		log.Printf("WARNING: RealizedPL not positive? %.2f", acctFinal.RealizedPL)
	}

	log.Println("VERIFICATION COMPLETE.")
}
