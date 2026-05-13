# US-3.2 - Enhanced Profile Overview & Trading Identity Card

**Epic:** User Profile & Personalization v2
**Phase:** Phase 3 - User Profile (Enhancement)
**Status:** Planned

## User Story

As a trader
I want a visually rich profile overview that shows my trading identity, key performance stats, and account health at a glance
So that I can quickly assess my standing and feel engaged with the platform.

## Problem Statement

The current profile page (`Trader Settings`) is purely a settings form. It offers no overview of who the trader is or how they are performing. There is no "home" on the profile that gives a snapshot of trading identity + performance before diving into settings tabs.

## Acceptance Criteria

- [ ] A profile "hero card" is shown at the top of the profile page containing:
  - Avatar (with upload-in-place support)
  - Full Name + Display Name
  - Member Since date
  - Account status badge (Active / Suspended)
  - A short bio/tagline (editable inline)
- [ ] Below the hero card, a row of KPI chips/tiles showing:
  - Total Trades Placed (all time)
  - Win Rate % (profitable closed trades / total closed trades)
  - Total Realized P&L (formatted in ₹)
  - Current Account Balance
- [ ] KPIs are fetched from the backend and cached, with a refresh button
- [ ] The layout is responsive; on mobile, KPI tiles stack vertically
- [ ] The existing tab navigation (Identity / Security / Preferences / Finance) remains below this new overview section

## Technical Requirements

### Backend
- New endpoint: `GET /api/user/profile/stats` returning:
  ```json
  {
    "totalTrades": 0,
    "winRate": 0.0,
    "totalRealizedPL": 0.0,
    "memberSince": "ISO-8601"
  }
  ```
- Win rate = (profitable trades / total closed trades) * 100
- Profitable trade = a trade where realized P&L > 0

### Frontend
- New `ProfileHeroCard` component (max 150 LOC)
- New `ProfileKPITiles` component (max 100 LOC)
- New `useProfileStats` hook to fetch and cache KPI data
- Inline bio editing: clicking bio text opens a small text field; save on blur/Enter

## Dependencies

- US-3.1.1-identity-branding (profile data)
- US-3.1.4-account-finances (account balance)
- Trade history data from matching engine

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-05-13 | AI Assistant | Initial creation |
