package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"aequitas/internal/config"
)

type CommunicationProvider interface {
	SendEmail(recipientEmail, subject, htmlContent string) error
}

type BrevoProvider struct {
	cfg *config.Config
}

func NewBrevoProvider(cfg *config.Config) *BrevoProvider {
	return &BrevoProvider{cfg: cfg}
}

type brevoEmailRecipient struct {
	Email string `json:"email"`
	Name  string `json:"name,omitempty"`
}

type brevoEmailSender struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type brevoEmailRequest struct {
	Sender      brevoEmailSender     `json:"sender"`
	To          []brevoEmailRecipient `json:"to"`
	Subject     string               `json:"subject"`
	HtmlContent string               `json:"htmlContent"`
}

func (p *BrevoProvider) SendEmail(recipientEmail, subject, htmlContent string) error {
	if p.cfg.BrevoAPIKey == "" {
		// Fallback to console log if no API key is provided
		fmt.Printf("\n--- [MOCK EMAIL] ---\nTo: %s\nSubject: %s\nContent: %s\n--------------------\n\n", recipientEmail, subject, htmlContent)
		return nil
	}

	url := "https://api.brevo.com/v3/smtp/email"
	payload := brevoEmailRequest{
		Sender: brevoEmailSender{
			Name:  p.cfg.BrevoSenderName,
			Email: p.cfg.BrevoSenderEmail,
		},
		To: []brevoEmailRecipient{
			{Email: recipientEmail},
		},
		Subject:     subject,
		HtmlContent: htmlContent,
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("accept", "application/json")
	req.Header.Set("api-key", p.cfg.BrevoAPIKey)
	req.Header.Set("content-type", "application/json")

	// Debug log
	fmt.Printf("[Brevo SMTP] Initiating request to %s via %s (Subject: %s)\n", recipientEmail, p.cfg.BrevoSenderEmail, subject)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("[Brevo SMTP Error] Network/Request error: %v\n", err)
		return err
	}
	defer resp.Body.Close()

	fmt.Printf("[Brevo SMTP Response] Status: %s\n", resp.Status)

	if resp.StatusCode >= 400 {
		var errResp interface{}
		json.NewDecoder(resp.Body).Decode(&errResp)
		fmt.Printf("[Brevo Error] Received status %d: %v\n", resp.StatusCode, errResp)
		return fmt.Errorf("brevo api error (status %d): %v", resp.StatusCode, errResp)
	}

	return nil
}
