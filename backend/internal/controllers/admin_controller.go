package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"

	"aequitas/internal/middleware"
	"aequitas/internal/models"
	"aequitas/internal/services"
	"aequitas/internal/utils"
)

type AdminController struct {
	adminService   *services.AdminService
	accountService *services.TradingAccountService
}

func NewAdminController(adminService *services.AdminService, accountService *services.TradingAccountService) *AdminController {
	return &AdminController{
		adminService:   adminService,
		accountService: accountService,
	}
}

func (c *AdminController) GetPlatformMetrics(w http.ResponseWriter, r *http.Request) {
	metrics, err := c.adminService.GetPlatformMetrics(r.Context())
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch platform metrics")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}

func (c *AdminController) GetConfig(w http.ResponseWriter, r *http.Request) {
	config, err := c.adminService.GetConfig(r.Context())
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch platform configuration")
		return
	}

	utils.RespondJSON(w, http.StatusOK, config, "Configuration retrieved")
}

func (c *AdminController) UpdateConfig(w http.ResponseWriter, r *http.Request) {
	var config models.AdminConfig
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	adminID := middleware.GetUserID(r)
	if err := c.adminService.UpdateConfig(r.Context(), &config, adminID); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to update configuration")
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Configuration updated successfully")
}

func (c *AdminController) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := c.adminService.GetUsers(r.Context())
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch users")
		return
	}

	utils.RespondJSON(w, http.StatusOK, users, "Users retrieved successfully")
}

func (c *AdminController) UpdateUserStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var req struct {
		Status string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	adminID := middleware.GetUserID(r)
	if err := c.adminService.UpdateUserStatus(r.Context(), vars["id"], req.Status, adminID); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "User status updated")
}

func (c *AdminController) GetWallets(w http.ResponseWriter, r *http.Request) {
	wallets, err := c.adminService.GetWallets(r.Context())
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch wallets")
		return
	}
	utils.RespondJSON(w, http.StatusOK, wallets, "Wallets retrieved")
}

func (c *AdminController) AdjustWallet(w http.ResponseWriter, r *http.Request) {
	var body struct {
		UserID      string  `json:"userId"`
		Amount      float64 `json:"amount"`
		ReferenceID string  `json:"referenceId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	adminID := middleware.GetUserID(r)
	if err := c.adminService.AdjustWallet(r.Context(), body.UserID, body.Amount, body.ReferenceID, adminID); err != nil {
		utils.RespondError(w, http.StatusForbidden, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Wallet adjusted")
}

func (c *AdminController) GetWalletHistory(w http.ResponseWriter, r *http.Request) {
	// Re-use transaction history but for admin view (all user tx)
	userID := r.URL.Query().Get("userId")
	if userID == "" {
		utils.RespondError(w, http.StatusBadRequest, "User ID required")
		return
	}
	transactions, err := c.accountService.GetTransactions(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch wallet history")
		return
	}
	utils.RespondJSON(w, http.StatusOK, transactions, "Wallet history retrieved")
}

func (c *AdminController) GetUserTransactions(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	transactions, err := c.accountService.GetTransactions(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch user transactions")
		return
	}

	utils.RespondJSON(w, http.StatusOK, transactions, "User transactions retrieved")
}
func (c *AdminController) LogJustification(w http.ResponseWriter, r *http.Request) {
	var body struct {
		LogID         string `json:"logId"`
		TicketRef     string `json:"ticketRef"`
		Justification string `json:"justification"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	adminID := middleware.GetUserID(r)
	if err := c.adminService.LogJustification(r.Context(), body.LogID, body.TicketRef, body.Justification, adminID); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to log justification")
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Justification logged successfully")
}

func (c *AdminController) CreateUser(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string `json:"email"`
		FullName string `json:"fullName"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if body.Email == "" || body.Password == "" || body.Role == "" {
		utils.RespondError(w, http.StatusBadRequest, "Email, Password, and Role are required")
		return
	}

	adminID := middleware.GetUserID(r)
	user, err := c.adminService.CreateUser(r.Context(), body.Email, body.FullName, body.Password, body.Role, adminID)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, user, "Administrative user created successfully")
}
