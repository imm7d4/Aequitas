# Aequitas Domain Glossary & Implementation Reference

**Target Audience:** Cross-functional Team (Product, Dev, QA, Ops)  
**Context:** Aequitas Retail Trading Platform  
**Version:** 3.0 (Combined & Comprehensive)

This document serves as the single source of truth for domain logic, bridging the gap between high-level financial concepts and their technical implementation in the Aequitas codebase (Go + MongoDB).

---

# Part 1: General Domain Concepts (Business Logic)

**Audience:** Product Managers, Junior Devs, QA

## 1. Market Data & Instruments

### **Instrument**
A tradable asset. In Aequitas Phase 1, this refers specifically to **Equities** (Common Stock).
- **Symbol / Ticker:** The short abbreviation used to identify the stock (e.g., `RELIANCE`, `TCS`).
- **ISIN (International Securities Identification Number):** A 12-character alphanumeric code that uniquely identifies a specific security (e.g., `INE002A01018`). Critical for validation.
- **Tick Size:** The minimum price movement a trading instrument can make. For most stocks on NSE, this is **₹0.05**.

### **LTP (Last Traded Price)**
The price at which the most recent trade was executed.
- **Significance:** It is the "headline" price shown on dashboards.
- **Note:** LTP is *historical* data. It does not guarantee you can buy/sell at this price immediately (see *Bid/Ask*).

### **OHLC (Open, High, Low, Close)**
Standard summary metrics for a specific timeframe (e.g., 1 minute, 1 day), used primarily for Candlestick Charts.

### **Market Depth (Order Book)**
A list of all pending buy and sell orders.
- **Bid:** The price a buyer is willing to pay.
- **Ask (Offer):** The price a seller is willing to accept.
- **Spread:** The difference between the highest Bid and the lowest Ask.

---

## 2. Order Management System (OMS)

### **Order Types**

| Type | Definition | Priority | Risk |
|---|---|---|---|
| **Level 1: Market Order** | Order to buy/sell **immediately** at the best available current price. | Speed > Price | **Slippage**: Price may change between click and execution. |
| **Level 2: Limit Order** | Order to buy/sell at a **specific price or better**. | Price > Time | **No Execution**: If market never touches your price, order waits indefinitely. |
| **Level 3: Stop Loss (SL)** | A defensive order (dormant) that triggers a Market/Limit order when price hits a threshold. | Safety | Protection only active after trigger condition is met. |

### **Advanced Order Logic**

#### **Trailing Stop Order**
A dynamic trigger that "follows" the market price as it moves in your favor.
- **Behavior (Long Position):**
    - If Market Price rises by X, the Stop Price rises by X.
    - If Market Price falls, the Stop Price *stays locked*.
- **Result:** You lock in profits while giving the trade room to grow.

### **Order Attributes (Time in Force)**
- **Day Order:** Valid until market close. Automatically expires. (Default).
- **IOC (Immediate or Cancel):** Fill what you can *now*, cancel the rest.
- **GTC (Good Till Cancelled):** Remains active until filled or manually cancelled.

---

## 3. Core Trading Concepts

### **Matching Engine**
The system component that matches Buy and Sell orders based on **Price-Time Priority**.
1.  **Price:** Better prices (Higher Bids, Lower Asks) get priority.
2.  **Time:** First come, first served.

### **Fill vs. Execution**
- **Execution:** The atomic *event* of a trade occurring (1 Trade).
- **Fill:** The *outcome* for a specific order (2 Fills per Trade).
- **Partial Fill:** when an order is only partially completed (e.g., asked for 100, got 20).

### **Positions & P&L**
- **Long Position:** You own the stock (Qty > 0). Profit if Price UP.
- **Short Position:** You sold stock you don't own (Qty < 0). Profit if Price DOWN.
- **Realized P&L:** Money "booked" to your account after closing a trade.
- **Unrealized P&L:** "Paper profit" based on current market price vs average cost.

---

