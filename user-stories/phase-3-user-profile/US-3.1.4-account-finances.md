# US-3.1.4 - Account Finances & Funding

**Epic:** User Profile & Personalization
**Phase:** Phase 3 - User Profile
**Status:** Completed

## User Story

As a trader
I want to manage my account finances, including viewing my balance and adding simulated funds
So that I can ensure I have sufficient capital for my trading operations.

## Acceptance Criteria

- [x] Users can view their current account balance and currency.
- [x] Users can perform a "Simulated Deposit" to add funds to their account.
- [x] Users can view a basic history of their recent financial transactions (deposits/withdrawals).
- [x] Financial status is prominently displayed in the profile overview.

## Technical Requirements

### Backend
- Utilize existing `TradingAccount` model in `models/trading_account.go`.
- Implement `GET /api/account/balance` endpoint.
- Implement `POST /api/account/fund` for simulated deposits.
- Create `Transaction` model to track financial history (deposits, matches, fees).

### Frontend
- `FinanceOverview` component in the profile feature.
- Deposit modal/dialog with predefined amounts or custom input.
- `TransactionHistory` table or list.

## Dependencies

- US-0.1.2-trading-account-creation

## Implementation Notes

- Deposits should be simulated for Phase 3 (no real payment gateway).
- Transaction types should include 'DEPOSIT', 'WITHDRAWAL', 'TRADE', and 'FEE'.

## Testing Requirements

- Unit tests for balance calculation logic.
- Integration tests for funding API.
- E2E scenario for funding the account and seeing the updated balance.

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
