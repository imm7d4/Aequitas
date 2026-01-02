package config

import (
	"os"
	"strconv"
)

type Config struct {
	MongoURI       string
	JWTSecret      string
	JWTExpiryHours int
	Port           string
}

func New() *Config {
	expiryHours, _ := strconv.Atoi(getEnv("JWT_EXPIRY_HOURS", "24"))

	return &Config{
		MongoURI:       getEnv("MONGODB_URI", "mongodb://localhost:27017/aequitas"),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		JWTExpiryHours: expiryHours,
		Port:           getEnv("PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
