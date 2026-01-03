package controllers

import (
	"aequitas/internal/models"
	"aequitas/internal/services"
	"aequitas/internal/utils"
	"encoding/json"
	"net/http"
)

type TelemetryController struct {
	service *services.TelemetryService
}

func NewTelemetryController(service *services.TelemetryService) *TelemetryController {
	return &TelemetryController{service: service}
}

func (c *TelemetryController) IngestTelemetry(w http.ResponseWriter, r *http.Request) {
	var req models.TelemetryBatchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if err := c.service.IngestEvents(req.Events); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Telemetry ingested successfully")
}
