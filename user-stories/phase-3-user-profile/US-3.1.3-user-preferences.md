# US-3.1.3 - User Preferences & System Defaults

**Epic:** User Profile & Personalization
**Phase:** Phase 3 - User Profile
**Status:** Not Started

## User Story

As an efficient trader
I want to set my default trading preferences (lot size, risk level) and system settings (theme, notifications)
So that I can optimize my trading workflow and app experience.

## Acceptance Criteria

- [ ] Users can set a "Default Order Quantity" that pre-fills the trade form.
- [ ] Users can select their "Risk Tolerance Level" (Low, Medium, High).
- [ ] Users can toggle system-wide preferences like Dark/Light mode (persisted to profile).
- [ ] Users can enable/disable specific notification types.

## Technical Requirements

### Backend
- Update `User` model to include a `Preferences` field (JSON/BSON object).
- Update profile API to handle preference synchronization.

### Frontend
- `PreferencesForm` in the profile feature.
- Integration with the global theme provider to reflect theme preference instantly.
- Context/Store to manage and provide preferences across the app.

## Dependencies

- US-3.1.1-identity-branding

## Implementation Notes

- Default order quantity should be validated against instrument-specific lot sizes in future phases.

## Testing Requirements

- Unit tests for preference persistence.
- UI validation for default value pre-filling.

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
