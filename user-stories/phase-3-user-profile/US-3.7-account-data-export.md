# US-3.7 - Account Data Export & Download

**Epic:** User Profile & Personalization v2
**Phase:** Phase 3 - User Profile (Enhancement)
**Status:** Planned

## User Story

As a trader who wants to keep records
I want to download my trade history, transaction history, and portfolio snapshot as a CSV or PDF
So that I can maintain personal financial records, file taxes, or analyse my performance in external tools.

## Problem Statement

Currently there is no way to export data. All trade history, P&L records, and transaction logs live exclusively inside the platform. Users who want to use spreadsheets (Excel, Google Sheets) for deeper analysis or need documentation for tax purposes have no way to get this data out.

## Acceptance Criteria

### Export Options
- [ ] From the Finance tab, a user can download:
  - **Trade History CSV**: All executed trades with columns — Date, Symbol, Side, Intent, Qty, Price, Value, Commission, Net Value, P&L
  - **Transaction History CSV**: All wallet transactions — Date, Type, Amount, Reference, Status
- [ ] Export is available for custom date ranges:
  - Last 30 days / Last 90 days / This Financial Year / All Time / Custom Range
- [ ] Download starts immediately (streamed file, no email step)
- [ ] File naming convention: `aequitas_trades_2026-01-01_2026-05-13.csv`

### Export History (Optional, Phase 2)
- [ ] A log of previous export requests shown under the export section
- [ ] Each log entry shows: export type, date range, generated at, download button (re-download for 7 days)

## Technical Requirements

### Backend
- New endpoint: `GET /api/export/trades?from=ISO&to=ISO` — returns CSV file as attachment
- New endpoint: `GET /api/export/transactions?from=ISO&to=ISO` — returns CSV file as attachment
- CSV generation using Go's `encoding/csv` package
- Enforce user ownership — only the requesting user's data is exported
- Rate limit export endpoints (max 5 requests per hour per user)

### Frontend
- New `ExportSection` component inside `FinanceSettings`
- Date range picker using MUI `DatePicker` from `@mui/x-date-pickers`
- Export type selector (radio group)
- Download button triggers a `window.open()` or `<a>` download against the authenticated API URL
- Bearer token must be passed as query param or via a short-lived download token to handle file download auth

## Dependencies

- US-3.1.4-account-finances
- Trade and Transaction repositories

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-05-13 | AI Assistant | Initial creation |
