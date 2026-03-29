package middleware

import (
	"bufio"
	"context"
	"errors"
	"log"
	"net"
	"net/http"
	"time"

	"aequitas/internal/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type responseWriter struct {
	http.ResponseWriter
	statusCode int
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.statusCode = code
	rw.ResponseWriter.WriteHeader(code)
}

func (rw *responseWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	hijacker, ok := rw.ResponseWriter.(http.Hijacker)
	if !ok {
		return nil, nil, errors.New("underlying ResponseWriter does not implement http.Hijacker")
	}
	return hijacker.Hijack()
}

// Logger middleware logs HTTP requests and manages Correlation IDs (US-12.4)
func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// 1. Extract or Generate Correlation ID
		correlationID := r.Header.Get("X-Correlation-ID")
		if correlationID == "" {
			correlationID = primitive.NewObjectID().Hex()
		}

		// 2. Inject into context
		ctx := context.WithValue(r.Context(), utils.CorrelationIDKey, correlationID)
		r = r.WithContext(ctx)

		// 3. Add to Response Header
		w.Header().Set("X-Correlation-ID", correlationID)

		rw := &responseWriter{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		next.ServeHTTP(rw, r)

		log.Printf(
			"[%s] %s %s %d %s",
			correlationID,
			r.Method,
			r.RequestURI,
			rw.statusCode,
			time.Since(start),
		)
	})
}
