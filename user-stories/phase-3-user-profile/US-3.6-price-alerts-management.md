# US-3.6 - Price Alerts Management

**Epic:** User Profile & Personalization v2
**Phase:** Phase 3 - User Profile (Enhancement)
**Status:** Planned

## User Story

As a trader who cannot watch the market all day
I want to create, view, and manage price alerts for instruments directly from my profile
So that I get notified when a stock hits my target price without having to monitor it constantly.

## Problem Statement

Currently there is no price alert system. Traders must manually check instruments to see if prices have moved to their targets. This is a fundamental QoL feature for any trading platform.

## Acceptance Criteria

### Creating an Alert
- [ ] From the Instrument Detail page, a user can click "Set Alert" to open an alert creation dialog with:
  - Price condition: "Goes above ₹___" or "Goes below ₹___"
  - Note / label (optional, e.g., "My entry target")
  - Expiry: Never / End of Day / Custom Date
- [ ] Alerts can also be created from a dedicated "My Alerts" tab in the user profile

### Alert Lifecycle
- [ ] Alerts have statuses: **Active**, **Triggered**, **Expired**, **Cancelled**
- [ ] When triggered, a bell notification is dispatched and the alert status changes to "Triggered"
- [ ] Triggered alerts are never auto-deleted; they remain in history with a "Triggered at" timestamp

### Profile "My Alerts" Tab
- [ ] A new tab "Alerts" is added to the profile page tab bar
- [ ] A table of all alerts (Active / Triggered / Expired) with:
  - Symbol + instrument name
  - Condition (e.g., "TATAMOTORS > ₹1,050")
  - Status chip
  - Triggered At (if applicable)
  - Expiry
  - Actions: Edit (Active only), Cancel (Active only)
- [ ] Filter by status (All / Active / Triggered / Expired)
- [ ] Bulk cancel all active alerts

## Technical Requirements

### Backend
- New `PriceAlert` model:
  ```go
  type PriceAlert struct {
    ID           primitive.ObjectID `bson:"_id,omitempty"`
    UserID       primitive.ObjectID `bson:"user_id"`
    InstrumentID primitive.ObjectID `bson:"instrument_id"`
    Symbol       string             `bson:"symbol"`
    Condition    string             `bson:"condition"`  // "ABOVE" | "BELOW"
    TargetPrice  float64            `bson:"target_price"`
    Note         string             `bson:"note,omitempty"`
    Status       string             `bson:"status"`     // "ACTIVE" | "TRIGGERED" | "EXPIRED" | "CANCELLED"
    ExpiresAt    *time.Time         `bson:"expires_at,omitempty"`
    TriggeredAt  *time.Time         `bson:"triggered_at,omitempty"`
    CreatedAt    time.Time          `bson:"created_at"`
  }
  ```
- Alert evaluation runs in the market data tick processor (already polling at regular intervals)
- New endpoints:
  - `GET /api/alerts` — list user's alerts
  - `POST /api/alerts` — create alert
  - `PUT /api/alerts/:id` — edit alert
  - `DELETE /api/alerts/:id` — cancel alert
  - `DELETE /api/alerts` — bulk cancel all active alerts

### Frontend
- New `profile/alerts/` feature sub-directory
- `AlertsTab` container component
- `AlertsTable` component (using `CustomGrid`)
- `CreateAlertDialog` component
- `useAlerts` hook
- `alertService` for API calls
- `SetAlertButton` micro-component added to `InstrumentDetail` header area

## Dependencies

- US-3.1.1-identity-branding (profile tab framework)
- Phase 7 Notification system
- Phase 1 Market Data (instrument + price data)

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-05-13 | AI Assistant | Initial creation |
