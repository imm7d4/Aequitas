# US-4.1.1 - Order Placement (Market, Limit, Validated)

**Epic:** Trading Engine
**Phase:** Phase 4 - Order Management System
**Status:** In Progress

## User Story

As a trader
I want to place validated buy and sell orders with proper risk checks
So that my orders are accurate, compliant, and safely accepted by the trading system.

## Acceptance Criteria

### 1. Order Input & Types
- [ ] Users can select BUY or SELL.
- [ ] Users can select MARKET or LIMIT order types.
- [ ] Order side, type, instrument, and quantity are mandatory.
- [ ] Quantity must be a positive whole number.
- [ ] LIMIT orders require a valid price; MARKET orders must not accept a price input.

### 2. Price & Quantity Validation
- [ ] Price and quantity must be positive numbers.
- [ ] Price precision must follow instrument tick size.
- [ ] Quantity must respect instrument lot size / minimum order size.
- [ ] Orders violating constraints are rejected with descriptive errors.

### 3. Balance & Risk Validation
- [ ] **BUY orders** validate available balance:
    - LIMIT: `qty × price`
    - MARKET: `qty × current LTP × buffer` (e.g., +1%)
- [ ] **SELL orders** validate available holdings.
- [ ] Orders exceeding balance/holdings are rejected.

### 4. Order Lifecycle & Status
- [ ] Orders created with status: **NEW** (validated, accepted).
- [ ] Orders include timestamps: `created_at` and `validated_at`.
- [ ] Orders remain NEW until sent to the Matching Engine (Phase 6).

### 5. Idempotency & Safety
- [ ] Duplicate order submissions (same `clientOrderId`) are rejected.
- [ ] Orders are atomic: Either fully accepted or fully rejected. No partial persistence.

### 6. User Feedback
- [ ] Users receive immediate confirmation with an order reference ID.
- [ ] Rejection reasons are clear and actionable.

## Technical Requirements

### Backend (Go + MongoDB)
- **Model**: `models/order.go` with side, type, qty, price, status (NEW), source, and validated_at.
- **API**: `POST /api/orders`
- **Validation Flow**: Auth -> Input Check -> Instrument Rules -> Risk Check -> Persistence.
- **Failures**: 400 (Validation), 403 (Holdings/Balance), 409 (Idempotency).

### Frontend (React + TS)
- **Component**: `TradePanel` with selector, toggles, and dynamic inputs.
- **UX**: Estimated order value preview, balance visibility, loading states, and success/error toasts.

## Dependencies

- US-1.1.1: Instrument Master
- US-3.1.4: Account Balances & Holdings
- US-4.0.1: Pricing Engine (LTP)

## Non-Goals (Explicit)
- ❌ Order matching (Phase 6)
- ❌ Partial fills (Phase 6)
- ❌ Stop-loss / bracket orders (US-4.1.4)
- ❌ Amend / cancel orders (Phase 4.2)

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Refined with detailed validation and feedback |
