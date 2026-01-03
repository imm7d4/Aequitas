# US-0.2.1 - Global Layout & Navigation Shell

**Epic:** EPIC 0.2 - Shell & Navigation  
**Phase:** Phase 0 - Foundation  
**Status:** Completed

## User Story

As a **trader**  
I want a **consistent global header and sidebar**  
So that I can **navigate between features and access important tools from any page**

## Acceptance Criteria

- [x] **Responsive Header**:
    - [x] App Logo and Name that links to Dashboard.
- [x] **Enterprise Global Search**:
    - [x] Debounced API requests (300ms).
    - [x] **Recent Searches**: Show last 5 searched instruments when focused (persisted in `localStorage`).
    - [x] **Keyboard Shortcuts**: `/` or `Ctrl + K` to focus and open search from anywhere.
    - [x] **Smart Ranking**: Prioritize Symbol matches > Name matches > Exchange matches.
    - [x] **Direct Actions**: Support navigating to detail or opening "Quick Trade" directly from results.
- [x] **Notification Center**: Bell icon with a badge showing unread notifications.
- [x] **Header Market Status & Clock**:
    - [x] **Market Status**: Right-aligned display of the current exchange status (e.g., "NSE: OPEN").
    - [x] **Server Clock**: Real-time ticker synchronized with the server's `currentTime`.
- [x] **User Profile**: Displays user initials/avatar and name; clicking opens a menu with "Profile Settings" and "Logout".
- [x] **Side Navigation Bar**:
    - [x] Navigation links for core features.
    - [x] **Contextual Highlighting**: Active route is clearly visible.
    - [x] **Collapsible State**: Sidebar can be collapsed to icons-only view.
    - [x] **Sidebar Tooltips**: Show item labels as tooltips when the sidebar is collapsed for better UX.
- [x] **Layout Integration**:
    - [x] Protected routes are wrapped in this layout shell.
    - [x] Responsive design (Header/Sidebar adapted for mobile/tablet views).

## Technical Requirements

### Backend (Go + MongoDB)
- **Search API**: Leverage `/api/instruments/search` for global lookup.

### Frontend (TypeScript + React)
- **Search Logic**:
    - `localStorage` persistence for history.
    - Custom ranking algorithm in `Header.tsx`.
    - Global key listener for shortcuts.
- **UI Components (MUI)**:
    - `Layout.tsx`: Master wrapper.
    - `Header.tsx`: Enterprise Search & Profile.
    - `Sidebar.tsx`: Navigation & Collapsible logic.

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Implemented enterprise search features |
| 2026-01-03 | AI Assistant | Initial shell implementation |
