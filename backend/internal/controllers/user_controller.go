package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/middleware"
	"aequitas/internal/models"
	"aequitas/internal/services"
	"aequitas/internal/utils"
)

type UserController struct {
	userService *services.UserService
}

func NewUserController(userService *services.UserService) *UserController {
	return &UserController{userService: userService}
}

type UpdateProfileRequest struct {
	FullName    string `json:"fullName"`
	DisplayName string `json:"displayName"`
	Bio         string `json:"bio"`
	Avatar      string `json:"avatar"`
}

// GetProfile handles GET /api/user/profile
func (c *UserController) GetProfile(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	user, err := c.userService.GetProfile(userID)
	if err != nil {
		utils.RespondError(w, http.StatusNotFound, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, user, "Profile retrieved successfully")
}

// UpdateProfile handles PUT /api/user/profile
func (c *UserController) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Basic shape validation
	if req.DisplayName == "" {
		utils.RespondError(w, http.StatusBadRequest, "Display name is required")
		return
	}

	user, err := c.userService.UpdateProfile(
		userID,
		req.FullName,
		req.DisplayName,
		req.Bio,
		req.Avatar,
	)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, user, "Profile updated successfully")
}

type UpdatePasswordRequest struct {
	CurrentPassword string `json:"currentPassword"`
	NewPassword     string `json:"newPassword"`
}

// UpdatePassword handles PUT /api/user/password
func (c *UserController) UpdatePassword(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req UpdatePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.CurrentPassword == "" || req.NewPassword == "" {
		utils.RespondError(w, http.StatusBadRequest, "Current and new passwords are required")
		return
	}

	err := c.userService.UpdatePassword(userID, req.CurrentPassword, req.NewPassword)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "invalid current password" || err.Error() == "password must be at least 8 characters" {
			statusCode = http.StatusBadRequest
		}
		utils.RespondError(w, statusCode, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Password updated successfully")
}

// UpdatePreferences handles PUT /api/user/preferences
func (c *UserController) UpdatePreferences(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	var req models.UserPreferences
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	user, err := c.userService.UpdatePreferences(userID, req)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, user, "Preferences updated successfully")
}
