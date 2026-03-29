package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"aequitas/internal/config"
	"aequitas/internal/controllers"
	"aequitas/internal/middleware"
	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"aequitas/internal/services"
	"aequitas/internal/websocket"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize configuration
	cfg := config.New()

	// Verify JWT secret is configured
	if cfg.JWTSecret == "" {
		log.Fatal("JWT_SECRET environment variable is not set. Please check your .env file.")
	}
	log.Println("Configuration loaded successfully")

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(context.Background())

	// Verify connection
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}
	log.Println("Connected to MongoDB successfully")

	db := client.Database("aequitas")

	// Initialize repositories
	userRepo := repositories.NewUserRepository(db)
	tradingAccountRepo := repositories.NewTradingAccountRepository(db)
	instrumentRepo := repositories.NewInstrumentRepository(db)
	marketRepo := repositories.NewMarketRepository(db)
	watchlistRepo := repositories.NewWatchlistRepository(db)
	marketDataRepo := repositories.NewMarketDataRepository(db)
	telemetryRepo := repositories.NewTelemetryRepository(db)
	transactionRepo := repositories.NewTransactionRepository(db)
	orderRepo := repositories.NewOrderRepository(db)
	candleRepo := repositories.NewCandleRepository(db)
	tradeRepo := repositories.NewTradeRepository(db)
	portfolioRepo := repositories.NewPortfolioRepository(db)
	notificationRepo := repositories.NewNotificationRepository(db)
	tradeResultRepo := repositories.NewTradeResultRepository(db)
	activeUnitRepo := repositories.NewActiveTradeUnitRepository(db)
	otpRepo := repositories.NewOTPRepository(db)
	adminConfigRepo := repositories.NewAdminConfigRepository(db)
	jitRepo := repositories.NewJITRepository(db)
	auditLogRepo := repositories.NewAuditLogRepository(db)
	priceAlertRepo := repositories.NewPriceAlertRepository(db)
	supportTicketRepo := repositories.NewSupportTicketRepository(db)

	// Initialize basic services
	otpService := services.NewOTPService(otpRepo)
	auditService := services.NewAuditService(auditLogRepo)
	jitService := services.NewJITService(jitRepo, auditService)
	commProvider := services.NewBrevoProvider(cfg)

	// Initialize services (Basic)
	tradingAccountService := services.NewTradingAccountService(tradingAccountRepo, transactionRepo, userRepo, otpService, jitService, auditService, commProvider)
	authService := services.NewAuthService(userRepo, tradingAccountService, otpService, auditService, commProvider, cfg)
	instrumentService := services.NewInstrumentService(instrumentRepo)
	marketService := services.NewMarketService(marketRepo, marketDataRepo, adminConfigRepo)
	watchlistService := services.NewWatchlistService(watchlistRepo, instrumentRepo)
	telemetryService := services.NewTelemetryService(telemetryRepo, auditService)
	userService := services.NewUserService(userRepo, otpService, commProvider)
	analyticsService := services.NewAnalyticsService(tradeResultRepo, activeUnitRepo, candleRepo)
	portfolioService := services.NewPortfolioService(portfolioRepo, marketService, tradingAccountService, analyticsService)
	candleService := services.NewCandleService(candleRepo)
	candleBuilder := services.NewCandleBuilder(candleRepo)
	tradeService := services.NewTradeService(tradeRepo)
	dashboardService := services.NewDashboardService(portfolioRepo, tradeRepo, tradingAccountService, marketService, marketDataRepo, instrumentRepo)
	adminService := services.NewAdminService(db, adminConfigRepo, userRepo, tradeRepo, telemetryRepo, tradingAccountRepo, jitService, auditService)

	// Initialize WebSocket hub BEFORE NotificationService
	wsHub := websocket.NewHub()
	go wsHub.Run()
	wsHandler := websocket.NewHandler(wsHub, cfg.JWTSecret)

	notificationService := services.NewNotificationService(notificationRepo, wsHub)
	priceAlertService := services.NewPriceAlertService(priceAlertRepo, notificationService)
	supportService := services.NewSupportService(supportTicketRepo, userRepo, auditService, notificationService)

	// Initialize Complex Services (Dependent on NotificationService)
	matchingService := services.NewMatchingService(cfg, orderRepo, tradeRepo, marketDataRepo, tradingAccountService, portfolioService, notificationService, auditService)
	orderService := services.NewOrderService(orderRepo, instrumentRepo, tradingAccountRepo, marketDataRepo, matchingService, portfolioService, notificationService, auditService)

	// Configure candle builder to broadcast to WS hub
	candleBuilder.SetBroadcastFunc(func(instrumentID string, candle *models.Candle) {
		wsHub.BroadcastToInstrument(instrumentID, candle)
	})

	// Initialize pricing engine
	pricingService := services.NewPricingService(instrumentRepo, marketDataRepo, candleRepo, candleBuilder, priceAlertService)
	pricingService.Start()
	defer pricingService.Stop()

	// Admin Metrics Broadcast Ticker (SLA: <= 5s)
	go func() {
		ticker := time.NewTicker(5 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			metrics, err := adminService.GetPlatformMetrics(context.Background())
			if err == nil {
				wsHub.BroadcastToAdmins(metrics)
			}
		}
	}()

	// Initialize candle cleanup service (runs every hour)
	candleCleanupService := services.NewCandleCleanupService(candleRepo)
	candleCleanupService.Start()
	defer candleCleanupService.Stop()

	// Initialize stop order monitoring service (runs every 3 seconds)
	stopOrderService := services.NewStopOrderService(orderRepo, marketDataRepo, orderService)
	stopOrderService.Start()
	defer stopOrderService.Stop()

	// Initialize notification cleanup service (runs every 5 minutes)
	notificationCleanupService := services.NewNotificationCleanupService(notificationRepo)
	notificationCleanupService.Start()
	defer notificationCleanupService.Stop()

	// Initialize margin monitor service (runs every 3 minutes)
	marginMonitorService := services.NewMarginMonitorService(tradingAccountRepo, portfolioService, notificationService)
	marginMonitorService.Start()
	defer marginMonitorService.Stop()

	// Initialize matching engine service (runs every 3 seconds)
	matchingService.Start()
	defer matchingService.Stop()

	// Initialize controllers
	authController := controllers.NewAuthController(authService)
	instrumentController := controllers.NewInstrumentController(instrumentService)
	marketController := controllers.NewMarketController(marketService)
	watchlistController := controllers.NewWatchlistController(watchlistService)
	telemetryController := controllers.NewTelemetryController(telemetryService)
	userController := controllers.NewUserController(userService)
	accountController := controllers.NewAccountController(tradingAccountService)
	adminController := controllers.NewAdminController(adminService, tradingAccountService)
	jitController := controllers.NewJITController(jitService)
	orderController := controllers.NewOrderController(orderService)
	candleController := controllers.NewCandleController(candleService)
	tradeController := controllers.NewTradeController(tradeService)
	portfolioController := controllers.NewPortfolioController(portfolioService)
	notificationController := controllers.NewNotificationController(notificationService)
	priceAlertController := controllers.NewPriceAlertController(priceAlertService)
	dashboardController := controllers.NewDashboardController(dashboardService)
	analyticsController := controllers.NewAnalyticsController(analyticsService)
	auditController := controllers.NewAuditController(auditService)
	supportController := controllers.NewSupportController(supportService)
	
	abacMiddleware := middleware.NewABACMiddleware(jitService)

	// Set up router
	router := mux.NewRouter()

	// Apply CORS first to handle all requests including subrouters
	router.Use(middleware.CORS(cfg.AllowedOrigins))
	router.Use(middleware.Logger)
	router.Use(middleware.ErrorHandler)

	// Register routes
	api := router.PathPrefix("/api").Subrouter()

	// WebSocket endpoint (no /api prefix)
	router.HandleFunc("/ws", wsHandler.HandleWebSocket)

	// Auth routes (public)
	api.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	}).Methods("GET", "OPTIONS")

	api.HandleFunc("/auth/register", authController.Register).Methods("POST", "OPTIONS")
	api.HandleFunc("/auth/register/complete", authController.CompleteRegistration).Methods("POST", "OPTIONS")
	api.HandleFunc("/auth/login", authController.Login).Methods("POST", "OPTIONS")
	api.HandleFunc("/auth/forgot-password", authController.ForgotPassword).Methods("POST", "OPTIONS")
	api.HandleFunc("/auth/reset-password", authController.ResetPassword).Methods("POST", "OPTIONS")
	api.HandleFunc("/auth/step-up", authController.StepUp).Methods("POST", "OPTIONS")

	// Protected routes (require authentication)
	protected := api.PathPrefix("").Subrouter()
	protected.Use(middleware.Auth(cfg, userRepo, adminConfigRepo))

	// Admin routes (require Admin roles + additional ABAC for sensitive actions)
	adminRouter := protected.PathPrefix("/admin").Subrouter()
	adminRouter.Use(middleware.RoleMiddleware(
		models.RolePlatformAdmin, 
		models.RoleRiskOfficer, 
		models.RoleSupport,
	))
	
	// Direct Admin Actions (No JIT required)
	adminRouter.HandleFunc("/users/{id}/status", adminController.UpdateUserStatus).Methods("PUT", "OPTIONS")
	
	// Sensitive Actions (JIT Required)
	adminRouter.Handle("/wallet/adjust", abacMiddleware.Authorize("WALLET_ADJUSTMENT", true)(http.HandlerFunc(adminController.AdjustWallet))).Methods("POST", "OPTIONS")
	adminRouter.Handle("/config", abacMiddleware.Authorize("CONFIG_UPDATE", true)(middleware.StepUpMiddleware(cfg)(http.HandlerFunc(adminController.UpdateConfig)))).Methods("PUT", "OPTIONS")
	
	// General Admin Actions
	adminRouter.HandleFunc("/users", adminController.GetUsers).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/users", adminController.CreateUser).Methods("POST", "OPTIONS")
	adminRouter.HandleFunc("/wallets", adminController.GetWallets).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/wallet/history", adminController.GetWalletHistory).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/config", adminController.GetConfig).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/metrics", adminController.GetPlatformMetrics).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/audit/logs", auditController.GetLogs).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/audit/justify", adminController.LogJustification).Methods("POST", "OPTIONS")
	
	adminRouter.HandleFunc("/jit/request", jitController.RequestAccess).Methods("POST", "OPTIONS")
	adminRouter.HandleFunc("/jit/approvals", jitController.GetPendingRequests).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/jit/approve", jitController.ApproveRequest).Methods("POST", "OPTIONS")
	adminRouter.HandleFunc("/jit/reject", jitController.RejectRequest).Methods("POST", "OPTIONS")

	// Instrument Management
	adminRouter.HandleFunc("/instruments", instrumentController.CreateInstrument).Methods("POST", "OPTIONS")
	adminRouter.Handle("/instruments/{id}", middleware.StepUpMiddleware(cfg)(http.HandlerFunc(instrumentController.UpdateInstrument))).Methods("PUT", "OPTIONS")

	// Market Hours & Holidays
	adminRouter.HandleFunc("/market/hours", marketController.CreateMarketHours).Methods("POST", "OPTIONS")
	adminRouter.HandleFunc("/market/hours/{exchange}", marketController.GetWeeklyHours).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/market/hours/{exchange}/bulk", marketController.UpdateWeeklyHours).Methods("PUT", "OPTIONS")
	adminRouter.HandleFunc("/market/holidays", marketController.CreateHoliday).Methods("POST", "OPTIONS")
	adminRouter.HandleFunc("/market/holidays", marketController.GetHolidays).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/market/holidays/{exchange}", marketController.GetHolidays).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/market/holidays/{id}", marketController.DeleteHoliday).Methods("DELETE", "OPTIONS")

	// Support Ticketing (Admin Inbox)
	adminRouter.HandleFunc("/tickets", supportController.GetTickets).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/tickets/{id}", supportController.GetTicketByID).Methods("GET", "OPTIONS")
	adminRouter.HandleFunc("/tickets/{id}/status", supportController.UpdateStatus).Methods("PUT", "OPTIONS")
	adminRouter.HandleFunc("/tickets/{id}/comments", supportController.AddComment).Methods("POST", "OPTIONS")
	
	// Public Protected Routes
	protected.HandleFunc("/auth/logout", authController.Logout).Methods("POST", "OPTIONS")
	protected.HandleFunc("/tickets", supportController.CreateTicket).Methods("POST", "OPTIONS")
	protected.HandleFunc("/tickets/my", supportController.GetMyTickets).Methods("GET", "OPTIONS")
	protected.HandleFunc("/tickets/{id}", supportController.GetTicketByID).Methods("GET", "OPTIONS")
	protected.HandleFunc("/tickets/{id}/comments", supportController.AddComment).Methods("POST", "OPTIONS")

	// Instrument routes (public read, admin write)
	protected.HandleFunc("/instruments", instrumentController.GetInstruments).Methods("GET", "OPTIONS")
	protected.HandleFunc("/instruments/search", instrumentController.SearchInstruments).Methods("GET", "OPTIONS")
	protected.HandleFunc("/instruments/{id}", instrumentController.GetInstrumentByID).Methods("GET", "OPTIONS")

	// Market routes (public)
	protected.HandleFunc("/market/status/{exchange}", marketController.GetMarketStatus).Methods("GET", "OPTIONS")
	protected.HandleFunc("/market/prices", marketController.GetBatchPrices).Methods("GET", "OPTIONS")
	protected.HandleFunc("/market/candles/{id}", candleController.GetHistoricalCandles).Methods("GET", "OPTIONS")

	// Watchlist routes
	protected.HandleFunc("/watchlists", watchlistController.GetUserWatchlists).Methods("GET", "OPTIONS")
	protected.HandleFunc("/watchlists", watchlistController.CreateWatchlist).Methods("POST", "OPTIONS")
	protected.HandleFunc("/watchlists/{id}", watchlistController.RenameWatchlist).Methods("PUT", "OPTIONS")
	protected.HandleFunc("/watchlists/{id}", watchlistController.DeleteWatchlist).Methods("DELETE", "OPTIONS")
	protected.HandleFunc("/watchlists/{id}/default", watchlistController.SetDefaultWatchlist).Methods("POST", "OPTIONS")
	protected.HandleFunc("/watchlists/{id}/instruments/{instrumentId}", watchlistController.AddToWatchlist).Methods("POST", "OPTIONS")
	protected.HandleFunc("/watchlists/{id}/instruments/{instrumentId}", watchlistController.RemoveFromWatchlist).Methods("DELETE", "OPTIONS")

	// Telemetry routes
	protected.HandleFunc("/telemetry", telemetryController.IngestTelemetry).Methods("POST", "OPTIONS")

	// User Profile routes
	protected.HandleFunc("/user/profile", userController.GetProfile).Methods("GET", "OPTIONS")
	protected.HandleFunc("/user/profile", userController.UpdateProfile).Methods("PUT", "OPTIONS")
	protected.HandleFunc("/user/password", userController.UpdatePassword).Methods("PUT", "OPTIONS")
	protected.HandleFunc("/user/preferences", userController.UpdatePreferences).Methods("PUT", "OPTIONS")
	protected.HandleFunc("/user/email/initiate", userController.InitiateEmailUpdate).Methods("POST", "OPTIONS")
	protected.HandleFunc("/user/email/complete", userController.CompleteEmailUpdate).Methods("POST", "OPTIONS")
	protected.HandleFunc("/user/onboarding-status", userController.UpdateOnboardingStatus).Methods("PATCH", "OPTIONS")

	// Account routes
	protected.HandleFunc("/account/balance", accountController.GetBalance).Methods("GET", "OPTIONS")
	protected.HandleFunc("/account/fund", accountController.FundAccount).Methods("POST", "OPTIONS")
	protected.HandleFunc("/account/deposit/initiate", accountController.InitiateDeposit).Methods("POST", "OPTIONS")
	protected.HandleFunc("/account/deposit/complete", accountController.CompleteDeposit).Methods("POST", "OPTIONS")
	protected.HandleFunc("/account/transactions", accountController.GetTransactions).Methods("GET", "OPTIONS")

	// Order routes
	protected.HandleFunc("/orders", orderController.PlaceOrder).Methods("POST", "OPTIONS")
	protected.HandleFunc("/orders", orderController.GetOrders).Methods("GET", "OPTIONS")
	protected.HandleFunc("/orders/pending-stops", orderController.GetPendingStops).Methods("GET", "OPTIONS")
	protected.HandleFunc("/orders/{id}", orderController.ModifyOrder).Methods("PUT", "OPTIONS")
	protected.HandleFunc("/orders/{id}", orderController.CancelOrder).Methods("DELETE", "OPTIONS")

	// Trade routes
	protected.HandleFunc("/trades", tradeController.GetUserTrades).Methods("GET", "OPTIONS")
	protected.HandleFunc("/trades/order/{orderId}", tradeController.GetTradesByOrder).Methods("GET", "OPTIONS")

	// Portfolio routes
	protected.HandleFunc("/portfolio/holdings", portfolioController.GetHoldings).Methods("GET", "OPTIONS")
	protected.HandleFunc("/portfolio/summary", portfolioController.GetSummary).Methods("GET", "OPTIONS")
	protected.HandleFunc("/portfolio/snapshot", portfolioController.CaptureSnapshot).Methods("POST", "OPTIONS")
	protected.HandleFunc("/portfolio/history", portfolioController.GetHistory).Methods("GET", "OPTIONS")

	// Analytics/Diagnostics routes
	protected.HandleFunc("/diagnostics", analyticsController.GetDiagnostics).Methods("GET", "OPTIONS")

	// Notification routes
	protected.HandleFunc("/notifications", notificationController.GetHistory).Methods("GET", "OPTIONS")
	protected.HandleFunc("/notifications", notificationController.ClearAll).Methods("DELETE", "OPTIONS")
	protected.HandleFunc("/notifications/read-all", notificationController.MarkAllRead).Methods("PUT", "OPTIONS")
	protected.HandleFunc("/notifications/{id}/read", notificationController.MarkRead).Methods("PUT", "OPTIONS")

	// Price Alert routes
	protected.HandleFunc("/alerts", priceAlertController.GetAlerts).Methods("GET", "OPTIONS")
	protected.HandleFunc("/alerts", priceAlertController.CreateAlert).Methods("POST", "OPTIONS")
	protected.HandleFunc("/alerts/{id}", priceAlertController.CancelAlert).Methods("DELETE", "OPTIONS")

	// Dashboard routes
	protected.HandleFunc("/dashboard/summary", dashboardController.GetSummary).Methods("GET", "OPTIONS")

	// Documentation routes (public - no auth required)

	// Logout
	protected.HandleFunc("/auth/logout", authController.Logout).Methods("POST", "OPTIONS")

	// Price Alert routes
	protected.HandleFunc("/alerts", priceAlertController.GetAlerts).Methods("GET", "OPTIONS")
	protected.HandleFunc("/alerts", priceAlertController.CreateAlert).Methods("POST", "OPTIONS")
	protected.HandleFunc("/alerts/{id}", priceAlertController.CancelAlert).Methods("DELETE", "OPTIONS")

	// Dashboard routes
	protected.HandleFunc("/dashboard/summary", dashboardController.GetSummary).Methods("GET", "OPTIONS")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, router); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
