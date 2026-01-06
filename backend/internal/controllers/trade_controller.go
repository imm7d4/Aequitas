package controllers

import (
	"net/http"

	"aequitas/internal/middleware"
	"aequitas/internal/services"
	"aequitas/internal/utils"

	"github.com/gorilla/mux"
)

type TradeController struct {
	service *services.TradeService
}

func NewTradeController(service *services.TradeService) *TradeController {
	return &TradeController{service: service}
}

func (c *TradeController) GetUserTrades(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	trades, err := c.service.GetUserTrades(userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, trades, "Trades fetched successfully")
}

func (c *TradeController) GetTradesByOrder(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	orderID := vars["orderId"]

	trades, err := c.service.GetTradesByOrder(orderID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, trades, "Trades for order fetched successfully")
}
