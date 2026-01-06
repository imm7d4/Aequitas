# US-6.6: Implement Sell Orders

## 1. Objective
Enable users to reduce or close their positions by placing SELL orders. This completes the basic trading loop (Buy -> Hold -> Sell).

## 2. Requirements

### Backend (`OrderService`)
1.  **Remove Restriction:** Allow `OrderType="MARKET"` and `OrderType="LIMIT"` for `Side="SELL"`.
2.  **Validation:**
    *   Before placing a SELL order, check if the user owns the instrument.
    *   Ensure `Holding.Quantity >= Order.Quantity`.
    *   (Future/Optional) Check for "reserved" quantities in other open SELL orders (to prevent double-spending shares). For now, a simple check of total holdings is sufficient, risk of over-selling is acceptable for MVP.

### Frontend (`PortfolioPage`)
1.  **Holdings Table Actions:**
    *   Add a "Sell" button to each row in the `HoldingsTable`.
    *   Clicking "Sell" should navigate to the **Trade Page** (or open a Trade Modal).
    *   Pre-fill the Trade Panel with:
        *   Side: **SELL**
        *   Instrument: (Selected from row)
        *   Quantity: (Default to 1 or full position?)

### Frontend (`TradePanel`)
1.  **Sell Mode:**
    *   Ensure the Trade Panel supports "SELL" mode (Red theme/button).
    *   Display "Available Qty" when in Sell mode (fetch from Portfolio).

## 3. Tech Improvements
*   **Leverage Existing Matching Engine:** The `MatchingService` already calls `PortfolioService.UpdatePosition`, so successful trades will automatically deduct shares.

## 4. Acceptance Criteria
*   [ ] User can place a MARKET SELL order for a holding they own.
*   [ ] User cannot sell more shares than they own (Backend rejection).
*   [ ] Upon execution, the `HoldingsTable` updates (quantity decreases).
*   [ ] Cash balance increases by the sale proceeds.
