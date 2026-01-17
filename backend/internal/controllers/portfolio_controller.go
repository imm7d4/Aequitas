package controllers

import (
	"log"
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

	log.Printf("[Portfolio Summary] User %s - Balance: %.2f, BlockedMargin: %.2f", userID, account.Balance, account.BlockedMargin)

	// Calculate Cash Breakdown
	settlementPending := 0.0 // TODO: Implement T+1/T+2 settlement tracking
	marginCash := account.BlockedMargin
	freeCash := account.Balance - marginCash - settlementPending

	// Ensure accounting invariant: Balance = FreeCash + MarginCash + SettlementPending
	if freeCash < 0 {
		log.Printf("[Portfolio] WARNING: Negative free cash detected for user %s: %.2f", userID, freeCash)
		freeCash = 0 // Prevent negative withdrawable cash display
	}

	// Calculate Short Risk Exposure (if short positions exist)
	var shortRiskExposure map[string]interface{}
	var totalShortLiability float64
	var hasShortPositions bool

	for _, h := range holdings {
		if h.PositionType == "SHORT" {
			hasShortPositions = true
			// Use AvgEntryPrice as current price (frontend will update with real-time data)
			liability := h.AvgEntryPrice * float64(h.Quantity)
			totalShortLiability += liability
		}
	}

	if hasShortPositions {
		risk5Percent := totalShortLiability * 0.05
		risk10Percent := totalShortLiability * 0.10

		// Margin call trigger at 80% of blocked margin consumed
		marginCallTrigger := account.BlockedMargin * 0.8

		// Calculate current unrealized loss on shorts
		var totalUnrealizedLoss float64
		for _, h := range holdings {
			if h.PositionType == "SHORT" {
				// Loss = (CurrentPrice - EntryPrice) * Qty
				// Using AvgEntryPrice as proxy for current price (frontend calculates real-time)
				loss := (h.AvgEntryPrice - h.AvgEntryPrice) * float64(h.Quantity) // Will be 0 here, frontend updates
				if loss > 0 {
					totalUnrealizedLoss += loss
				}
			}
		}

		availableBuffer := marginCallTrigger - totalUnrealizedLoss
		if availableBuffer < 0 {
			availableBuffer = 0
		}

		shortRiskExposure = map[string]interface{}{
			"currentLiability":  totalShortLiability,
			"risk5Percent":      risk5Percent,
			"risk10Percent":     risk10Percent,
			"marginCallTrigger": marginCallTrigger,
			"availableBuffer":   availableBuffer,
		}
	}

	response := map[string]interface{}{
		"holdings":          holdings,
		"realizedPL":        account.RealizedPL,
		"totalEquity":       account.Balance,
		"cashBalance":       account.Balance,
		"blockedMargin":     account.BlockedMargin,
		"freeCash":          freeCash,
		"marginCash":        marginCash,
		"settlementPending": settlementPending,
	}

	if shortRiskExposure != nil {
		response["shortRiskExposure"] = shortRiskExposure
	}

	utils.RespondJSON(w, http.StatusOK, response, "Portfolio summary fetched successfully")
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
