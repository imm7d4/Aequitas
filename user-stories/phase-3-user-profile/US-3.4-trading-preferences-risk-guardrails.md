# US-3.4 - Trading Preferences & Default Order Configuration

**Epic:** User Profile & Personalization v2
**Phase:** Phase 3 - User Profile (Enhancement)
**Status:** Planned

## User Story

As an active trader
I want to configure default values for my order form (order type, quantity, validity) and set personal risk limits
So that my trade panel is pre-configured to my style and I never accidentally over-commit on a single position.

## Problem Statement

Currently there are no trading-specific preferences. Every time a trader opens the trade panel they start from defaults (Market order, quantity = 1). Power users who always trade Limit orders or always use IOC validity must manually change settings each time, creating friction and increasing the risk of order mistakes.

## Acceptance Criteria

### Default Order Settings
- [ ] User can set:
  - Default Order Type: Market / Limit / Stop / Trailing Stop
  - Default Validity: Day / IOC / GTD
  - Default Quantity: free-form integer (validated > 0)
- [ ] These defaults pre-fill the Trade Panel on every new instrument view
- [ ] Per-instrument overrides still take effect (instrument-level lot sizes)

### Risk Guardrails (Self-imposed limits)
- [ ] User can configure:
  - **Max Single Order Value (₹)**: If an order's estimated value exceeds this, show a confirmation dialog before placing
  - **Daily Loss Limit (₹)**: If today's realized + unrealized P&L goes below this negative threshold, show a persistent warning banner and optionally lock new orders
  - **Max Positions Open**: Warn when the user tries to open a new position beyond this count
- [ ] Risk guardrail state is shown as a compact "Risk Status" widget on the profile overview
- [ ] Guardrails are enforced **client-side** as warnings/confirmations only (not server-side hard blocks in this phase)

### UI
- [ ] New "Trading" tab added to the profile tab bar (alongside Identity / Security / Preferences / Finance)
- [ ] Settings grouped into two cards: "Order Defaults" and "Risk Guardrails"
- [ ] A reset-to-defaults button for each card

## Technical Requirements

### Backend
- Extend `User.Preferences` to include `TradingPreferences`:
  ```go
  type TradingPreferences struct {
    DefaultOrderType  string  `bson:"default_order_type" json:"defaultOrderType"`   // "MARKET"
    DefaultValidity   string  `bson:"default_validity" json:"defaultValidity"`       // "DAY"
    DefaultQuantity   int     `bson:"default_quantity" json:"defaultQuantity"`       // 1
    MaxOrderValue     float64 `bson:"max_order_value" json:"maxOrderValue"`          // 0 = disabled
    DailyLossLimit    float64 `bson:"daily_loss_limit" json:"dailyLossLimit"`        // 0 = disabled
    MaxOpenPositions  int     `bson:"max_open_positions" json:"maxOpenPositions"`    // 0 = disabled
  }
  ```

### Frontend
- New `TradingPreferencesTab` component
- `useTradePanel` hook must read `defaultOrderType`, `defaultValidity`, `defaultQuantity` from auth store on init
- New `useRiskGuardrails` hook that checks order value before submission and daily P&L state
- Confirmation dialog component: `RiskConfirmationDialog`

## Dependencies

- US-3.1.3-user-preferences
- US-4.x Order management (Trade Panel hook)

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-05-13 | AI Assistant | Initial creation |
