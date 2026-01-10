package config

import (
	"encoding/json"
	"log"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	MongoURI       string
	JWTSecret      string
	JWTExpiryHours int
	Port           string

	AllowedOrigins []string

	// Trading Configuration
	// CommissionRate is the percentage of trade value taken as commission (e.g., 0.01 for 1%)
	// In a real system, this might be tiered or different for various instrument types.
	CommissionRate float64
	// FlatFee is the fixed fee in INR per trade
	FlatFee float64
	// MaxCommission is the maximum commission capable of being charged
	MaxCommission float64
}

type FeeConfig struct {
	CommissionRate float64 `json:"commission_rate"`
	FlatFee        float64 `json:"flat_fee"`
	MaxCommission  float64 `json:"max_commission"`
}

func New() *Config {
	expiryHours, _ := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))

	// Load fees from JSON file
	commissionRate := 0.0003 // Default 0.03%
	flatFee := 0.0           // Default 0
	maxCommission := 20.0    // Default ₹20 cap

	file, err := os.Open("fees.json")
	if err != nil {
		log.Printf("Warning: Could not open fees.json, using defaults: %v", err)
	} else {
		defer file.Close()
		var feeConfig FeeConfig
		if err := json.NewDecoder(file).Decode(&feeConfig); err != nil {
			log.Printf("Warning: Could not decode fees.json, using defaults: %v", err)
		} else {
			commissionRate = feeConfig.CommissionRate
			flatFee = feeConfig.FlatFee
			maxCommission = feeConfig.MaxCommission
			log.Printf("Loaded trading fees from config: Rate=%.4f%%, Max=₹%.2f, Flat=₹%.2f", commissionRate*100, maxCommission, flatFee)
		}
	}

	return &Config{
		MongoURI:       getEnv("MONGODB_URI", "mongodb://localhost:27017/aequitas"),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		JWTExpiryHours: expiryHours,
		Port:           getEnv("PORT", "8080"),
		AllowedOrigins: parseAllowedOrigins(getEnv("ALLOWED_ORIGINS", "http://localhost:5173")),
		CommissionRate: commissionRate,
		FlatFee:        flatFee,
		MaxCommission:  maxCommission,
	}
}

func parseAllowedOrigins(origins string) []string {
	if origins == "" {
		return []string{"http://localhost:5173"}
	}

	parts := strings.Split(origins, ",")
	result := make([]string, 0, len(parts))
	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			// Trim trailing slash as browsers send Origin without it
			trimmed = strings.TrimSuffix(trimmed, "/")
			result = append(result, trimmed)
		}
	}

	if len(result) == 0 {
		return []string{"http://localhost:5173"}
	}
	return result
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
