package controllers

import (
	"net/http"

	"aequitas/internal/middleware"
	"aequitas/internal/services"
	"aequitas/internal/utils"
)

type PortfolioController struct {
	portfolioService *services.PortfolioService
}

func NewPortfolioController(portfolioService *services.PortfolioService) *PortfolioController {
	return &PortfolioController{
		portfolioService: portfolioService,
	}
}

func (c *PortfolioController) GetHoldings(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	holdings, err := c.portfolioService.GetHoldings(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch holdings")
		return
	}

	utils.RespondJSON(w, http.StatusOK, holdings, "Holdings fetched successfully")
}

func (c *PortfolioController) GetSummary(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// In the future, this can call a specialized service method that aggregates total value, P&L, etc.
	// For now, let's return the raw holdings and let frontend calculate live P&L with real-time market data.
	// Or we can return a basic summary if we had access to LTP here (which we might not without querying MarketDataRepo).

	// Re-using GetHoldings logic for now as the summary is derived from holdings + live price.
	holdings, err := c.portfolioService.GetHoldings(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch portfolio summary")
		return
	}

	account, err := c.portfolioService.GetTradingAccount(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch trading account")
		return
	}

	utils.RespondJSON(w, http.StatusOK, map[string]interface{}{
		"holdings":    holdings,
		"realizedPL":  account.RealizedPL,
		"totalEquity": account.Balance, // Sending balance too for completeness
		"cashBalance": account.Balance,
	}, "Portfolio summary fetched successfully")
}

// CaptureSnapshot handles POST /api/portfolio/snapshot (For testing/manual trigger)
func (c *PortfolioController) CaptureSnapshot(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	snapshot, err := c.portfolioService.CaptureSnapshot(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, snapshot, "Portfolio snapshot captured")
}

// GetHistory handles GET /api/portfolio/history
func (c *PortfolioController) GetHistory(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	// Default limit? or parse form param
	limit := 30 // Default to 30 days

	history, err := c.portfolioService.GetSnapshotHistory(r.Context(), userID, limit)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, history, "Portfolio history retrieved")
}
