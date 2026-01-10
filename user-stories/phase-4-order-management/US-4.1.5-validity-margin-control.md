# US-4.1.5 - Advanced Validity (GTC/IOC) & Margin Control

**Epic:** Trading Engine
**Phase:** Phase 4 - Order Management System
**Status:** Completed

## User Story

As a trader
I want to control the validity and fund allocation of my orders
So that I can manage my execution timing and pre-trade risks.

## Acceptance Criteria

- [ ] Users can select order validity: DAY (default), GTC (Good Til Cancelled), IOC (Immediate or Cancel).
- [ ] The system performs "Real-time Margin Checks" before accepting an order.
- [ ] Orders are rejected if the account balance is insufficient for (Price * Qty + Estimated Fees).
- [ ] 'IOC' orders are immediately cancelled if not filled in the first match attempt.

## Technical Requirements

### Backend
- Implement `Validity` logic in the OMS.
- Create a `RiskService` (or method in `OrderService`) for pre-trade margin validation.

### Frontend
- Add Validity dropdown to `TradePanel`.
- Display "Estimated Margin Required" in the UI during order entry.

## Dependencies

- US-3.1.4: Account Finances
- US-4.1.1: Order Placement

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
