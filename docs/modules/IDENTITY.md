# Module: Identity & Access Management

## 1. Overview
The **Identity Module** (Auth & User) handles user onboarding, secure authentication, and profile management. It ensures that every trade is linked to a verified user and that financial data is protected via industry-standard security protocols.

**Key Services:**
- [`AuthService`](backend/internal/services/auth_service.go): Registration, Login, and JWT generation.
- [`UserService`](backend/internal/services/user_service.go): Profile and preference management.

---

## 2. Authentication Flow

Aequitas uses **Stateless JWT (JSON Web Token)** authentication to ensure scalability across multiple server instances.

### 2.1 The Registration Pipeline
When a user registers:
1.  **Validation**: Checks email format and password strength (min 8 chars).
2.  **Hashing**: Passwords are never stored in plain text. We use `bcrypt` with a cost factor of 12.
3.  **Persistence**: User record created in MongoDB.
4.  **Auto-Provisioning**: The `AuthService` makes a cross-service call to `TradingAccountService` to create a default wallet with ₹1,000,000 (demo funds).

### 2.2 Login & Token Issue
Upon successful login:
- A JWT is generated containing `userID`, `email`, and `isAdmin` claims.
- The token is signed using a secret key defined in `.env`.
- The token is returned to the client and stored in `localStorage` (or Secure Cookies in production).

---

## 3. Authorization & Middleware

Security is enforced at the route level using Go middleware.

### 3.1 Auth Middleware
**File:** `backend/internal/middleware/auth_middleware.go`
- **Logic**: Extracts the `Authorization: Bearer <token>` header.
- **Verification**: Validates the signature and expiry.
- **Context Injection**: Injects the `userID` into the Go `context.Context`. Downstream services (e.g., `OrderService`) retrieve the ID using `ctx.Value`.

---

## 4. User Profile & Preferences

### 4.1 Profiles
Users can manage their `FullName`, `DisplayName`, and `Avatar`. These are stored in the `users` collection and used across the UI (e.g., "Welcome, [Name]").

### 4.2 Preferences
Stored as a nested object in the user document. Includes:
- `Theme` (Dark/Light).
- `NotificationSettings`: Toggles for order fills, price alerts, etc.

---

## 5. Security Best Practices

1.  **Strict Validation**: All input is sanitized via the `UserService`.
2.  **Password Masking**: Passwords are excluded from JSON responses using the ``bson:"password" json:"-"`` tag in the model.
3.  **Last Login Tracking**: We record `LastLoginIP` and `LastLoginAt` to help users identify unauthorized access.

---

## 6. Developer Guide

### Onboarding New Auth Features
- **If adding a new field (e.g., Phone Number)**:
    1. Update `models/user.go`.
    2. Update `UpdateProfile` in `UserService`.
- **If changing JWT logic**:
    1. Modify `internal/utils/jwt.go`.
    2. Restart the backend to reload the Secret Key.

### Common Issues
- **"Token Expired"**: Our default expiry is 24 hours. The frontend should handle 401 errors by redirecting to `/login`.
- **"Invalid Signature"**: Usually occurs if the `JWT_SECRET` in `.env` was changed while tokens were still active in users' browsers.
