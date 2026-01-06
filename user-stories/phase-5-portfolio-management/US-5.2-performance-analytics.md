# US-5.2 - Portfolio Performance Analytics

**Epic:** Portfolio Management
**Phase:** Phase 5 - Portfolio & Risk Management
**Status:** Not Started
**Priority:** Medium
**Complexity:** High

## User Story

As a **sophisticated trader**
I want to **analyze my portfolio's performance over time and its risk profile**
So that I can **optimize my asset allocation and understand my true returns**.

## Business Context

Basic holdings show "What I own now". Analytics show "How I am doing over time".
Traders need deeper insights than just "Current P&L" to evaluate their strategy.

## Acceptance Criteria

### 1. Performance History (Chart)
- [ ] **Equity Curve:** Line chart showing total portfolio value over time (1W, 1M, 3M, 1Y, All).
- [ ] **Benchmark Comparison:** Overlay NIFTY 50 or S&P 500 performance against user portfolio (Base 100).
- [ ] **Daily P&L Bar:** Bar chart showing daily P&L additions/subtractions.

### 2. Allocation Breakdown
- [ ] **Donut Chart:** Portfolio distribution by **Sector** (Tech, Finance, Health, etc.).
- [ ] **Donut Chart:** Portfolio distribution by **Instrument Type** (Stocks, ETFs).
- [ ] **Concentration Risk:** Alert if single stock > 20% of portfolio.

### 3. Advanced Metrics
- [ ] **XIRR (Extended Internal Rate of Return):** True annualized return accounting for deposits/withdrawals.
- [ ] **Realized P&L Calendar:** Calendar view showing daily realized profits.
- [ ] **Win/Loss Ratio:** Percentage of trades that were profitable.

### 4. Risk Analysis
- [ ] **Portfolio Beta:** Weighted average beta relative to market.
- [ ] **Max Drawdown:** Largest % drop from peak val.

---

## Technical Requirements

### Backend
1.  **Daily Snapshot Job:**
    *   Cron job running at market close (3:30 PM).
    *   Snapshots current `TotalValue`, `Cash`, `Holdings` to `portfolio_history` collection.
2.  **Analytics Service:**
    *   `CalculateXIRR(transactions)`
    *   `GetAllocationBySector(holdings)` (Requires Sector data in Instrument model).

### Frontend
1.  **Charts:**
    *   Use `lightweight-charts` or `recharts` for Equity Curve.
    *   `nivo` or `chart.js` for Donut/Pie charts.
2.  **Analytics Page:**
    *   New Tab in Portfolio: "Analytics".

---

## Dependencies
- ✅ US-5.1: Core Portfolio Holdings (Must exist to analyze)
- ✅ US-1.1: Instrument Data (Need Sector/Industry fields)
