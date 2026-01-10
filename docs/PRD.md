# Product Requirements Document (PRD) - Aequitas

**Author:** Dharmesh  
**Date:** 2026-01-10  
**Version:** 1.0  
**Status:** Living Document  
**Audience:** Product, Tech, QA

---

## 1. Problem Statement

Retail investors often face significant barriers when accessing stock market trading platforms. Existing solutions can be sluggish, cluttered, or opaque regarding execution and fees. 

**The Goal:** Aequitas (Latin for fairness/equity) aims to democratize stock trading by providing a **robust, transparent, and high-performance** platform. It ensures fair execution, real-time market data visibility, and a professional-grade user experience for retail traders, empowering them to make informed investment decisions with confidence.

---

## 2. User Personas

### 2.1 The Active Trader (Rohan)
- **Profile:** 25-35 years old, tech-savvy, trades 3-5 times a week.
- **Needs:** 
    - Fast order execution and real-time price updates.
    - Advanced tools: Candlestick charts, Stop-Loss/Trailing Stop orders to manage risk.
    - Immediate feedback on order status.
- **Pain Points:** Latency in data, unclear fee structures, missed notifications.

### 2.2 The Long-Term Investor (Priya)
- **Profile:** 35-50 years old, invests monthly for wealth creation.
- **Needs:** 
    - Clear portfolio overview with Realized vs. Unrealized P&L.
    - Reliable watchlist to track potential investments.
    - Security and persistent interaction history.
- **Pain Points:** Confusing interfaces, difficulty tracking historical performance.

### 2.3 The Platform Administrator (System Admin)
- **Profile:** Internal operations staff.
- **Needs:** 
    - Tools to manage Instrument Master Data (add/suspend stocks).
    - Control over Market Hours and Trading Sessions.
    - Observability dashboard to monitor system health and latency.

---

## 3. Core Features

### 3.1 In-Scope Features (MVP)

#### **1. Foundation & Identity**
- **User Authentication:** Secure registration, login (JWT), password management (bcrypt).
- **User Profile:** Personal branding, security settings, and preference management.
- **Trading Account:** Auto-creation of trading accounts with INR currency support.

#### **2. Market Data & Discovery**
- **Instrument Management:** Master data for equities (Symbol, ISIN, Sector).
- **Real-Time Data:** Live market status (Open/Closed), simulated live price feeds.
- **Visualization:** Interactive candlestick charts with timeframes and real-time price line overlays.
- **Watchlists:** Customizable user watchlists with real-time updates.
- **Search:** Global search with autocomplete for instruments.

#### **3. Order Management System (OMS)**
- **Order Types:** 
    - **Market:** Immediate execution at current price.
    - **Limit:** Buy/Sell at specified price.
    - **Stop Orders:** Stop Loss, Stop Limit, Trailing Stop (dynamic activation).
- **Order Lifecycle:** Creation, Modification, Cancellation, and Status tracking (Pending, Filled, Rejected).
- **Trade Panel:** Intuitive UI for quick order placement with validation.

#### **4. Matching & Execution Engine**
- **Simulated Matching:** Internal engine to match Buy/Sell orders based on price/time priority.
- **Fee Calculation:** Configurable commission rates (e.g., capped at 0.03% or flat fees) applied to trades.

#### **5. Portfolio Management**
- **Holdings:** Real-time tracking of owned quantity and average buy price.
- **Performance Metrics:** 
    - **Unrealized P&L:** Live profit/loss based on current market price.
    - **Realized P&L:** Historical profit/loss from closed positions.

#### **6. Notification System**
- **Real-Time Alerts:** Order updates, market alerts.
- **Persistence:** Notifications survive page refreshes.
- **Actionable Notifications:** Direct links/actions from toasts (e.g., "View Order").
- **Management:** Read/Unread status, Clear All, and TTL (auto-expiry).

### 3.2 Out-of-Scope (Future Phases)
- **Derivatives:** Futures & Options (F&O) trading.
- **Margin Trading:** Leverage and margin pledging.
- **External Exchange Integration:** Direct routing to NSE/BSE (Phase 2+).
- **Social Trading:** Copy-trading or social feeds.
- **Algorithmic Trading Interface:** Public API for bot trading.

---

## 4. Non-Functional Requirements (NFRs)

### 4.1 Performance & Latency
- **Time to Interactive (TTI):** Dashboard loads in < 1.5 seconds.
- **API Latency:** 95th percentile response time < 200ms for critical trade actions.
- **Market Data:** Price updates pushed to client < 500ms delay.

### 4.2 Availability & Resilience
- **Uptime:** 99.9% availability during active market hours.
- **Fail-Safe:** Telemetry and background services (like Stop Order monitoring) must recover automatically from transient failures.
- **Data Persistence:** Zero data loss for executed trades and order history (MongoDB ACID transactions equivalent).

### 4.3 Security & Compliance
- **Data Encryption:** All sensitive data (passwords) hashed; data in transit encrypted via TLS.
- **Authentication:** Stateless JWT with configurable expiry (24h) and secure storage limits.
- **Audit Trails:** All financial transactions and order modifications must be logged for auditability.
- **Validation:** Strict input validation (e.g., ISIN Luhn check, price thresholds) to prevent erroneous trades.

### 4.4 Scalability
- **Concurrent Users:** Support 1000+ concurrent active users for MVP.
- **Order Throughput:** Handle bursts of 100 orders/second.

---

## 5. Success Metrics (KPIs)

### Business Metrics
- **User Acquisition:** Number of new verified trading accounts per month.
- **Trading Volume:** Total Gross Merchandise Value (GMV) of trades executed.
- **Active Traders:** Daily Active Users (DAU) performing at least one trade.

### Technical Metrics
- **Order Fill Rate:** Percentage of valid Market/Limit orders successfully matched and executed.
- **System Latency:** Average round-trip time for "Order Place" -> "Confirmation".
- **Error Rate:** Percentage of HTTP 5xx errors relative to total requests (Target < 0.1%).

### User Experience Metrics
- **Notification Engagement:** Click-through rate on actionable notifications.
- **Chart Interaction:** Average time spent on Instrument Detail pages.
