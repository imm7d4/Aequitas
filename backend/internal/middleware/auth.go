package middleware

import (
	"context"
	"net/http"
	"strings"

	"aequitas/internal/config"
	"aequitas/internal/repositories"
	"aequitas/internal/utils"
)

// Auth middleware validates JWT token and attaches user ID to context
func Auth(cfg *config.Config, userRepo *repositories.UserRepository) func(http.Handler) http.Handler {
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

			// Attach user ID, isAdmin and Role to context
			ctx := context.WithValue(r.Context(), UserIDKey, claims.UserID)
			ctx = context.WithValue(ctx, IsAdminKey, claims.IsAdmin)
			ctx = context.WithValue(ctx, UserRoleKey, claims.Role)

			// Update LastActivityAt (non-blocking)
			go func(uid string) {
				_ = userRepo.UpdateLastActivity(uid)
			}(claims.UserID)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// GetUserID extracts user ID from request context
func GetUserID(r *http.Request) string {
	userID, _ := r.Context().Value(UserIDKey).(string)
	return userID
}
