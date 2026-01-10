# Module: Market Data & Pricing Engine

## 1. Overview
The **Market Data Module** is responsible for simulating the financial environment of the Aequitas platform. Since Aequitas Phase 1 operates as a simulated exchange, this module generates "Live" price ticks, manages market session timings, and aggregates ticks into historical candles for charting.

**Key Components:**
- [`MarketService`](backend/internal/services/market_service.go): Manages market hours, holidays, and status (Open/Closed).
- [`PricingService`](backend/internal/services/pricing_service.go): The random-walk simulator that generates price ticks.
- [`CandleBuilder`](backend/internal/services/candle_builder.go): Aggregates ticks into OHLC candles (1m, 5m, 1h, etc.).

---

## 2. Market Session Management

Aequitas uses a robust scheduling system to mimic real-world exchanges (e.g., NSE/BSE).

### 2.1 Market Status States
The system determines market status using `IST (Indian Standard Time)`:
- **PRE_MARKET**: Early session for order placement/discovery.
- **OPEN**: Regular trading session.
- **POST_MARKET**: Late session before final close.
- **CLOSED**: No trading allowed.

### 2.2 Decision Logic (`GetMarketStatus`)
1.  **Holiday Check**: Checks the `market_holidays` collection for the current date.
2.  **Weekly Hours**: Checks `market_hours` config for the current `DayOfWeek`.
3.  **Time Ranges**: Uses `utils.CombineDateTime` to merge today's date with configured time strings (e.g., "09:15") for range comparison.

---

## 3. Pricing Engine (Simulator)

The `PricingService` runs as a background Goroutine with a **3-second ticker**.

### 3.1 Random Walk Algorithm
To simulate realistic stock movement, the engine uses a weighted probability model:
- **Base**: Fetches current `LastPrice`.
- **Logic**: 
    - 80% chance of small move (-1 to +1 ticks).
    - 20% chance of larger move (-2 to +2 ticks).
- **Floor**: Prevents price from dropping below 1 `TickSize`.
- **Broadcasting**: Every new tick is pushed to:
    1.  `MarketDataRepository` (Persistence).
    2.  `CandleBuilder` (Aggregation).
    3.  `PriceAlertService` (Check triggers).

---

## 4. Candle Builder (Aggregation)

The `CandleBuilder` transforms a stream of price ticks into structured `OHLC (Open, High, Low, Close)` data.

### 4.1 Multi-Timeframe Support
Every tick updates five intervals simultaneously: `1m`, `5m`, `15m`, `1h`, `1d`.

### 4.2 Continuity Logic (Essential)
When a new candle starts (e.g., 09:16:00), the system must ensure the chart doesn't have "gaps".
- **Initialization**: If no candle exists in memory, it fetches the `Close` of the last saved candle from the DB to set as the `Open` for the new candle.
- **Transition**: When the 1-minute mark passes, the `ActiveCandle` is saved to the DB, and a new one starts using the previous `Close` as the new `Open`.

---

## 5. Developer Guide

### Critical Files
- [`backend/internal/utils/time.go`](backend/internal/utils/time.go): Contains all IST conversion and time-range logic.
- [`backend/internal/repositories/market_data_repo.go`](backend/internal/repositories/market_data_repo.go): Optimized for high-frequency writes (Upserts).

### How to add a new stock
1.  Add an entry to the `instruments` collection.
2.  The `PricingService` will automatically pick it up in the next 3-second cycle and start generating `market_data` entries.

### Debugging Charts
If candles aren't appearing:
1.  Verify `PricingService` is running (Logs: `Pricing engine started`).
2.  Check `market_data` collection for updates.
3.  Verify the `CandleBuilder` broadcast function is correctly wired to the WebSocket hub.
