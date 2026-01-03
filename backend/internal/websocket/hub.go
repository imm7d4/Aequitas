package websocket

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// Message types
const (
	MessageTypeSubscribe   = "subscribe"
	MessageTypeUnsubscribe = "unsubscribe"
	MessageTypeCandle      = "candle"
	MessageTypeError       = "error"
)

// WSMessage represents a WebSocket message
type WSMessage struct {
	Type   string      `json:"type"`
	Symbol string      `json:"symbol,omitempty"`
	Data   interface{} `json:"data,omitempty"`
}

// Client represents a WebSocket client connection
type Client struct {
	ID            string
	Conn          *websocket.Conn
	Subscriptions map[string]bool // instrumentID -> subscribed
	Send          chan []byte
	Hub           *Hub
	mu            sync.RWMutex
}

// Hub maintains active clients and broadcasts messages
type Hub struct {
	clients    map[*Client]bool
	broadcast  chan BroadcastMessage
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

// BroadcastMessage represents a message to broadcast to specific clients
type BroadcastMessage struct {
	InstrumentID string
	Data         []byte
}

// NewHub creates a new Hub instance
func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan BroadcastMessage, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

// Run starts the hub's main loop
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
			log.Printf("WebSocket: Client %s registered. Total clients: %d", client.ID, len(h.clients))

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
				log.Printf("WebSocket: Client %s unregistered. Total clients: %d", client.ID, len(h.clients))
			}
			h.mu.Unlock()

		case message := <-h.broadcast:
			h.mu.RLock()
			for client := range h.clients {
				client.mu.RLock()
				subscribed := client.Subscriptions[message.InstrumentID]
				client.mu.RUnlock()

				if subscribed {
					select {
					case client.Send <- message.Data:
					default:
						// Client's send buffer is full, close connection
						h.mu.RUnlock()
						h.unregister <- client
						h.mu.RLock()
					}
				}
			}
			h.mu.RUnlock()
		}
	}
}

// BroadcastToInstrument sends a message to all clients subscribed to an instrument
func (h *Hub) BroadcastToInstrument(instrumentID string, data interface{}) {
	message := WSMessage{
		Type: MessageTypeCandle,
		Data: data,
	}

	jsonData, err := json.Marshal(message)
	if err != nil {
		log.Printf("WebSocket: Error marshaling broadcast message: %v", err)
		return
	}

	h.broadcast <- BroadcastMessage{
		InstrumentID: instrumentID,
		Data:         jsonData,
	}
}

// ReadPump pumps messages from the WebSocket connection to the hub
func (c *Client) ReadPump() {
	defer func() {
		c.Hub.unregister <- c
		c.Conn.Close()
	}()

	c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	c.Conn.SetPongHandler(func(string) error {
		c.Conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		_, messageBytes, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket: Unexpected close error from client %s: %v", c.ID, err)
			}
			break
		}

		var msg WSMessage
		if err := json.Unmarshal(messageBytes, &msg); err != nil {
			log.Printf("WebSocket: Error unmarshaling message from client %s: %v", c.ID, err)
			c.SendError("Invalid message format")
			continue
		}

		c.handleMessage(msg)
	}
}

// WritePump pumps messages from the hub to the WebSocket connection
func (c *Client) WritePump() {
	ticker := time.NewTicker(54 * time.Second)
	defer func() {
		ticker.Stop()
		c.Conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.Send:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				// Hub closed the channel
				c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}

		case <-ticker.C:
			c.Conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// handleMessage processes incoming messages from the client
func (c *Client) handleMessage(msg WSMessage) {
	switch msg.Type {
	case MessageTypeSubscribe:
		if msg.Symbol == "" {
			c.SendError("Symbol is required for subscription")
			return
		}
		c.Subscribe(msg.Symbol)
		log.Printf("WebSocket: Client %s subscribed to %s", c.ID, msg.Symbol)

	case MessageTypeUnsubscribe:
		if msg.Symbol == "" {
			c.SendError("Symbol is required for unsubscription")
			return
		}
		c.Unsubscribe(msg.Symbol)
		log.Printf("WebSocket: Client %s unsubscribed from %s", c.ID, msg.Symbol)

	default:
		c.SendError("Unknown message type: " + msg.Type)
	}
}

// Subscribe adds an instrument to the client's subscriptions
func (c *Client) Subscribe(instrumentID string) {
	c.mu.Lock()
	c.Subscriptions[instrumentID] = true
	c.mu.Unlock()
}

// Unsubscribe removes an instrument from the client's subscriptions
func (c *Client) Unsubscribe(instrumentID string) {
	c.mu.Lock()
	delete(c.Subscriptions, instrumentID)
	c.mu.Unlock()
}

// SendError sends an error message to the client
func (c *Client) SendError(errorMsg string) {
	msg := WSMessage{
		Type: MessageTypeError,
		Data: map[string]string{"error": errorMsg},
	}

	jsonData, err := json.Marshal(msg)
	if err != nil {
		log.Printf("WebSocket: Error marshaling error message: %v", err)
		return
	}

	select {
	case c.Send <- jsonData:
	default:
		log.Printf("WebSocket: Client %s send buffer full, dropping error message", c.ID)
	}
}
