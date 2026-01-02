package middleware

import (
	"context"
	"net/http"

	"aequitas/internal/utils"
)

func AdminMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get user from context (set by auth middleware)
		userID, ok := r.Context().Value(UserIDKey).(string)
		if !ok || userID == "" {
			utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
			return
		}

		// Get isAdmin flag from context
		isAdmin, ok := r.Context().Value(IsAdminKey).(bool)
		if !ok || !isAdmin {
			utils.RespondError(w, http.StatusForbidden, "Admin access required")
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Helper to add isAdmin to context (called by auth middleware)
func WithAdminContext(ctx context.Context, isAdmin bool) context.Context {
	return context.WithValue(ctx, IsAdminKey, isAdmin)
}
