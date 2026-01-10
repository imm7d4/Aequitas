package controllers

import (
	"net/http"

	"aequitas/internal/middleware"
	"aequitas/internal/services"
	"aequitas/internal/utils"

	"github.com/gorilla/mux"
)

type NotificationController struct {
	service *services.NotificationService
}

func NewNotificationController(service *services.NotificationService) *NotificationController {
	return &NotificationController{
		service: service,
	}
}

// GetHistory returns the user's notification history
func (c *NotificationController) GetHistory(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	notifications, err := c.service.GetUserNotifications(r.Context(), userID)
	if err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to fetch notifications")
		return
	}

	utils.RespondJSON(w, http.StatusOK, notifications, "Notification history retrieved successfully")
}

// MarkRead marks a single notification as read
func (c *NotificationController) MarkRead(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	vars := mux.Vars(r)
	notificationID := vars["id"]

	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	if err := c.service.MarkAsRead(r.Context(), notificationID, userID); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to mark as read")
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "Notification marked as read")
}

// MarkAllRead marks all notifications as read
func (c *NotificationController) MarkAllRead(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	if err := c.service.MarkAllAsRead(r.Context(), userID); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to mark all as read")
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "All notifications marked as read")
}

// ClearAll deletes all notifications for the user
func (c *NotificationController) ClearAll(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == "" {
		utils.RespondError(w, http.StatusUnauthorized, "Unauthorized")
		return
	}

	if err := c.service.ClearAllNotifications(r.Context(), userID); err != nil {
		utils.RespondError(w, http.StatusInternalServerError, "Failed to clear notifications")
		return
	}

	utils.RespondJSON(w, http.StatusOK, nil, "All notifications cleared")
}
