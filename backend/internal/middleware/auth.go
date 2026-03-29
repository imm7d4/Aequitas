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
func Auth(cfg *config.Config, userRepo *repositories.UserRepository, adminRepo *repositories.AdminConfigRepository) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 1. Check Maintenance Mode (US-12.3)
			config, err := adminRepo.GetConfig(context.Background())
			isMaintenance := false
			if err == nil && config.MaintenanceMode {
				isMaintenance = true
			}

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

			// 4. Critical Governance Check (US-12.5)
			// To ensure immediate invalidation of deactivated accounts or sessions,
			// we fetch the user status from DB.
			dbUser, err := userRepo.FindByID(claims.UserID)
			if err != nil || dbUser.Status != "ACTIVE" {
				utils.RespondError(w, http.StatusUnauthorized, "ACCOUNT_INACTIVE: Your account is disabled or requires re-authentication")
				return
			}

			// Attach user ID, isAdmin and Role to context
			ctx := context.WithValue(r.Context(), utils.UserIDKey, claims.UserID)
			ctx = context.WithValue(ctx, utils.UserNameKey, claims.FullName)
			ctx = context.WithValue(ctx, utils.IsAdminKey, claims.IsAdmin)
			ctx = context.WithValue(ctx, utils.UserRoleKey, claims.Role)

			if isMaintenance && !claims.IsAdmin {
				// Check if user is a test account (US-12.3)
				if !dbUser.IsTestAccount {
					utils.RespondError(w, http.StatusServiceUnavailable, "Platform is under maintenance. Access restricted to Admin/Test accounts.")
					return
				}
			}

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
	userID, _ := r.Context().Value(utils.UserIDKey).(string)
	return userID
}
