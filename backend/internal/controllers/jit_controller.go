package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/services"
	"aequitas/internal/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JITController struct {
	jitService *services.JITService
}

func NewJITController(jitService *services.JITService) *JITController {
	return &JITController{jitService: jitService}
}

func (c *JITController) CreateRequest(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Action     string  `json:"action"`
		ResourceID string  `json:"resourceId"`
		Amount     float64 `json:"amount"`
		Reason     string  `json:"reason"`
		Duration   int     `json:"duration"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	makerIDStr, ok := r.Context().Value(utils.UserIDKey).(string)
	if !ok {
		utils.RespondError(w, http.StatusUnauthorized, "User ID not found in context")
		return
	}
	makerID, _ := primitive.ObjectIDFromHex(makerIDStr)
	resourceID, _ := primitive.ObjectIDFromHex(body.ResourceID)

	req, err := c.jitService.RequestAccess(r.Context(), makerID, body.Action, resourceID, body.Amount, body.Reason, body.Duration)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to create JIT request")
		return
	}

	utils.RespondJSON(w, http.StatusCreated, req, "Request created")
}

func (c *JITController) GetPending(w http.ResponseWriter, r *http.Request) {
	reqs, err := c.jitService.GetPendingRequests(r.Context())
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch pending requests")
		return
	}
	utils.RespondJSON(w, http.StatusOK, reqs, "Pending requests retrieved")
}

func (c *JITController) Approve(w http.ResponseWriter, r *http.Request) {
	var body struct {
		RequestID string `json:"requestId"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	checkerIDStr, ok := r.Context().Value(utils.UserIDKey).(string)
	if !ok {
		utils.RespondError(w, http.StatusUnauthorized, "User ID not found in context")
		return
	}
	checkerID, _ := primitive.ObjectIDFromHex(checkerIDStr)
	requestID, _ := primitive.ObjectIDFromHex(body.RequestID)

	if err := c.jitService.ApproveRequest(r.Context(), requestID, checkerID); err != nil {
		utils.RespondError(w, http.StatusBadRequest, err.Error())
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Request approved")
}
