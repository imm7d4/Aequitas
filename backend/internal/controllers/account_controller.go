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

	account, err := c.accountService.GetByUserID(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, account, "Account balance retrieved")
}

type FundRequest struct {
	Amount float64 `json:"amount"`
}

// FundAccount handles POST /api/account/fund (Legacy/Shortcut)
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

	account, err := c.accountService.FundAccount(r.Context(), userID, req.Amount)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, account, "Account funded successfully")
}

type DepositInitiateRequest struct {
	Amount float64 `json:"amount"`
}

// InitiateDeposit handles POST /api/account/deposit/initiate
func (c *AccountController) InitiateDeposit(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req DepositInitiateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	tx, otp, err := c.accountService.InitiateDeposit(r.Context(), userID, req.Amount)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "please update your profile with a valid phone number to receive SMS OTP" || 
		   err.Error() == "trading account not found" ||
		   err.Error() == "amount must be greater than zero" {
			statusCode = http.StatusBadRequest
		}
		utils.RespondError(w, statusCode, err.Error())
		return
	}

	// For simulation convenience, we return debug_otp in non-production
	response := map[string]interface{}{
		"transactionId": tx.ID.Hex(),
		"amount":        tx.Amount,
		"status":        tx.Status,
		"debug_otp":      otp, // Remove in real production!
	}

	utils.RespondJSON(w, http.StatusAccepted, response, "Deposit initiated, check SMS for OTP")
}

type DepositCompleteRequest struct {
	TransactionID string `json:"transactionId"`
	OTPCode       string `json:"otpCode"`
}

// CompleteDeposit handles POST /api/account/deposit/complete
func (c *AccountController) CompleteDeposit(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req DepositCompleteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	account, err := c.accountService.CompleteDeposit(r.Context(), userID, req.TransactionID, req.OTPCode)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, account, "Deposit completed successfully")
}

// GetTransactions handles GET /api/account/transactions
func (c *AccountController) GetTransactions(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	transactions, err := c.accountService.GetTransactions(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, transactions, "Transactions retrieved")
}
