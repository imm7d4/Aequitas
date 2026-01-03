# US-4.1.2 - Order Management (Cancel/Modify)

**Epic:** Trading Engine
**Phase:** Phase 4 - Order Management System
**Status:** Not Started

## User Story

As a trader
I want to cancel or modify my pending orders
So that I can react to changing market conditions.

## Acceptance Criteria

- [ ] Users can view a list of their PENDING/OPEN orders.
- [ ] Users can cancel a PENDING order.
- [ ] Users can modify the price or quantity of a PENDING order.
- [ ] Cancelled orders are marked as 'CANCELLED' and cannot be match-processed.
- [ ] Basic validation: Only PENDING orders can be modified or cancelled.

## Technical Requirements

### Backend
- Implement `DELETE /api/orders/{id}` for cancellation.
- Implement `PUT /api/orders/{id}` for modification.
- Handle state transitions (e.g., cannot cancel if FILLED).

### Frontend
- Create `OpenOrders` component.
- Add "Cancel" button with confirmation.
- Add "Edit" functionality to the order list.

## Dependencies

- US-4.1.1: Order Placement

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
