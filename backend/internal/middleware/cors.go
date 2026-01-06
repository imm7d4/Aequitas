package middleware

import (
	"net/http"

	"github.com/gorilla/mux"
)

// CORS middleware handles Cross-Origin Resource Sharing
func CORS(allowedOrigins []string) mux.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")
			isAllowed := false

			// Check if the origin is in our allowed list
			for _, allowed := range allowedOrigins {
				if allowed == "*" || allowed == origin {
					isAllowed = true
					break
				}
			}

			if isAllowed {
				// log.Printf("[CORS] Match: %s %s", r.Method, origin)
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			} else {
				// log.Printf("[CORS] Mismatch: %s %s (Allowed: %v)", r.Method, origin, allowedOrigins)
			}

			// Handle preflight requests
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
