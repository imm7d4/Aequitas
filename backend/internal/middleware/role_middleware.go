package middleware

import (
	"net/http"

	"aequitas/internal/utils"
)

// RoleMiddleware restricts access to specific roles
func RoleMiddleware(allowedRoles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			role, ok := r.Context().Value(UserRoleKey).(string)
			if !ok || role == "" {
				utils.RespondError(w, http.StatusForbidden, "Forbidden: No role found")
				return
			}

			isAllowed := false
			for _, allowed := range allowedRoles {
				if role == allowed {
					isAllowed = true
					break
				}
			}

			if !isAllowed {
				utils.RespondError(w, http.StatusForbidden, "Forbidden: Insufficient privileges")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
