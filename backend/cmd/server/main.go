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
	"aequitas/internal/repositories"
	"aequitas/internal/services"
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

	// Initialize services
	tradingAccountService := services.NewTradingAccountService(tradingAccountRepo, transactionRepo)
	authService := services.NewAuthService(userRepo, tradingAccountService, cfg)
	instrumentService := services.NewInstrumentService(instrumentRepo)
	marketService := services.NewMarketService(marketRepo, marketDataRepo)
	watchlistService := services.NewWatchlistService(watchlistRepo, instrumentRepo)
	telemetryService := services.NewTelemetryService(telemetryRepo)
	userService := services.NewUserService(userRepo)
	orderService := services.NewOrderService(orderRepo, instrumentRepo, tradingAccountRepo, marketDataRepo)

	// Initialize pricing engine
	pricingService := services.NewPricingService(instrumentRepo, marketDataRepo)
	pricingService.Start()
	defer pricingService.Stop()

	// Initialize controllers
	authController := controllers.NewAuthController(authService)
	instrumentController := controllers.NewInstrumentController(instrumentService)
	marketController := controllers.NewMarketController(marketService)
	watchlistController := controllers.NewWatchlistController(watchlistService)
	telemetryController := controllers.NewTelemetryController(telemetryService)
	userController := controllers.NewUserController(userService)
	accountController := controllers.NewAccountController(tradingAccountService)
	orderController := controllers.NewOrderController(orderService)

	// Set up router
	router := mux.NewRouter()

	// Apply CORS first to handle all requests including subrouters
	router.Use(middleware.CORS)
	router.Use(middleware.Logger)
	router.Use(middleware.ErrorHandler)

	// Register routes
	api := router.PathPrefix("/api").Subrouter()

	// Auth routes (public)
	api.HandleFunc("/auth/register", authController.Register).Methods("POST", "OPTIONS")
	api.HandleFunc("/auth/login", authController.Login).Methods("POST", "OPTIONS")

	// Protected routes (require authentication)
	protected := api.PathPrefix("").Subrouter()
	protected.Use(middleware.Auth(cfg))

	// Instrument routes (public read, admin write)
	protected.HandleFunc("/instruments", instrumentController.GetInstruments).Methods("GET", "OPTIONS")
	protected.HandleFunc("/instruments/search", instrumentController.SearchInstruments).Methods("GET", "OPTIONS")
	protected.HandleFunc("/instruments/{id}", instrumentController.GetInstrumentByID).Methods("GET", "OPTIONS")

	// Market routes (public)
	protected.HandleFunc("/market/status/{exchange}", marketController.GetMarketStatus).Methods("GET", "OPTIONS")
	protected.HandleFunc("/market/prices", marketController.GetBatchPrices).Methods("GET", "OPTIONS")

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

	// Account routes
	protected.HandleFunc("/account/balance", accountController.GetBalance).Methods("GET", "OPTIONS")
	protected.HandleFunc("/account/fund", accountController.FundAccount).Methods("POST", "OPTIONS")
	protected.HandleFunc("/account/transactions", accountController.GetTransactions).Methods("GET", "OPTIONS")

	// Order routes
	protected.HandleFunc("/orders", orderController.PlaceOrder).Methods("POST", "OPTIONS")

	// Admin routes (require admin role)
	admin := protected.PathPrefix("/admin").Subrouter()
	admin.Use(middleware.AdminMiddleware)

	// Admin instrument routes
	admin.HandleFunc("/instruments", instrumentController.CreateInstrument).Methods("POST", "OPTIONS")
	admin.HandleFunc("/instruments/{id}", instrumentController.UpdateInstrument).Methods("PUT", "OPTIONS")

	// Admin market routes
	admin.HandleFunc("/market/hours", marketController.CreateMarketHours).Methods("POST", "OPTIONS")
	admin.HandleFunc("/market/holidays", marketController.CreateHoliday).Methods("POST", "OPTIONS")
	admin.HandleFunc("/market/holidays", marketController.GetHolidays).Methods("GET", "OPTIONS")
	admin.HandleFunc("/market/holidays/{exchange}", marketController.GetHolidays).Methods("GET", "OPTIONS")
	admin.HandleFunc("/market/holidays/{id}", marketController.DeleteHoliday).Methods("DELETE", "OPTIONS")

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
