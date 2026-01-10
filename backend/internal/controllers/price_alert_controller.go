package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/middleware"
	"aequitas/internal/models"
	"aequitas/internal/services"
	"aequitas/internal/utils"

	"github.com/gorilla/mux"
)

type PriceAlertController struct {
	service *services.PriceAlertService
}

func NewPriceAlertController(service *services.PriceAlertService) *PriceAlertController {
	return &PriceAlertController{service: service}
}

type CreateAlertRequest struct {
	InstrumentID string  `json:"instrumentId"`
	Symbol       string  `json:"symbol"`
	TargetPrice  float64 `json:"targetPrice"`
	Condition    string  `json:"condition"`
}

func (c *PriceAlertController) CreateAlert(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req CreateAlertRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	condition := models.AlertCondition(req.Condition)
	if condition != models.AlertConditionAbove && condition != models.AlertConditionBelow {
		utils.RespondError(w, http.StatusBadRequest, "Invalid alert condition")
		return
	}

	alert, err := c.service.CreateAlert(r.Context(), userID, req.InstrumentID, req.Symbol, req.TargetPrice, condition)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to create alert: "+err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, alert, "Price alert created successfully")
}

func (c *PriceAlertController) GetAlerts(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	alerts, err := c.service.GetUserAlerts(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch alerts")
		return
	}

	utils.RespondJSON(w, http.StatusOK, alerts, "Alerts retrieved successfully")
}

func (c *PriceAlertController) CancelAlert(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := c.service.CancelAlert(r.Context(), id); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to cancel alert")
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Alert cancelled successfully")
}
