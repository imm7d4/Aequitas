# Module: Order Management System (OMS)

## 1. Overview
The **Order Management System (OMS)** is the central nervous system of the Aequitas platform. It is responsible for:
1.  **Ingesting** user orders from the API.
2.  **Validating** orders against risk rules, market conditions, and instrument configurations.
3.  **Persisting** order state throughout its lifecycle.
4.  **Monitoring** conditional orders (Stop Loss, Trailing Stop) and triggering them when conditions are met.

**Key Services:**
- [`OrderService`](backend/internal/services/order_service.go): Handles synchronous order placement, modification, and cancellation.
- [`StopOrderService`](backend/internal/services/stop_order_service.go): A background worker that monitors and triggers conditional orders.

---

## 2. Order Lifecycle

The order state machine is strictly defined in `models/order.go`. All state transitions are atomic and logged.

### 2.1 State Flow
1.  **NEW**: Initial state. Validation passed, order saved to DB.
    - *Transition*: To `PENDING` (for Stop Orders) or remains `NEW` (for Limit) until picked up by Matching Engine.
2.  **PENDING**: Active in the system but not yet executing.
    - *Context*: Stop orders waiting for a trigger price. Limit orders waiting for a match.
3.  **FILLED**: Execution complete.
    - *Context*: Matching Engine has successfully paired the order.
4.  **TRIGGERED**: Conditional order activated.
    - *Context*: A Stop order's condition was met, and it spawned a child "Real" order (Market/Limit).
5.  **REJECTED**: Validation or Risk check failed.
6.  **CANCELLED**: User requested cancellation before execution.

---

## 3. Detailed Implementation Reference

### 3.1 Order Placement (`OrderService.PlaceOrder`)
**File:** `backend/internal/services/order_service.go`

This method is the entry point for all trading activity. It performs a sequential validation pipeline:

1.  **Input Sanitation:** Checks for missing fields (Side, Type, InstrumentID, Quantity).
2.  **Validity Check (New in v1.1):**
    - Defaults to `DAY` if unspecified.
    - **Validators:** `DAY` | `IOC` (Immediate or Cancel) | `GTC` (Good Till Cancelled).
    - **Rule:** `MARKET` orders *cannot* be `GTC`.
3.  **Instrument Status:** Verifies the instrument is `ACTIVE`.
4.  **Tick Size Compliance:** Ensures Price is a multiple of `TickSize` (e.g., 0.05).
5.  **Lot Size Compliance:** Ensures Quantity is a multiple of `LotSize`.
6.  **Risk Management (Pre-Trade Risk):**
    - **BUY:** Checks `TradingAccount.Balance >= (Price * Quantity)`.
    - **SELL:** Checks `Portfolio.Holdings >= Quantity`.
7.  **Order Type Specifics:**
    - `MARKET`: Price is ignored. Uses `LTP * 1.01` for estimated margin check.
    - `LIMIT`: Requires `Price`.
    - `STOP/STOP_LIMIT`: Requires `StopPrice`. Validates logical placement (e.g., Sell Stop must be < Current Price).
    - `TRAILING_STOP`: Initializes `CurrentStopPrice` based on `TrailAmount`.

### 3.2 Stop Order Monitor (`StopOrderService`)
**File:** `backend/internal/services/stop_order_service.go`

To support conditional orders without complex event architecture in the MVP, we use a **Polling Model**.

#### 3.2.1 Architecture
- **Worker:** A dedicated Goroutine spawned at app startup.
- **Interval:** Polls every **3 seconds**.
- **Scope:** Fetches all orders with status `PENDING`.

#### 3.2.2 Logic Flow (`MonitorStopOrders`)
1.  **Fetch Data:** Gets fresh `LastPrice` for the instrument from `MarketDataRepo`.
2.  **Update Trailing Stops:**
    - If `OrderType == TRAILING_STOP`, calls `UpdateTrailingStop()`.
    - **BUY:** Updates `lowest_price`. If `Price < Lowest`, New Stop = `Price + Trail`.
    - **SELL:** Updates `highest_price`. If `Price > Highest`, New Stop = `Price - Trail`.
    - *Crucial:* Stop price is **ratcheted**. It never moves in a loss-making direction.
3.  **Check Trigger Condition:**
    - compares `CurrentPrice` vs. `StopPrice`.
    - **BUY:** Trigger if `Current >= Stop`.
    - **SELL:** Trigger if `Current <= Stop`.
4.  **Execution (`TriggerStopOrder`):**
    - Atomic Update: Sets parent order to `TRIGGERED`.
    - Spawn Child: Creates a **new** `MARKET` or `LIMIT` order.
    - Linkage: New order has `ParentOrderID` pointing to the Stop order.
    - Recursive Call: Passes the new order back to `OrderService.PlaceOrder`.

---

## 4. Technical Constraints & Design Decisions

### 4.1 Why Polling?
*Context:* We chose a 3-second poll instead of event-driven updates.
- **Pros:** Simpler to implement, easier to debug, robust against missed events.
- **Cons:** **Slippage Risk.** If the market crashes 10% in 1 second, the poller might miss the exact stop price and trigger late, resulting in a fill far below the stop.
- ** mitigation:** "Trigger if `Current <= Stop`" (inequality check) ensures it triggers *eventually*, even if it missed the exact crossing point.

### 4.2 Handling Recursion
The `StopOrderService` calls `OrderService`. This creates a potential circular dependency dependency if not careful.
- **Solution:** `StopOrderService` depends on `OrderService` (interface/struct pointer), but `OrderService` does *not* depend on `StopOrderService`. The dependency graph is DAG, preventing initialization cycles.

---

## 5. Troubleshooting & Onboarding Tips

- **"Order Released but not Filled":** Check `validity`. If `IOC`, it might have cancelled immediately. Check `StopOrderService` logs for "Trigger failed".
- **"Stop Price not Updating":** Trailing stops only update when the market moves *favorably* (new High for Sell, new Low for Buy). They do not move if price stagnates or reverses.
- **Debugging:** Search logs for `[StopMonitor]`. It logs every trigger attempt and price update.
