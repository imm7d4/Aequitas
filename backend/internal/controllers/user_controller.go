package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/middleware"
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
