package controllers

import (
	"net/http"
	"strconv"
	"time"

	"aequitas/internal/services"
	"aequitas/internal/utils"

	"github.com/gorilla/mux"
)

type CandleController struct {
	service *services.CandleService
}

func NewCandleController(service *services.CandleService) *CandleController {
	return &CandleController{
		service: service,
	}
}

func (c *CandleController) GetHistoricalCandles(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	instrumentID := vars["id"]

	interval := r.URL.Query().Get("interval")
	if interval == "" {
		interval = "1m"
	}

	fromStr := r.URL.Query().Get("from")
	toStr := r.URL.Query().Get("to")
	limitStr := r.URL.Query().Get("limit")

	var from, to time.Time
	var err error

	if fromStr != "" {
		from, err = time.Parse(time.RFC3339, fromStr)
		if err != nil {
			utils.RespondError(w, http.StatusBadRequest, "Invalid 'from' timestamp format. Use RFC3339.")
			return
		}
	} else {
		// Default to last 7 days to ensure we get data even if there are gaps
		// The limit (100) will ensure we don't fetch too much
		from = time.Now().AddDate(0, 0, -7)
	}

	if toStr != "" {
		to, err = time.Parse(time.RFC3339, toStr)
		if err != nil {
			utils.RespondError(w, http.StatusBadRequest, "Invalid 'to' timestamp format. Use RFC3339.")
			return
		}
	} else {
		to = time.Now()
	}

	// Ensure 'to' is never in the future
	now := time.Now()
	if to.After(now) {
		to = now
	}

	limit := 100
	if limitStr != "" {
		limit, _ = strconv.Atoi(limitStr)
	}

	candles, err := c.service.GetHistoricalCandles(instrumentID, interval, from, to, limit)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, candles, "Success")
}
