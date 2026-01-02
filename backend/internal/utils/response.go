package utils

import (
	"encoding/json"
	"net/http"
)

// APIResponse represents the standardized API response structure
type APIResponse struct {
	StatusCode int         `json:"statusCode"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
}

// RespondJSON sends a JSON response with the standardized format
func RespondJSON(w http.ResponseWriter, statusCode int, data interface{}, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(APIResponse{
		StatusCode: statusCode,
		Data:       data,
		Message:    message,
	})
}

// RespondError sends an error response with the standardized format
func RespondError(w http.ResponseWriter, statusCode int, message string) {
	RespondJSON(w, statusCode, nil, message)
}
