# US-4.1.4 - Stop-Loss & Contingent Orders (Advanced)

**Epic:** Trading Engine
**Phase:** Phase 4 - Order Management System
**Status:** Not Started

## User Story

As a trader
I want to place stop-loss and trailing stop orders
So that I can protect my capital and automate my exit strategy.

## Acceptance Criteria

- [ ] Users can place STOP (Market) and STOP-LIMIT orders.
- [ ] Users can specify a trigger (Stop) price.
- [ ] Users can place TRAILING-STOP orders with a designated trail amount (Percent or Absolute).
- [ ] Stop orders are held in 'PENDING' until the market price hits the trigger price.
- [ ] Trailing stops automatically update their trigger price as the market moves in a favorable direction.

## Technical Requirements

### Backend
- Update `Order` model with `StopPrice`, `TrailAmount`, and `TrailType`.
- Implement trigger logic in `OrderService` (to be triggered by market data updates).

### Frontend
- Add "Advanced" mode to `TradePanel`.
- Build UI for Stop Price and Trailing parameters.

## Dependencies

- US-4.1.1: Order Placement

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
