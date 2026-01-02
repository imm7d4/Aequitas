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

	// Initialize services
	tradingAccountService := services.NewTradingAccountService(tradingAccountRepo)
	authService := services.NewAuthService(userRepo, tradingAccountService, cfg)

	// Initialize controllers
	authController := controllers.NewAuthController(authService)

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
