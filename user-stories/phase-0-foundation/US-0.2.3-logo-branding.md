# US-0.2.3 - Logo & Branding

**Epic:** EPIC 0.2 - Shell & Navigation  
**Phase:** Phase 0 - Foundation  
**Status:** Completed

## User Story

As a user, I want to see consistent branding across the platform so that I feel a sense of identity and professionalism while using the application.

## Acceptance Criteria

### Logo Placement
- [x] **Global Header**: The full brand logo (Icon + Text) must be visible in the top-left of the Header.
- [x] **Sidebar Branding**: The logo must be present at the bottom of the sidebar.

### Responsive Behavior (Sidebar)
- [x] **Collapsed State**: Only the brand icon (square logo) should be visible when the sidebar is minimized.
- [x] **Expanded State**: The full brand logo (Icon + Text) should be visible when the sidebar is expanded.
- [x] **Transitions**: Logo state changes should transition smoothly with the sidebar expansion/contraction.

### Accessibility & Interaction
- [x] **Alt Text**: Logos must have proper `alt` descriptions ("Aequitas Logo").
- [x] **Home Link**: Clicking the header logo should navigate the user to the Dashboard.

## Implementation Details
- Asset Folder: `frontend/src/assets/logo/`
- Required Files: `logo-full.png`, `logo-icon.png`
- Styling: Ensure consistent height/aspect-ratio across all placements.
