# US-3.5 - Login Activity & Active Sessions Management

**Epic:** User Profile & Personalization v2
**Phase:** Phase 3 - User Profile (Enhancement)
**Status:** Planned

## User Story

As a security-conscious trader
I want to see a full history of my recent login events and manage any active sessions
So that I can detect unauthorized access and remotely terminate suspicious sessions.

## Problem Statement

The current Security tab shows only a single "Last Login" timestamp and IP. This is insufficient — a trader cannot see if someone else is also logged into their account, cannot see which device/browser a session originated from, and cannot revoke access without changing their password.

## Acceptance Criteria

### Login History Log
- [ ] A table showing the last 10 login events with:
  - Timestamp (date + time)
  - IP Address
  - Browser / User Agent (parsed into a human-readable label: e.g., "Chrome on Windows")
  - Status: Success / Failed
  - Location (if available from IP geolocation — city, country)
- [ ] Failed login attempts shown in a muted red row style
- [ ] Sortable by timestamp (descending by default)

### Active Sessions
- [ ] A list of currently active sessions (where JWT has not expired):
  - Device/Browser label
  - IP Address
  - Session created at
  - Last activity
  - "This device" badge on current session
- [ ] A "Terminate" button on each non-current session
- [ ] A "Terminate All Other Sessions" button at the top
- [ ] Terminating a session immediately invalidates its JWT on the backend

## Technical Requirements

### Backend
- New `LoginEvent` model:
  ```go
  type LoginEvent struct {
    ID        primitive.ObjectID `bson:"_id,omitempty"`
    UserID    primitive.ObjectID `bson:"user_id"`
    Timestamp time.Time          `bson:"timestamp"`
    IP        string             `bson:"ip"`
    UserAgent string             `bson:"user_agent"`
    Success   bool               `bson:"success"`
    Location  string             `bson:"location,omitempty"` // "Mumbai, IN"
  }
  ```
- Record login events in `AuthService.Login()` (both success and failure)
- New endpoint: `GET /api/user/login-history?limit=10`
- Session tracking: store JWT `jti` (JWT ID) per session in a `sessions` collection
- New endpoint: `DELETE /api/user/sessions/:sessionId` — invalidates a specific session
- New endpoint: `DELETE /api/user/sessions` — invalidates all sessions except current

### Frontend
- New `LoginHistoryTable` component under Security tab
- New `ActiveSessionsList` component under Security tab
- `useLoginActivity` hook
- JWT `jti` must be included in all requests so the backend can identify the current session

## Dependencies

- US-3.1.2-account-security
- Auth/JWT infrastructure (Phase 0)

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-05-13 | AI Assistant | Initial creation |
