# US-3.3 - Granular Notification Preferences

**Epic:** User Profile & Personalization v2
**Phase:** Phase 3 - User Profile (Enhancement)
**Status:** Planned

## User Story

As a trader who values signal over noise
I want fine-grained control over exactly which notifications I receive and how they are delivered
So that I am not overwhelmed with irrelevant alerts and never miss a critical trade event.

## Problem Statement

The current preferences tab has a single on/off toggle for "System Notifications" — a coarse control that forces an all-or-nothing choice. Traders have very different needs: some want every execution ping, others only want margin calls and order rejections.

## Acceptance Criteria

- [ ] The Preferences tab "Alerts & Notifications" section is replaced with a structured matrix of notification categories, each independently togglable:

  | Category | In-App Bell | (Future: Email) |
  |---|---|---|
  | Order Filled | ✓ | — |
  | Order Rejected | ✓ | — |
  | Order Cancelled | ✓ | — |
  | Margin Call Warning | ✓ | — |
  | Position Auto-Liquidated | ✓ | — |
  | Funds Deposited | ✓ | — |
  | Price Alert Triggered | ✓ | — |
  | Support Ticket Updated | ✓ | — |
  | System Announcements | ✓ | — |

- [ ] A "Mute All" master switch exists that disables all in-app notifications without losing individual preferences
- [ ] Preferences are persisted to the backend on save
- [ ] Changes take effect immediately without requiring a page reload
- [ ] A preview chip shows "X of 9 alerts enabled" to summarise current state

## Technical Requirements

### Backend
- Extend `User.Preferences` model to include `NotificationSettings` map:
  ```go
  type NotificationSettings struct {
    OrderFilled          bool `bson:"order_filled" json:"orderFilled"`
    OrderRejected        bool `bson:"order_rejected" json:"orderRejected"`
    OrderCancelled       bool `bson:"order_cancelled" json:"orderCancelled"`
    MarginCallWarning    bool `bson:"margin_call_warning" json:"marginCallWarning"`
    AutoLiquidation      bool `bson:"auto_liquidation" json:"autoLiquidation"`
    FundsDeposited       bool `bson:"funds_deposited" json:"fundsDeposited"`
    PriceAlertTriggered  bool `bson:"price_alert_triggered" json:"priceAlertTriggered"`
    SupportTicketUpdated bool `bson:"support_ticket_updated" json:"supportTicketUpdated"`
    SystemAnnouncements  bool `bson:"system_announcements" json:"systemAnnouncements"`
    MuteAll              bool `bson:"mute_all" json:"muteAll"`
  }
  ```
- `NotificationService.SendNotification()` must check user's per-category preference before dispatching
- `PUT /api/user/preferences` updated to accept new structure (backwards-compatible default: all enabled)

### Frontend
- Refactor `UserPreferences.tsx` notifications section into a new `NotificationPreferencesPanel` component
- Matrix rendered as `Switch` rows grouped by category
- `useNotificationPreferences` hook to manage local state and persist on save
- Global notification store (`useNotificationStore`) must react to preference changes and filter the bell dropdown

## Dependencies

- US-3.1.3-user-preferences
- Phase 7 Notification system

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-05-13 | AI Assistant | Initial creation |
