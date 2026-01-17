# US-9.2 - Auto-Liquidation System

**Epic:** Risk Management  
**Phase:** Phase 9 - Short Positions  
**Status:** Planning  
**Priority:** Critical  
**Complexity:** High  

## User Story

As a **platform administrator**,  
I want the system to automatically close high-risk positions when a user's margin health becomes critical,  
so that the platform is protected from catastrophic debt and the user's losses are capped.

## Acceptance Criteria

### 1. Trigger Logic
- [ ] System monitors `Margin Health Ratio` (Equity / Blocked Margin) every 3 minutes.
- [ ] Auto-liquidation triggers when `Ratio < 0.5` (Critical Threshold) is detected for **two consecutive readings**.
- [ ] Trigger logic respects market hours (no liquidation while market is closed).

### 2. Selection Strategy
- [ ] System identifies the "Rixkiest Position" to liquidate first.
- [ ] **Priority 1**: All `SHORT` positions with unrealized losses exceeding 50% of their blocked margin.
- [ ] **Priority 2**: Position with the largest absolute unrealized loss.
- [ ] System liquidates positions sequentially until `Health Ratio` returns to `> 0.8`.

### 3. Execution
- [ ] System generates a **MARKET ORDER** for the target instrument.
- [ ] Order must be tagged with `Origin: SYSTEM` and `Reason: LIQUIDATION`.
- [ ] Order bypasses standard balance checks (since it's a square-off).

### 4. Communication
- [ ] Immediate push notification sent to the user: "CRITICAL: Urgent Auto-Liquidation Executed".
- [ ] Notification includes: Symbol, Quantity Liquidated, and the Margin Ratio that triggered it.
- [ ] Order History displays a distinct "Liquidation" label for these trades.

## Technical Requirements

### Backend
- **MarginMonitorService**:
  - Implement `LiquidateUserPositions(userID string)` method.
  - Logic to select the "Worst" position based on Margin Ratio per instrument.
- **OrderService**:
  - Add `Origin` field to `Order` model (USER vs SYSTEM).
  - Create `ForceExecuteLiquidation` method that skips margin validation but enforces position presence.
- **MatchingEngine**:
  - Prioritize system-generated liquidation orders for immediate execution.

### Frontend
- **Order History**: Update `OrderRow` to display "SYSTEM" origin.
- **Portfolio Summary**: Add a "Margin Risk" alert if the user is within 10% of the liquidation trigger.
- **Notifications**: Handle specific "Liquidation" notification types with higher visual urgency.

## Dependencies
- US-9.1 (Short Selling Architecture)
- US-6.1 (Matching Engine)
- US-7.1 (Notification System)

## Implementation Notes
- **Slippage**: Liquidation via MARKET orders may result in high slippage; the user must be warned in the UI.
- **Race Conditions**: Ensure that multiple monitor cycles don't trigger multiple liquidations for the same position if the first one is still processing.
- **Partial Liquidation**: For MVP, we will liquidate the **entire quantity** of the selected holding to ensure immediate risk reduction.

## Testing Requirements
- **Unit Test**: Mock the `MarginMonitorService` to inject a 0.4 ratio and verify `LiquidateUserPositions` is called.
- **Integration Test**: Verify that a system-generated BUY order correctly covers a SHORT position and releases the remaining margin.
- **E2E**: Simulate a price spike in a shorted stock and watch the system automatically square off the position and notify the user.

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-17 | AI Assistant | Initial draft of US-9.2 for Auto-Liquidation |
