# US-3.1.1 - Personal Identity & Branding

**Epic:** User Profile & Personalization
**Phase:** Phase 3 - User Profile
**Status:** Not Started

## User Story

As a registered trader
I want to manage my personal identity (Full Name, Display Name, Bio) and upload an avatar
So that I can personalize my presence on the platform and be recognized by other participants.

## Acceptance Criteria

- [ ] Users can view their current profile details in a dedicated profile section.
- [ ] Users can edit their Full Name, Display Name, and Bio/Tagline.
- [ ] Users can upload an image as their profile avatar.
- [ ] Profile updates are persisted to the backend.
- [ ] Display Name is used in the header and other UI components instead of just the email prefix.

## Technical Requirements

### Backend
- Update `User` model in `models/user.go` to include `FullName`, `DisplayName`, `Bio`, and `AvatarURL`.
- Implement `GET /api/user/profile` to fetch current user's profile.
- Implement `PUT /api/user/profile` to update profile details.
- Implement file upload handling for avatars (S3/Local storage/Cloudinary - depending on requirements, likely local/mock for now).

### Frontend
- New `features/profile` directory.
- `ProfileView` component to display info.
- `ProfileEditForm` with validation for name and bio length.
- Avatar upload/preview component.
- Update `useAuth` hook/store to sync profile changes.

## Dependencies

- US-0.1.3-authentication-session

## Implementation Notes

- Display Name should be unique or handled gracefully if duplicates are allowed.
- Avatar images should be resized/optimized on upload.

## Testing Requirements

- Unit tests for profile update business logic.
- Integration tests for profile API endpoints.
- E2E scenario for updating profile and seeing changes reflected in the header.

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
