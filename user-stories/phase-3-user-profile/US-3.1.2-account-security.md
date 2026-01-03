# US-3.1.2 - Account Security & Password Management

**Epic:** User Profile & Personalization
**Phase:** Phase 3 - User Profile
**Status:** Completed

## User Story

As a security-conscious trader
I want to update my account password and view my recent login activity
So that I can keep my account secure.

## Acceptance Criteria

- [x] Users can update their password by providing their current password and a new, strong password.
- [x] Password update requires validation (min length, complexity).
- [x] Users can view their "Last Login" time and IP address in the security section.
- [x] Users receive a notification (or UI confirmation) after a successful password change.

## Technical Requirements

### Backend
- Implement `PUT /api/user/password` endpoint.
- Add password validation logic in the `UserService`.
- Ensure old password is verified before allowing update.
- (Future) Track login history in a separate collection/table.

### Frontend
- `SecuritySettings` component in the profile feature.
- Change Password form with "current password", "new password", and "confirm password" fields.
- Password strength meter.

## Dependencies

- US-0.1.3-authentication-session

## Implementation Notes

- Logout user from other sessions (invalidate other tokens) if password is changed (Security best practice).

## Testing Requirements

- Unit tests for password hashing and validation.
- Integration tests for password update endpoint.
- Manual verification of "wrong current password" error handling.

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
