package utils

type ContextKey string

const (
	UserIDKey         ContextKey = "userID"
	IsAdminKey        ContextKey = "isAdmin"
	UserRoleKey       ContextKey = "userRole"
	UserNameKey       ContextKey = "userName"
	UserEmailKey      ContextKey = "userEmail"
	StepUpVerifiedKey ContextKey = "stepUpVerified"
	CorrelationIDKey  ContextKey = "correlationID"
)
