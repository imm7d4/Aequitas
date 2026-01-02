package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/services"
	"aequitas/internal/utils"
)

type AuthController struct {
	authService *services.AuthService
}

func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string      `json:"token"`
	User  interface{} `json:"user"`
}

// Register handles user registration (US-0.1.1)
func (c *AuthController) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Basic shape validation
	if req.Email == "" || req.Password == "" {
		utils.RespondError(w, http.StatusBadRequest, "Email and password are required")
		return
	}

	// Delegate to service
	user, err := c.authService.Register(req.Email, req.Password)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "email already registered" || 
		   err.Error() == "invalid email format" || 
		   err.Error() == "password must be at least 8 characters" {
			statusCode = http.StatusBadRequest
		}
		utils.RespondError(w, statusCode, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, user, "User registered successfully")
}

// Login handles user authentication (US-0.1.3)
func (c *AuthController) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Basic shape validation
	if req.Email == "" || req.Password == "" {
		utils.RespondError(w, http.StatusBadRequest, "Email and password are required")
		return
	}

	// Delegate to service
	token, user, err := c.authService.Login(req.Email, req.Password)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "invalid email or password" {
			statusCode = http.StatusUnauthorized
		}
		utils.RespondError(w, statusCode, err.Error())
		return
	}

	response := LoginResponse{
		Token: token,
		User:  user,
	}

	utils.RespondJSON(w, http.StatusOK, response, "Login successful")
}
