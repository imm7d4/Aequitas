# US-0.1.1 - User Registration

**Epic:** EPIC 0.1 - User & Account Foundation  
**Phase:** Phase 0 - Foundation (Non-Negotiable)  
**Status:** Completed

## User Story

As a **user**  
I want to **create an account**  
So that **I can access the trading platform**

## Acceptance Criteria

- [x] User can register with email + password
- [x] Unique user ID generated automatically
- [x] Account status set to ACTIVE by default
- [x] Email validation (proper format)
- [x] Password strength validation (minimum 8 characters)
- [x] Duplicate email prevention
- [x] Success response returns user data (excluding password)

## Technical Requirements

### Backend (Go + MongoDB)

**Model/Schema:**
```go
type User struct {
    ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Email     string             `bson:"email" json:"email"`
    Password  string             `bson:"password" json:"-"`
    Status    string             `bson:"status" json:"status"`
    CreatedAt time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt time.Time          `bson:"updated_at" json:"updatedAt"`
}
```

**API Endpoint:**
- `POST /api/auth/register`
- Request Body: `{ "email": "user@example.com", "password": "password123" }`
- Response: `{ "id": "...", "email": "...", "status": "ACTIVE", "createdAt": "..." }`

**Business Logic (AuthService):**
- Validate email format using regex
- Validate password length (min 8 characters)
- Check if user already exists (by email)
- Hash password using bcrypt
- Generate unique user ID
- Set status to "ACTIVE"
- Create user record
- Return user data (exclude password)

**Validation Rules:**
- Email must be valid format
- Email must be unique
- Password minimum 8 characters
- All fields required

### Frontend (TypeScript + React)

**Components:**
- `RegisterForm.tsx` - Registration form UI (50-100 lines)
- Form fields: email (text input), password (password input)
- Submit button
- Link to login page
- Error message display
- Success message/redirect

**Hooks:**
- `useRegister.ts` - Handle registration logic (< 200 lines)
  - Form state management
  - Validation
  - API call orchestration
  - Error handling
  - Success navigation

**Services:**
- `authService.ts` - API integration
  - `register(email: string, password: string): Promise<User>`

**Types:**
```typescript
export interface User {
  id: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
```

**State Management:**
- Local component state for form inputs
- Loading state during API call
- Error state for validation/API errors

## Dependencies

**Upstream:**
- None (first user story)

**Downstream:**
- US-0.1.2 (Trading Account Creation) - triggered after registration
- US-0.1.3 (Authentication) - uses created user credentials

## Implementation Notes

### Security Considerations
- Never return password in API response
- Use bcrypt with cost factor 14 for password hashing
- Implement rate limiting on registration endpoint (prevent abuse)
- Sanitize email input to prevent injection attacks

### Edge Cases
- Duplicate email registration attempt
- Invalid email formats (missing @, invalid domain)
- Weak passwords (too short, common passwords)
- Network failures during registration
- Database connection issues

### Performance Considerations
- Index on email field for fast duplicate checking
- Async password hashing to avoid blocking

### Error Messages
- "Email already registered" - duplicate email
- "Invalid email format" - malformed email
- "Password must be at least 8 characters" - weak password
- "Registration failed. Please try again" - generic server error

## Testing Requirements

### Backend Unit Tests
- ✅ Valid registration succeeds
- ✅ Duplicate email returns error
- ✅ Invalid email format returns error
- ✅ Short password returns error
- ✅ Password is hashed (not stored plain)
- ✅ User ID is generated
- ✅ Status defaults to ACTIVE

### Backend Integration Tests
- ✅ POST /api/auth/register with valid data creates user
- ✅ POST /api/auth/register with duplicate email returns 400
- ✅ POST /api/auth/register with invalid data returns 400

### Frontend Unit Tests
- ✅ Form validates email format
- ✅ Form validates password length
- ✅ Form shows error messages
- ✅ Form calls authService.register on submit

### E2E Tests
- ✅ User can complete registration flow
- ✅ User redirected to login/dashboard after registration
- ✅ Error messages displayed for invalid inputs
- ✅ Duplicate registration shows appropriate error

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-02 | ChatGPT Assisted | Initial creation |
| 2026-01-02 | Dharmesh | Completed implementation - User registration with validation and password hashing |
