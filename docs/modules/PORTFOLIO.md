# Module: Portfolio & Accounting

## 1. Overview
The **Portfolio Module** maintains the "Truth" of what a user owns and what they have earned. It handles:
1.  **Holdings:** Aggregating trades into net positions.
2.  **Cost Basis:** Calculating Weighted Average Price (WAP).
3.  **Profit & Loss:** Calculating Realized P&L (closed trades) and Unrealized P&L (open positions).

**Key Services:**
- [`PortfolioService`](backend/internal/services/portfolio_service.go)
- [`TradingAccountService`](backend/internal/services/trading_account_service.go)

---

## 2. Core Accounting Logic

### 2.1 The Concept of "Holding"
A `Holding` represents a user's net position in a single Instrument (e.g., "10 shares of TCS").
- **Unique Key:** `Composite{UserID, InstrumentID}`.
- **Persistence:** Stored in the `holdings` MongoDB collection.

### 2.2 BUY Logic: Weighted Average Price (WAP)
When a user buys more of a stock they already own, the cost basis is averaged.

**Formula:**
```go
TotalCost_New = TotalCost_Old + (TradePrice * TradeQty)
TotalQty_New  = TotalQty_Old + TradeQty
AvgCost_New   = TotalCost_New / TotalQty_New
```
*Important:* Fees are **NOT** included in the `AvgCost` calculation. They are tracked separately in `TotalFees`. This allows tax systems to treat fees as expenses rather than capital cost adjustments if needed (configurable).

### 2.3 SELL Logic: Realized P&L
When a user sells, we "close" a portion of the position and "realize" the profit or loss.

**FIFO vs. Weighted Average:**
Aequitas uses the **Weighted Average** method for simplicity. The cost of the shares sold is assumed to be the current `AvgCost`.

**Calculation:**
1.  **Cost of Goods Sold (COGS):** `SoldQty * AvgCost`.
2.  **Net Proceeds:** `(SellPrice * SoldQty) - SellFees`.
3.  **Realized P&L:** `NetProceeds - COGS`.

**Action:**
- This `Realized P&L` amount is usually just "Booked".
- The actual Cash Balance update is `Wallet = Wallet + NetProceeds`.
- The `TradingAccount.RealizedPL` field is updated cumulatively to show "Lifetime P&L".

---

## 3. Data Structures

### 3.1 Holding Model (`models.Holding`)
```go
type Holding struct {
    UserID       primitive.ObjectID
    Symbol       string
    Quantity     int     // Net shares owned
    AvgCost      float64 // Cost per share (sans fees)
    TotalCost    float64 // Quantity * AvgCost
    RealizedPL   float64 // Lifetime profit from this specific stock
    TotalFees    float64 // Lifetime fees paid on this stock
}
```

### 3.2 Portfolio Snapshot
To draw "Equity Curve" charts, `CaptureSnapshot()` runs periodically (e.g., end of day).
- Stores: `Date`, `TotalEquity` (Cash + Holdings Value), `CashBalance`.
- Usage: Frontend "Portfolio Growth" chart.

---

## 4. Challenges & Edge Cases

### 4.1 Short Selling
*Current State:* **Partially blocked.**
- The `OrderService` checks `OwnedQty < SellQty` and rejects the order.
- To support Short Selling in Phase 2, this verification must be relaxed, and `Quantity` allowed to go negative.

### 4.2 Precision Errors
Using `float64` for currency (INR) and quantities.
- *Risk:* `0.1 + 0.2 != 0.3` in standard IEEE floating point.
- *Mitigation:* We round to 2 decimal places at the presentation layer and database boundary.

---

## 5. Developer Guide

### Critical Function: `UpdatePosition`
This function in `portfolio_service.go` is the "ledger writer".
- **Input:** A `Trade` object (fully executed).
- **Behavior:** Idempotent-ish (though calling it twice *will* duplicate the holding change, so upstream deduplication is vital).
- **Logging:** Heavily logs "Old Qty" -> "New Qty" for audit trails.
