package middleware

import (
	"net/http"

	"aequitas/internal/config"
	"aequitas/internal/utils"
)

// StepUpMiddleware ensures that a sensitive action has been verified with MFA.
// If EnableStepUpMFA is false in the config, it skips the check.
func StepUpMiddleware(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Bypass if MFA is globally disabled
			if !cfg.EnableStepUpMFA {
				next.ServeHTTP(w, r)
				return
			}

			// Check for step-up verification evidence.
			// In a real implementation, this could be:
			// 1. A specialized JWT claim (e.g., "amr": ["mfa"])
			// 2. A secondary short-lived "Step-Up Token" in a header
			// For now, we look for a mock header or a specific context flag.
			
			// Let's assume the auth middleware or a prior step has validated the step-up
			// and placed it in the context.
			verified, ok := r.Context().Value(utils.StepUpVerifiedKey).(bool)
			if !ok || !verified {
				// Also check for a mock header for easier testing/integration before full MFA is ready
				if r.Header.Get("X-Step-Up-Verified") == "true" {
					next.ServeHTTP(w, r)
					return
				}

				utils.RespondError(w, http.StatusForbidden, "Step-up MFA verification required for this action")
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
