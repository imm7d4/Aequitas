package controllers

import (
	"encoding/json"
	"net/http"
	"strings"

	"aequitas/internal/middleware"
	"aequitas/internal/models"
	"aequitas/internal/services"
	"aequitas/internal/utils"
)

type OrderController struct {
	orderService *services.OrderService
}

func NewOrderController(orderService *services.OrderService) *OrderController {
	return &OrderController{orderService: orderService}
}

func (c *OrderController) PlaceOrder(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req models.Order
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	order, err := c.orderService.PlaceOrder(userID, req)
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

	utils.RespondJSON(w, http.StatusCreated, order, "Order placed successfully")
}
