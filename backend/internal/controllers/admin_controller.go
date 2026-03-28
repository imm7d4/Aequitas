package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/models"
	"aequitas/internal/services"
	"aequitas/internal/utils"
)

type AdminController struct {
	adminService *services.AdminService
}

func NewAdminController(adminService *services.AdminService) *AdminController {
	return &AdminController{adminService: adminService}
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

	if err := c.adminService.UpdateConfig(r.Context(), &config); err != nil {
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
