package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/middleware"
	"aequitas/internal/models"
	"aequitas/internal/services"
	"aequitas/internal/utils"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SupportController struct {
	supportService *services.SupportService
}

func NewSupportController(supportService *services.SupportService) *SupportController {
	return &SupportController{supportService: supportService}
}

func (c *SupportController) CreateTicket(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Subject     string   `json:"subject"`
		Description string   `json:"description"`
		Category    string   `json:"category"`
		Attachments []string `json:"attachments"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	userIDStr := middleware.GetUserID(r)
	userID, _ := primitive.ObjectIDFromHex(userIDStr)

	ticket, err := c.supportService.CreateTicket(r.Context(), userID, body.Subject, body.Description, body.Category, body.Attachments)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to create ticket")
		return
	}

	utils.RespondJSON(w, http.StatusCreated, ticket, "Ticket created successfully")
}

func (c *SupportController) GetMyTickets(w http.ResponseWriter, r *http.Request) {
	userIDStr := middleware.GetUserID(r)
	userID, _ := primitive.ObjectIDFromHex(userIDStr)

	tickets, err := c.supportService.GetUserTickets(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch your tickets")
		return
	}
	utils.RespondJSON(w, http.StatusOK, tickets, "My tickets retrieved")
}

func (c *SupportController) GetTicketByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	ticket, err := c.supportService.GetTicketByID(r.Context(), vars["id"])
	if err != nil {
		utils.RespondError(w, http.StatusNotFound, "Ticket not found")
		return
	}
	utils.RespondJSON(w, http.StatusOK, ticket, "Ticket details retrieved")
}

func (c *SupportController) GetTickets(w http.ResponseWriter, r *http.Request) {
	status := r.URL.Query().Get("status")
	tickets, err := c.supportService.GetTickets(r.Context(), status)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch tickets")
		return
	}
	utils.RespondJSON(w, http.StatusOK, tickets, "Tickets retrieved")
}

func (c *SupportController) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var body struct {
		Status models.TicketStatus `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	adminID := middleware.GetUserID(r)
	if err := c.supportService.UpdateTicketStatus(r.Context(), vars["id"], body.Status, adminID); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to update ticket status")
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Ticket status updated")
}
func (c *SupportController) AddComment(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	var body struct {
		Message     string   `json:"message"`
		Attachments []string `json:"attachments"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	authorID := middleware.GetUserID(r)
	// We check if user is admin via context or skip check if it's a public (auth-gated) route
	isAdmin, _ := r.Context().Value(utils.IsAdminKey).(bool)
	role := "USER"
	if isAdmin {
		role = "ADMIN"
	}
	
	authorName, _ := r.Context().Value(utils.UserNameKey).(string)

	err := c.supportService.AddComment(r.Context(), vars["id"], authorID, authorName, role, body.Message, body.Attachments)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to add comment")
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Comment added")
}
