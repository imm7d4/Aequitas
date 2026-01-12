
## Title
**US-3.1: Dashboard Rework - The Analytical Trader**

## Description
**As a** data-driven trader using Aequitas,
**I want** a dashboard that provides deep insights into my trading performance, including detailed win/loss metrics and real-time market movers ("Hot Stocks"),
**So that** I can identify my strengths and weaknesses, optimize my strategy, and quickly spot new opportunities in the market.

## Acceptance Criteria

### 1. Performance Overview (Header)
- [ ] Display **Total Equity** (Cash + Holdings).
- [ ] Display **Total Realized P&L** from closed trades.
- [ ] Display **Total Unrealized P&L** from open positions (updated with real-time prices).
- [ ] Display **Profit Factor** (Gross Profit / Gross Loss).
- [ ] Can toggle visibility of sensitive values (e.g., balance).

### 2. Trading Analysis Widget
- [ ] **Win/Loss Ratio**: Visual representation (Pie/Bar) of winning vs. losing trades.
- [ ] **Average Trade Performance**: Show Average Profit per trade vs. Average Loss per trade.
- [ ] **Extremes**: Display the "Largest Single Win" and "Largest Single Loss" by value.
- [ ] **Trade Volume**: Total number of trades executed.

### 3. Behavioral & Strategy Insights (Trader Self-Improvement)
#### 🕒 Time-Based Analysis
- [ ] **Win Rate by Time of Day**: Display win rate breakdown for:
  - Opening (9:15 AM - 11:00 AM)
  - Midday (11:00 AM - 2:00 PM)
  - Closing (2:00 PM - 3:30 PM)
- [ ] **Win Rate by Day of Week**: Show which days (Mon-Fri) have the highest success rate.
- [ ] **Average Holding Duration**: Compare average holding time for:
  - Winning trades
  - Losing trades

**Insight**: Reveals when you trade best—not just what you trade.

### 4. Market Intelligence Enhancements
#### 🔥 Smart Hot Stocks
Upgrade "Hot Stocks" to provide comprehensive market intelligence:
- [ ] Display **Top 5 Gainers** and **Top 5 Losers** with enhanced metrics:
  - **Price Change %**: Current percentage change
  - **Volume Surge**: % change vs average volume (e.g., "Vol +180%")
  - **VWAP Distance**: Indicator showing if price is above/below VWAP
  - **Breakout/Breakdown Flag**: Visual indicator for technical patterns
  - **News/Corporate Action Badge**: Icon/badge for earnings, dividends, or major news
- [ ] Example display format:
  ```
  RELIANCE ▲3.2% | Vol +180% | Above VWAP | 📰 Earnings Today
  ```
- [ ] "View All" link to navigate to the full Markets page (if applicable).

### 5. Portfolio Distribution
- [ ] **Asset Allocation Chart**: Donut chart showing distribution of Portfolio Value vs. Cash Balance.
- [ ] **Active Positions**: Summary count of currently open positions.

### 6. Technical Requirements
- [ ] Data should be fetched via `DashboardController` or aggregated service calls.
- [ ] "Hot Stocks" must query `MarketData` collection sorted by `change_pct`.
- [ ] **Volume Analysis**: Calculate volume surge by comparing current volume to historical average.
- [ ] **VWAP Calculation**: Compute VWAP (Volume Weighted Average Price) for each instrument.
- [ ] **News/Events Integration**: Fetch corporate actions and news from external API or internal events collection.
- [ ] **Breakout Detection**: Implement technical analysis logic to flag breakouts/breakdowns.
- [ ] UI must be responsive (grid layout on desktop, stacked on mobile).
