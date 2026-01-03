package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/middleware"
	"aequitas/internal/services"
	"aequitas/internal/utils"
)

type AccountController struct {
	accountService *services.TradingAccountService
}

func NewAccountController(accountService *services.TradingAccountService) *AccountController {
	return &AccountController{accountService: accountService}
}

// GetBalance handles GET /api/account/balance
func (c *AccountController) GetBalance(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	account, err := c.accountService.GetByUserID(userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, account, "Account balance retrieved")
}

type FundRequest struct {
	Amount float64 `json:"amount"`
}

// FundAccount handles POST /api/account/fund
func (c *AccountController) FundAccount(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req FundRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	account, err := c.accountService.FundAccount(userID, req.Amount)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, account, "Account funded successfully")
}

// GetTransactions handles GET /api/account/transactions
func (c *AccountController) GetTransactions(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	transactions, err := c.accountService.GetTransactions(userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, transactions, "Transactions retrieved")
}
