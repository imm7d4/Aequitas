package controllers

import (
	"encoding/json"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"aequitas/internal/middleware"
	"aequitas/internal/models"
	"aequitas/internal/services"
	"aequitas/internal/utils"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderController struct {
	orderService *services.OrderService
}

func NewOrderController(orderService *services.OrderService) *OrderController {
	return &OrderController{orderService: orderService}
}

type OrderRequest struct {
	InstrumentID  string   `json:"instrumentId"`
	Symbol        string   `json:"symbol"`
	Side          string   `json:"side"`
	OrderType     string   `json:"orderType"`
	Quantity      int      `json:"quantity"`
	Price         *float64 `json:"price,omitempty"`
	ClientOrderID string   `json:"clientOrderId"`
}

func (c *OrderController) PlaceOrder(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req OrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body: "+err.Error())
		return
	}

	// Convert DTO to model
	instrID, err := primitive.ObjectIDFromHex(req.InstrumentID)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid instrument ID")
		return
	}

	order := models.Order{
		InstrumentID:  instrID,
		Symbol:        req.Symbol,
		Side:          req.Side,
		OrderType:     req.OrderType,
		Quantity:      req.Quantity,
		Price:         req.Price,
		ClientOrderID: req.ClientOrderID,
		Source:        "UI",
	}

	res, err := c.orderService.PlaceOrder(userID, order)
	if err != nil {
		// Map errors to appropriate status codes
		errMsg := err.Error()
		if strings.Contains(errMsg, "insufficient balance") {
			utils.RespondError(w, http.StatusForbidden, errMsg)
		} else if strings.Contains(errMsg, "duplicate") || strings.Contains(errMsg, "E11000") {
			utils.RespondError(w, http.StatusConflict, "Duplicate order detected (Idempotency check failed)")
		} else {
			utils.RespondError(w, http.StatusBadRequest, errMsg)
		}
		return
	}

	utils.RespondJSON(w, http.StatusCreated, res, "Order placed successfully")
}

func (c *OrderController) GetOrders(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Parse query parameters
	query := r.URL.Query()
	filters := make(map[string]interface{})

	if instrumentID := query.Get("instrumentId"); instrumentID != "" {
		filters["instrumentId"] = instrumentID
	}
	if status := query.Get("status"); status != "" {
		filters["status"] = status
	}
	if startDateStr := query.Get("startDate"); startDateStr != "" {
		if startDate, err := time.Parse(time.RFC3339, startDateStr); err == nil {
			filters["startDate"] = startDate
		}
	}
	if endDateStr := query.Get("endDate"); endDateStr != "" {
		if endDate, err := time.Parse(time.RFC3339, endDateStr); err == nil {
			filters["endDate"] = endDate
		}
	}

	// Parse pagination
	page := 1
	limit := 50 // Default limit
	if pageStr := query.Get("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}
	if limitStr := query.Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
			limit = l
		}
	}

	skip := (page - 1) * limit

	orders, total, err := c.orderService.GetUserOrders(userID, filters, skip, limit)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch orders")
		return
	}

	// Build response with pagination metadata
	totalPages := int(math.Ceil(float64(total) / float64(limit)))
	response := map[string]interface{}{
		"orders": orders,
		"pagination": map[string]interface{}{
			"total":      total,
			"page":       page,
			"limit":      limit,
			"totalPages": totalPages,
		},
	}

	utils.RespondJSON(w, http.StatusOK, response, "Orders fetched successfully")
}

func (c *OrderController) CancelOrder(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	params := mux.Vars(r)
	orderID := params["id"]
	if orderID == "" {
		utils.RespondError(w, http.StatusBadRequest, "Order ID is required")
		return
	}

	order, err := c.orderService.CancelOrder(userID, orderID)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, order, "Order cancelled successfully")
}

type ModifyOrderRequest struct {
	Quantity int      `json:"quantity"`
	Price    *float64 `json:"price,omitempty"`
}

func (c *OrderController) ModifyOrder(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	params := mux.Vars(r)
	orderID := params["id"]
	if orderID == "" {
		utils.RespondError(w, http.StatusBadRequest, "Order ID is required")
		return
	}

	var req ModifyOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body: "+err.Error())
		return
	}

	order, err := c.orderService.ModifyOrder(userID, orderID, req.Quantity, req.Price)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, order, "Order modified successfully")
}