# Part 2: Technical Implementation Details

**Audience:** Backend Developers, Architects  
**Codebase:** `backend/internal/`

## 1. Order Lifecycle Implementation
**Service:** `order_service.go`, `stop_order_service.go`

### **Order State Machine**
Defined in `models/order.go`.

| Status | Code Definition | Business Logic Ref |
|:---|:---|:---|
| **NEW** | `NEW` | API received request, pre-validation check passed. |
| **PENDING** | `PENDING` | Valid limit/stop order, waiting in `MonitorStopOrders` or `MatchLimitOrders`. |
| **FILLED** | `FILLED` | Executed. `Quantity == FilledQuantity`. |
| **TRIGGERED** | `TRIGGERED` | Stop Order condition met (`CurrentPrice >= StopPrice`), spawned child order. |
| **REJECTED** | `REJECTED` | Validation failed (e.g., Insufficient Funds check in `PlaceOrder`). |

### **Stop Order Mechanism**
Implemented as a background worker polling every 3 seconds.
- **Tracking:** For Trailing Stops, uses `HighestPrice` (SELL) or `LowestPrice` (BUY) fields in the Order struct to calculate the dynamic `CurrentStopPrice`.
- **Math:** `UpdateTrailingStop()` function updates the `CurrentStopPrice` using percentage or absolute deltas.

---

## 2. Matching Engine Internals
**Service:** `matching_service.go`

### **Execution Logic**
1.  **Market Orders (`ExecuteMarketOrder`):**
    - **No Matching Queue:** In Phase 1 (Simulated), we execute *immediately* against the `marketDataRepo`'s Last Price.
    - **Slippage:** Implicitly defined as the delta between the UI's last poll and the API's fetch time.

2.  **Limit Orders (`MatchLimitOrders`):**
    - **Polling:** Checks all `NEW` orders every 3s.
    - **Price Improvement Rule:** If User Limit is ₹100, but Market is ₹105 (for Sell), we execute at ₹105.
    - **Code Rule:** `ExecutionPrice = MarketData.LastPrice` (NOT Order.Price).

### **Fee Calculation**
- **Commission:** `Min(Value * Config.CommissionRate, Config.MaxCommission)`
- **Configuration:** Managed in `config/config.go`.

---

## 3. Implementation of Portfolio Math
**Service:** `portfolio_service.go` | **Model:** `holding.go`

### **Weighted Average Price (WAP)**
Used for **Buy** logic to determine cost basis.
- **Struct Fields:** `TotalCost`, `AvgCost`, `TotalFees`.
- **Logic:**
  ```go
  // Fees NOT included in AvgCost (standard practice for separation of concerns)
  NewTotalCost = OldTotalCost + (TradePrice * TradeQty)
  NewAvgCost = NewTotalCost / NewTotalQty
  ```

### **Realized P&L Calculation**
Used for **Sell** logic.
- **Logic:**
  ```go
  CostOfGoodsSold = SoldQty * CurrentAvgCost
  NetProceeds = TradeValue - SellFees
  RealizedPL = NetProceeds - CostOfGoodsSold
  ```
- **Result:** This `RealizedPL` amount is what is credited/debited to `TradingAccount.RealizedPL`.

---

## 4. System NFRs

### **Idempotency**
- **Identifier:** `ClientOrderID` in `models.Order`.
- **Mechanism:** MongoDB unique index prevents duplicate order placement from double-clicks.

### **Concurrency & Safety**
- **Transactions:** Currently single-document atomicity via `UpdateOne`.
- **Critical Path:**
    1. Update Order -> FILLED
    2. Settle Cash (Wallet)
    3. Update Position (Inventory)
- **Failure Mode:** If step 3 fails, logs are generated for manual reconciliation (Implementation note: Transactions to be added in Phase 2).

### **Accuracy**
- **Tick Size:** API validation enforces multiples of 0.05.
- **ISIN:** Validated via Luhn Algorithm on ingress.
