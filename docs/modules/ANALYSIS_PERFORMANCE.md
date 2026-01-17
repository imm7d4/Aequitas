# Backend Performance Analysis: Deep Per-Trade Analytics (US-10.1)

## Executive Summary
Implementation of US-10.1 introduces new computational logic for **FIFO matching** and **Excursion tracking (MAE/MFE)**. While these add complexity, the overall system impact is strictly controlled by shifting heavy calculations to the "Trade Close" event rather than continuous real-time monitoring.

---

## 1. Computational Load Analysis

### A. FIFO Position Matching (Logistical Load)
- **Current State**: Positions are updated as a single aggregate (AvgCost).
- **Proposed State**: Backend must track individual execution "legs".
- **Impact**:
  - **Complexity**: O(N) where N is the number of open trade legs for a specific instrument.
  - **Overhead**: Negligible. Most retail traders have < 10 legs per position.
  - **Storage**: ~500 bytes per `TradeResult` record.

### B. MAE/MFE Tracking (Computational Load) - **CRITICAL**
- **The Challenge**: Finding the absolute high/low during the trade lifecycle.
- **Optimization Strategy**: Use **Post-Trade Historical Query** instead of **Real-time Monitoring**.
  - On square-off, the `AnalyticsService` will query the `MarketData` repository for the `MAX` and `MIN` price between `EntryTime` and `ExitTime`.
- **Market Data Priority Rules**:
  1. Snapshot price tracker (High resolution)
  2. Intraday candle data (1m / 5m)
  3. Fallback: Trade execution prices only (Reduced accuracy)
- **Impact**:
  - **Query Performance**: Indexing on `InstrumentID + Timestamp` in MongoDB makes this a < 50ms operation.
  - **Memory Usage**: Minimal, as data is processed in a single pass at the end of the trade.

### C. Commission Separation
- **Impact**: Zero overhead. This is a simple subtraction of pre-calculated `Fees` and `Commission` fields already present in the `Trade` model.

---

## 2. Expected Performance Metrics (SLA Contract)

| Metric | Target SLA | Variance Factors |
|--------|------------|------------------|
| **1,000 Trades Load** | < 300ms | Indexed TradeResult retrieval. |
| **10,000 Trades Load** | < 800ms | Data volume and network latency. |
| **Trade Close Delay** | +5-10ms | Time to calculate FIFO matching prior to DB write. |
| **Excursion Analysis** | Async | Computed after trade close to avoid execution latency. |

---

## 3. Scalability Considerations

1. **Database Growth**: The `TradeResults` collection will grow at roughly 2x the rate of the current trade log. We will implement **Indexing** on `UserID` and `ExecutedAt` to maintain constant-time retrieval.
2. **Data Granularity**: Using 1-minute OHLC data for MAE/MFE is the sweet spot for performance. Switching to tick-by-tick monitoring would increase load by ~100x without significant value for most use cases.

---

## 4. Conclusion
The backend is well-equipped to handle this load. By adopting a **Pull-on-Close** strategy for excursion metrics, we protect the high-performance Matching Engine from analytics-related latency. Total system overhead is estimated at **< 2%** of current CPU/DSO utilization.
