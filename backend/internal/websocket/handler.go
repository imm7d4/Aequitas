package websocket

import (
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"

	"aequitas/internal/utils"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow all origins for development
		// TODO: Restrict origins in production
		return true
	},
}

// Handler handles WebSocket connections
type Handler struct {
	Hub       *Hub
	JWTSecret string
}

// NewHandler creates a new WebSocket handler
func NewHandler(hub *Hub, jwtSecret string) *Handler {
	return &Handler{
		Hub:       hub,
		JWTSecret: jwtSecret,
	}
}

// HandleWebSocket handles WebSocket upgrade requests
func (h *Handler) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	// Authenticate
	tokenStr := r.URL.Query().Get("token")
	var userID string

	if tokenStr != "" {
		claims, err := utils.ValidateToken(tokenStr, h.JWTSecret)
		if err == nil {
			userID = claims.UserID
		} else {
			log.Printf("WebSocket: Invalid token: %v", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
	} else {
		// Allow unauthenticated connections for public data, but they won't receive notifications
		// or maybe we should enforce auth?
		// For now, let's allow it but log it.
		// Actually, requirement says "WebSocket connections MUST be authenticated via JWT".
		// user-stories/phase-7-notifications/US-7.1-notification-system.md:77
		log.Println("WebSocket: No token provided")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket: Failed to upgrade connection: %v", err)
		return
	}

	client := &Client{
		ID:            uuid.New().String(),
		UserID:        userID,
		Conn:          conn,
		Subscriptions: make(map[string]bool),
		Send:          make(chan []byte, 256),
		Hub:           h.Hub,
	}

	h.Hub.register <- client

	// Start client goroutines
	go client.WritePump()
	go client.ReadPump()

	log.Printf("WebSocket: New client connected: %s (User: %s)", client.ID, client.UserID)
}
