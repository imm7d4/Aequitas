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

type ForgotPasswordRequest struct {
	Email string `json:"email"`
}

type ResetPasswordRequest struct {
	Email       string `json:"email"`
	OTP         string `json:"otp"`
	NewPassword string `json:"newPassword"`
}

type CompleteRegistrationRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	OTP      string `json:"otp"`
}

// Register handles the first step of user registration: sending OTP
func (c *AuthController) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Email == "" || req.Password == "" {
		utils.RespondError(w, http.StatusBadRequest, "Email and password are required")
		return
	}

	err := c.authService.InitiateRegistration(req.Email, req.Password)
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

	utils.RespondJSON(w, http.StatusOK, nil, "Verification OTP sent to your email")
}

// CompleteRegistration handles the second step: verifying OTP and creating account
func (c *AuthController) CompleteRegistration(w http.ResponseWriter, r *http.Request) {
	var req CompleteRegistrationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	user, err := c.authService.CompleteRegistration(req.Email, req.Password, req.OTP)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusCreated, user, "Registration complete! You can now log in.")
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
	token, user, err := c.authService.Login(req.Email, req.Password, r.RemoteAddr)
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

// Logout handles user session termination for forensic tracking
func (c *AuthController) Logout(w http.ResponseWriter, r *http.Request) {
	c.authService.Logout(r.Context())
	utils.RespondJSON(w, http.StatusOK, nil, "Logged out successfully")
}

// ForgotPassword handles sending a reset OTP
func (c *AuthController) ForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req ForgotPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	if req.Email == "" {
		utils.RespondError(w, http.StatusBadRequest, "Email is required")
		return
	}

	err := c.authService.InitiateForgotPassword(req.Email)
	if err != nil {
		statusCode := http.StatusInternalServerError
		if err.Error() == "user not found" {
			statusCode = http.StatusBadRequest
		}
		utils.RespondError(w, statusCode, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Reset instructions have been sent to your email.")
}

// ResetPassword handles the final password update
func (c *AuthController) ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	err := c.authService.ResetPassword(req.Email, req.OTP, req.NewPassword)
	if err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Password reset successful! You can now log in with your new password.")
}

// StepUp handles the mock MFA verification for sensitive actions
func (c *AuthController) StepUp(w http.ResponseWriter, r *http.Request) {
	// In a real implementation, this would verify a TOTP code or similar.
	// For now, we just return a success response to demonstrate the flow.
	utils.RespondJSON(w, http.StatusOK, map[string]bool{"verified": true}, "Step-up MFA verified successfully")
}
