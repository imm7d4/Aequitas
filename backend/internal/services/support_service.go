package services

import (
	"context"
	"fmt"
	"time"
	"aequitas/internal/models"
	"aequitas/internal/repositories"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SupportService struct {
	ticketRepo          *repositories.SupportTicketRepository
	userRepo            *repositories.UserRepository
	auditService        *AuditService
	notificationService *NotificationService
}

func NewSupportService(ticketRepo *repositories.SupportTicketRepository, userRepo *repositories.UserRepository, auditService *AuditService, notificationService *NotificationService) *SupportService {
	return &SupportService{
		ticketRepo:          ticketRepo,
		userRepo:            userRepo,
		auditService:        auditService,
		notificationService: notificationService,
	}
}

func (s *SupportService) CreateTicket(ctx context.Context, userID primitive.ObjectID, subject, description, category string, attachments []string) (*models.SupportTicket, error) {
	user, err := s.userRepo.FindByID(userID.Hex())
	if err != nil {
		return nil, err
	}

	ticket := &models.SupportTicket{
		UserID:      userID,
		UserName:    user.FullName,
		UserEmail:   user.Email,
		Subject:     subject,
		Description: description,
		Category:    category,
		Status:      models.TicketStatusOpen,
		Priority:    models.PriorityMedium,
		Attachments: attachments,
	}

	ticket, err = s.ticketRepo.Create(ctx, ticket)
	if err == nil {
		_ = s.auditService.Log(ticket.UserID.Hex(), ticket.UserName, "USER", "TICKET_CREATED", ticket.ID.Hex(), "SUPPORT_TICKET", 
			fmt.Sprintf("New support ticket created: %s", ticket.Subject), nil, bson.M{"category": ticket.Category, "priority": ticket.Priority, "details": ticket.Description})
	}

	return ticket, err
}

func (s *SupportService) GetUserTickets(ctx context.Context, userID primitive.ObjectID) ([]models.SupportTicket, error) {
	return s.ticketRepo.FindByUserID(ctx, userID)
}

func (s *SupportService) GetTicketByID(ctx context.Context, ticketID string) (*models.SupportTicket, error) {
	id, err := primitive.ObjectIDFromHex(ticketID)
	if err != nil {
		return nil, err
	}
	return s.ticketRepo.GetByID(ctx, id)
}

func (s *SupportService) GetTickets(ctx context.Context, status string) ([]models.SupportTicket, error) {
	filter := bson.M{}
	if status != "" && status != "ALL" {
		filter["status"] = status
	}
	return s.ticketRepo.FindAll(ctx, filter)
}

func (s *SupportService) UpdateTicketStatus(ctx context.Context, ticketIDStr string, status models.TicketStatus, adminID string) error {
	id, err := primitive.ObjectIDFromHex(ticketIDStr)
	if err != nil {
		return err
	}

	// Fetch current ticket to check transitions
	ticket, err := s.ticketRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	update := bson.M{"status": status}
	now := time.Now()

	// US-12.6 AC 3: SLA Tracking
	if ticket.Status == models.TicketStatusOpen && status == models.TicketStatusInProgress {
		update["first_response_at"] = now
	}
	if status == models.TicketStatusResolved || status == models.TicketStatusClosed {
		update["resolved_at"] = now
	}

	err = s.ticketRepo.Update(ctx, id, update)
	if err == nil {
		// Notify user of status change
		_ = s.notificationService.SendNotification(ctx, ticket.UserID.Hex(), models.NotificationTypeSystem, 
			"Ticket Status Updated", 
			fmt.Sprintf("Your ticket '%s' is now %s", ticket.Subject, status),
			map[string]interface{}{"ticketId": ticketIDStr, "status": status, "url": "/support?ticketId=" + ticketIDStr},
			nil)

		// US-12.5: Fail-Safe Audit
		return s.auditService.Log(adminID, "Admin", "Support", "TICKET_STATUS_UPDATE", ticketIDStr, "SUPPORT_TICKET", 
			fmt.Sprintf("Ticket status updated from %s to %s", ticket.Status, status), nil, update)
	}
	return err
}

func (s *SupportService) AddComment(ctx context.Context, ticketIDStr, authorID, authorName, role, message string, attachments []string) error {
	id, err := primitive.ObjectIDFromHex(ticketIDStr)
	if err != nil {
		return err
	}

	ticket, err := s.ticketRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if ticket.Status == models.TicketStatusResolved || ticket.Status == models.TicketStatusClosed {
		return fmt.Errorf("cannot add comment to a %s ticket", ticket.Status)
	}

	comment := models.SupportComment{
		AuthorID:    authorID,
		AuthorName:  authorName,
		Role:        role,
		Message:     message,
		Attachments: attachments,
	}

	err = s.ticketRepo.AddComment(ctx, id, comment)
	if err == nil {
		logAction := "TICKET_COMMENT_ADDED"
		if role == "ADMIN" {
			logAction = "ADMIN_TICKET_REPLY"
			// Automatically move to IN_PROGRESS if admin replies to an OPEN ticket
			ticket, _ := s.ticketRepo.GetByID(ctx, id)
			if ticket.Status == models.TicketStatusOpen {
				_ = s.UpdateTicketStatus(ctx, ticketIDStr, models.TicketStatusInProgress, authorID)
			}
		}
		
		_ = s.auditService.Log(authorID, authorName, role, logAction, ticketIDStr, "SUPPORT_TICKET", 
			fmt.Sprintf("Comment added to ticket by %s", authorName), nil, bson.M{"role": role, "details": message})

		// Notify user if admin replied
		if role == "ADMIN" {
			ticket, _ := s.ticketRepo.GetByID(ctx, id)
			_ = s.notificationService.SendNotification(ctx, ticket.UserID.Hex(), models.NotificationTypeSystem,
				"New Support Message",
				fmt.Sprintf("Support has replied to your ticket: %s", ticket.Subject),
				map[string]interface{}{"ticketId": ticketIDStr, "url": "/support?ticketId=" + ticketIDStr},
				nil)
		}
	}
	return err
}

func (s *SupportService) GetTicketStats(ctx context.Context) (map[string]int64, error) {
	tickets, err := s.ticketRepo.FindAll(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	stats := map[string]int64{
		"OPEN":        0,
		"IN_PROGRESS": 0,
		"RESOLVED":    0,
		"CLOSED":      0,
	}

	for _, t := range tickets {
		stats[string(t.Status)]++
	}
	return stats, nil
}
