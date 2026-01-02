package middleware

import (
	"context"
	"net/http"
	"strings"

	"aequitas/internal/config"
	"aequitas/internal/utils"
)

type contextKey string

const UserIDKey contextKey = "userID"

// Auth middleware validates JWT token and attaches user ID to context
func Auth(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Extract token from Authorization header
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				utils.RespondError(w, http.StatusUnauthorized, "Authorization header required")
				return
			}

			// Check Bearer format
			parts := strings.Split(authHeader, " ")
			if len(parts) != 2 || parts[0] != "Bearer" {
				utils.RespondError(w, http.StatusUnauthorized, "Invalid authorization format")
				return
			}

			tokenString := parts[1]

			// Validate token
			claims, err := utils.ValidateToken(tokenString, cfg.JWTSecret)
			if err != nil {
				utils.RespondError(w, http.StatusUnauthorized, "Invalid or expired token")
				return
			}

			// Attach user ID to context
			ctx := context.WithValue(r.Context(), UserIDKey, claims.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserID extracts user ID from request context
func GetUserID(r *http.Request) string {
	userID, _ := r.Context().Value(UserIDKey).(string)
	return userID
}
