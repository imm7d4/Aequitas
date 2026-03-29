package middleware

import (
	"net/http"
	"aequitas/internal/models"
	"aequitas/internal/services"
	"aequitas/internal/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ABACMiddleware struct {
	jitService *services.JITService
}

func NewABACMiddleware(jitService *services.JITService) *ABACMiddleware {
	return &ABACMiddleware{jitService: jitService}
}

// Authorize checks for Role + Action + Context (JIT)
func (m *ABACMiddleware) Authorize(action string, isSensitive bool) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := r.Context()
			
			// 1. Basic Role Check (Admin only for these routes)
			role, _ := ctx.Value(utils.UserRoleKey).(string)
			if role != models.RolePlatformAdmin && role != models.RoleRiskOfficer && role != "ADMIN" && role != "SUPER_ADMIN" {
				utils.RespondError(w, http.StatusForbidden, "FORBIDDEN: Administrative/Risk privileges required")
				return
			}

			// 2. Sensitive Action Check (JIT)
			if isSensitive {
				userIDStr, _ := ctx.Value(utils.UserIDKey).(string)
				userID, err := primitive.ObjectIDFromHex(userIDStr)
				if err != nil {
					utils.RespondError(w, http.StatusUnauthorized, "UNAUTHORIZED")
					return
				}

				// Check JIT Authorization (US-12.5)
				// We assume ResourceID is GLOBAL for these management tasks unless specific
				authorized, err := m.jitService.IsAuthorized(ctx, userID, action, primitive.NilObjectID)
				if err != nil || !authorized {
					utils.RespondError(w, http.StatusForbidden, "JIT_REQUIRED: This sensitive action requires an approved JIT request")
					return
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}
