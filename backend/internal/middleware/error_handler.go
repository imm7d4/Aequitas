package middleware

import (
	"log"
	"net/http"
	"runtime/debug"

	"aequitas/internal/utils"
)

// ErrorHandler middleware recovers from panics and logs errors
func ErrorHandler(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic: %v\n%s", err, debug.Stack())
				utils.RespondError(w, http.StatusInternalServerError, "Internal server error")
			}
		}()
		
		next.ServeHTTP(w, r)
	})
}
