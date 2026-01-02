# US-0.1.3 - Authentication & Session

**Epic:** EPIC 0.1 - User & Account Foundation  
**Phase:** Phase 0 - Foundation (Non-Negotiable)  
**Status:** Not Started

## User Story

As a **user**  
I want to **securely log in**  
So that **my account is protected**

## Acceptance Criteria

- [x] JWT-based authentication
- [x] Session expiry (configurable, default 24 hours)
- [x] Logout supported (client-side token removal)
- [x] Login with email + password
- [x] Invalid credentials return error
- [x] Token includes user ID and expiry
- [x] Protected routes require valid token
- [x] Expired tokens rejected
- [x] Refresh token mechanism (optional for Phase 0)

## Technical Requirements

### Backend (Go + MongoDB)

**API Endpoints:**
- `POST /api/auth/login`
  - Request: `{ "email": "user@example.com", "password": "password123" }`
  - Response: `{ "token": "jwt-token", "user": { ... } }`
- `POST /api/auth/logout` (optional - client-side token removal)
- `POST /api/auth/refresh` (optional - refresh token)

**Business Logic (AuthService):**
- `Login(email, password) (token string, user *User, error)`
  - Find user by email
  - Verify password using bcrypt
  - Generate JWT token with user ID and expiry
  - Return token and user data

**JWT Token Structure:**
```go
type Claims struct {
    UserID string `json:"userId"`
    Email  string `json:"email"`
    jwt.StandardClaims
}
```

**Middleware (AuthMiddleware):**
- Extract token from Authorization header
- Validate token signature
- Check token expiry
- Extract user ID from claims
- Attach user ID to request context
- Reject invalid/expired tokens

**Validation Rules:**
- Email must exist
- Password must match hashed password
- Token must be valid and not expired

**Environment Variables:**
```
JWT_SECRET=your-secret-key
JWT_EXPIRY_HOURS=24
```

### Frontend (TypeScript + React)

**Components:**
- `LoginForm.tsx` - Login form UI (50-100 lines)
  - Email input
  - Password input
  - Submit button
  - Link to registration
  - Error message display
  - Remember me (optional)

**Hooks:**
- `useAuth.ts` - Authentication state and actions (< 200 lines)
  - `login(email, password)`
  - `logout()`
  - `isAuthenticated`
  - `user`
  - Token storage/retrieval
  - Auto-logout on expiry

**Services:**
- `authService.ts` - API integration
  - `login(email: string, password: string): Promise<AuthResponse>`
  - `logout(): void`
  - Token management

**API Client (lib/api/apiClient.ts):**
- Request interceptor: Add Authorization header
- Response interceptor: Handle 401 errors (auto-logout)

**Types:**
```typescript
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}
```

**State Management:**
- Global auth state (Zustand/Redux)
  - `user: User | null`
  - `token: string | null`
  - `isAuthenticated: boolean`
- Token stored in localStorage/sessionStorage
- Auto-load token on app initialization

**Protected Routes:**
```typescript
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
```

## Dependencies

**Upstream:**
- US-0.1.1 (User Registration) - creates user credentials

**Downstream:**
- All protected features require authentication
- US-2.1.1 (Add Funds) - requires authenticated user
- US-3.1.1 (Place Order) - requires authenticated user

## Implementation Notes

### Security Considerations
- **JWT Secret**: Store in environment variable, never commit to code
- **HTTPS Only**: Tokens should only be transmitted over HTTPS
- **HttpOnly Cookies** (alternative): More secure than localStorage
- **Token Expiry**: Balance security vs UX (24 hours default)
- **Password Hashing**: Use bcrypt with cost factor 14
- **Rate Limiting**: Prevent brute force attacks (max 5 attempts per minute)

### Edge Cases
- Invalid email (user not found)
- Incorrect password
- Expired token during active session
- Token tampering (invalid signature)
- Concurrent logins from multiple devices
- Network failures during login
- Token storage unavailable (private browsing)

### Performance Considerations
- Cache user data after login
- Validate token on client before API calls
- Lazy load user data on app initialization

### Error Messages
- "Invalid email or password" - generic for security
- "Session expired. Please log in again" - expired token
- "Login failed. Please try again" - generic server error

### Token Management
- Store token in localStorage (or sessionStorage for session-only)
- Clear token on logout
- Auto-attach token to all API requests
- Auto-logout on 401 response

## Testing Requirements

### Backend Unit Tests
- ✅ Login with valid credentials succeeds
- ✅ Login with invalid email returns error
- ✅ Login with incorrect password returns error
- ✅ JWT token generated with correct claims
- ✅ JWT token expiry set correctly
- ✅ Password verification works

### Backend Integration Tests
- ✅ POST /api/auth/login with valid credentials returns token
- ✅ POST /api/auth/login with invalid credentials returns 401
- ✅ Protected endpoints reject requests without token
- ✅ Protected endpoints reject expired tokens
- ✅ Protected endpoints accept valid tokens

### Frontend Unit Tests
- ✅ LoginForm validates email format
- ✅ LoginForm calls authService.login on submit
- ✅ useAuth stores token on successful login
- ✅ useAuth clears token on logout
- ✅ ProtectedRoute redirects unauthenticated users

### E2E Tests
- ✅ User can log in with valid credentials
- ✅ User redirected to dashboard after login
- ✅ User sees error for invalid credentials
- ✅ User can log out
- ✅ User redirected to login after logout
- ✅ Protected pages redirect to login when not authenticated
- ✅ Token persists across page refreshes

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-02 | ChatGPT Assisted | Initial creation |
