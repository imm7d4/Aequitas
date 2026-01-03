package config

import (
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
}

func New() *Config {
	expiryHours, _ := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))

	return &Config{
		MongoURI:       getEnv("MONGODB_URI", "mongodb://localhost:27017/aequitas"),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		JWTExpiryHours: expiryHours,
		Port:           getEnv("PORT", "8080"),
		AllowedOrigins: parseAllowedOrigins(getEnv("ALLOWED_ORIGINS", "http://localhost:5173")),
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
