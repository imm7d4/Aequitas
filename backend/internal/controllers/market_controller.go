package controllers

import (
	"encoding/json"
	"net/http"
	"strings"

	"aequitas/internal/services"
	"aequitas/internal/utils"

	"github.com/gorilla/mux"
)

type MarketController struct {
	service *services.MarketService
}

func NewMarketController(service *services.MarketService) *MarketController {
	return &MarketController{service: service}
}

func (c *MarketController) GetMarketStatus(
	w http.ResponseWriter,
	r *http.Request,
) {
	vars := mux.Vars(r)
	exchange := vars["exchange"]

	status, err := c.service.GetMarketStatus(exchange)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, status, "Market status retrieved")
}

func (c *MarketController) CreateMarketHours(
	w http.ResponseWriter,
	r *http.Request,
) {
	var req services.CreateMarketHoursRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := c.service.CreateMarketHours(req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, nil, "Market hours created")
}

func (c *MarketController) GetWeeklyHours(
	w http.ResponseWriter,
	r *http.Request,
) {
	vars := mux.Vars(r)
	exchange := vars["exchange"]

	hours, err := c.service.GetWeeklyHours(exchange)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, hours, "Weekly hours retrieved")
}

func (c *MarketController) UpdateWeeklyHours(
	w http.ResponseWriter,
	r *http.Request,
) {
	vars := mux.Vars(r)
	exchange := vars["exchange"]

	var req services.UpdateWeeklyHoursRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := c.service.UpdateWeeklyHours(exchange, req.Hours); err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Weekly hours updated successfully")
}

func (c *MarketController) CreateHoliday(w http.ResponseWriter, r *http.Request) {
	var req services.CreateHolidayRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := c.service.CreateHoliday(req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, nil, "Holiday created")
}

func (c *MarketController) GetHolidays(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	exchange := vars["exchange"]

	holidays, err := c.service.GetHolidays(exchange)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, holidays, "Holidays retrieved")
}

func (c *MarketController) DeleteHoliday(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if err := c.service.DeleteHoliday(id); err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Holiday deleted")
}
func (c *MarketController) GetBatchPrices(w http.ResponseWriter, r *http.Request) {
	idsParam := r.URL.Query().Get("ids")
	if idsParam == "" {
		utils.RespondError(w, http.StatusBadRequest, "Missing 'ids' query parameter")
		return
	}

	ids := strings.Split(idsParam, ",")
	prices, err := c.service.GetBatchPrices(ids)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, prices, "Batch prices retrieved")
}
