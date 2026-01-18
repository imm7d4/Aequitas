package controllers

import (
	"log"
	"net/http"

	"aequitas/internal/middleware"
	"aequitas/internal/services"
	"aequitas/internal/utils"
)

type AnalyticsController struct {
	analyticsService *services.AnalyticsService
}

func NewAnalyticsController(analyticsService *services.AnalyticsService) *AnalyticsController {
	return &AnalyticsController{
		analyticsService: analyticsService,
	}
}

// GetDiagnostics retrieves performance diagnostics for completed trades.
func (c *AnalyticsController) GetDiagnostics(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	results, err := c.analyticsService.GetUserTradeDiagnostics(userID)
	if err != nil {
		log.Printf("[AnalyticsController] Error fetching diagnostics for user %s: %v", userID, err)
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch trade diagnostics: "+err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, results, "Trade diagnostics fetched successfully")
}
