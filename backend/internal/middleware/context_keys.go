package middleware

type contextKey string

const (
	UserIDKey          contextKey = "userID"
	IsAdminKey         contextKey = "isAdmin"
	UserRoleKey        contextKey = "userRole"
	StepUpVerifiedKey  contextKey = "stepUpVerified"
)
