# Module: Matching Engine & Execution

## 1. Overview
The **Matching Engine** is the core component responsible for executing trades. In the current "Simulated Exchange" phase (Aequitas Phase 1), it acts as a broker-dealer simulator, matching user orders against a centralized "Market Price" rather than an opposing user order (CLOB).

**Key Service:** [`MatchingService`](backend/internal/services/matching_service.go)

---

## 2. Core Mechanics

### 2.1 Execution Models
Aequitas supports two distinct execution paths:

#### A. Synchronous Execution (Market Orders)
**Method:** `ExecuteMarketOrder(order)`
- **Trigger:** Called immediately by `OrderService` when receiving a `MARKET` order.
- **Behavior:**
    1.  Fetches `LastPrice` from `MarketDataRepository`.
    2.  **Fill:** Creates a trade at `LastPrice`.
    3.  **Settlement:** Atomically updates cash balance and share inventory.
    4.  **Response:** The API user receives the fill confirmation in the same HTTP request.

#### B. Asynchronous Execution (Limit Orders)
**Method:** `MatchLimitOrders()` (Background Loop)
- **Trigger:** `time.NewTicker(3 * time.Second)`
- **Behavior:** Scans the order book for `NEW` limit orders and compares them against current market prices.

### 2.2 The Matching Logic (`MatchLimitOrders`)
For every `NEW` Limit Order:
1.  **Fetch LTP:** Get live price for the instrument.
2.  **Check Condition:**
    - **BUY:** `LTP <= LimitPrice` (The price has dropped enough to buy).
    - **SELL:** `LTP >= LimitPrice` (The price has risen enough to sell).
3.  **Best Execution Rule (Critical):**
    - If a user places a BUY LIMIT at ₹100, but the market is at ₹98, we **Buy at ₹98**.
    - *Code:* `fillPrice := executionPrice` (Not `order.Price`).
    - This ensures the user gets the best available price, consistent with regulated exchange behavior.

---

## 3. Fee Structure & Settlement

### 3.1 Commission Calculation
Fees are calculated *per trade* inside `createTrade()`.
- **Formula:** `Min(TradeValue * CommissionRate, MaxCap)`
- **Configuration:** Loaded from `fees.json` or `config.Config`.
- **Default:** 0.03% with a cap of ₹20.

### 3.2 Settlement Flow
The `MatchingService` orchestrates the post-trade sequence. If any step fails, error logs are generated (Phase 2 will introduce Sagas/Transactions).

1.  **Update Order:** Status `FILLED`, `FilledQuantity` set.
2.  **Settle Cash (`AccountService`):**
    - **Buy:** Debit (Cost + Fees).
    - **Sell:** Credit (Proceeds - Fees).
3.  **Update Inventory (`PortfolioService`):**
    - **Buy:** Add shares, update Moving Average Price.
    - **Sell:** Remove shares, calculate Realized P&L.
4.  **Notify:** Send WebSocket message "Order Filled".

---

## 4. Challenges & Design Decisions

### 4.1 Locking & Concurrency
*Problem:* Two limit orders might trigger simultaneously, or a user might Cancel a limit order *just* as it fills.
*Solution:*
- The Matching Engine is the **sole writer** to the "Status" field for `NEW` -> `FILLED` transitions (except user Cancel).
- Before filling, it should technically re-fetch the order to ensure it wasn't cancelled (Optimistic Locking). *Note: Currently relying on sequential processing in the loop.*

### 4.2 Why Simulation?
A full Central Limit Order Book (CLOB) requires matching User A vs. User B.
- **Phase 1 Decision:** To provide a fluid experience with low liquidity (few users), we act as the "Market Maker". We take the other side of every trade based on external data feeds.
- **Impact:** High liquidity reliability for the user, but the "House" (Platform) takes the risk.

---

## 5. Developer Guide / Onboarding

### Key Methods
- `Start()`: Spawns the background poller. Must be called in `cmd/server/main.go`.
- `ExecuteMarketOrder()`: The "Fast Path". Read this to understand the full trade lifecycle (Order -> Trade -> Wallet -> Portfolio).

### Common Issues
- **"My Limit Order won't fill":** Check the `MarketData`. The simulator might have drifted away from your limit price.
- **"Fees look wrong":** Check `createTrade`. Note that we separate "Commission" and "FlatFee" in the math.
