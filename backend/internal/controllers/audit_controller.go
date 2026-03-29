package controllers

import (
	"encoding/json"
	"net/http"

	"aequitas/internal/services"
)

type AuditController struct {
	auditService *services.AuditService
}

func NewAuditController(auditService *services.AuditService) *AuditController {
	return &AuditController{auditService: auditService}
}

func (c *AuditController) GetLogs(w http.ResponseWriter, r *http.Request) {
	logs, err := c.auditService.GetLogs(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "success",
		"data":   logs,
	})
}
