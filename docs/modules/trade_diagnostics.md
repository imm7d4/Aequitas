# Universal Trade Diagnostics Module

## Overview

The Universal Trade Diagnostics module is a professional-grade post-trade analysis engine. It transforms raw execution data into "Economic Units" (completed trades) and provides deep insights into execution quality, market behavior during holding periods, and hidden costs like fee fragmentation and opportunity costs.

---

## Table of Contents

1. [Architecture & FIFO Engine](#architecture--fifo-engine)
2. [Data Models](#data-models)
3. [The Post-Trade Analysis Pipeline](#the-post-trade-analysis-pipeline)
4. [Key Metric Definitions](#key-metric-definitions)
5. [Case Studies (Real-World Analysis)](#case-studies-real-world-analysis)
6. [Frontend Information Architecture](#frontend-information-architecture)
7. [Technical Constraints & SLA](#technical-constraints--sla)

---

## Architecture & FIFO Engine

Unlike a standard order log, the Diagnostics module treats trades as "Round-trips." It uses a **FIFO (First-In-First-Out) Matching Engine** to pair Entry orders with Exit orders.

### The Identity Problem
A "Trade" is defined as a sequence of entries and exits where the **Net Quantity returns to Zero**. This allows the system to aggregate multiple scaling entries (e.g., buying 50, then 50) and multiple scaling exits into a single economic event.

### Core Components
*   **`ActiveTradeUnit`**: An ephemeral record tracking an open position's diagnostic state (total entry value, order IDs, first entry time).
*   **`Diagnostics Engine`**: An asynchronous process that triggers when an `ActiveTradeUnit` quantity hits zero.
*   **`TradeResult`**: The immutable, finalized record of the trade's history and performance metrics.

---

## Data Models

### TradeResult (The Finalized Output)
```go
type TradeResult struct {
    ID                 primitive.ObjectID `bson:"_id"`
    Symbol             string             `bson:"symbol"`
    Side               string             `bson:"side"` // LONG / SHORT
    Quantity           int64              `bson:"quantity"`
    AvgEntryPrice      float64            `bson:"avg_entry_price"`
    AvgExitPrice       float64            `bson:"avg_exit_price"`
    GrossPNL           float64            `bson:"gross_pnl"`
    NetPNL             float64            `bson:"net_pnl"`
    TotalCommissions   float64            `bson:"total_commissions"`
    MAE                float64            `bson:"mae"` // Max Adverse Excursion
    MFE                float64            `bson:"mfe"` // Max Favorable Excursion
    EntryTime          time.Time          `bson:"entry_time"`
    ExitTime           time.Time          `bson:"exit_time"`
    Duration           string             `bson:"duration"`
    CalculationVersion int                `bson:"calculation_version"`
}
```

---

## The Post-Trade Analysis Pipeline

When a trade is closed, the system performs a three-tier analysis:

1.  **Economic Consolidation**: Sums all entry values and exit values to calculate the precise **Gross P&L**.
2.  **Market Data Intersection**: 
    *   Queries historical **1-minute OHLC candles** for the instrument during the exact `[EntryTime, ExitTime]` window.
    *   Calculates the highest high (Favorable) and lowest low (Adverse).
    *   **Fallback Strategy**: If candle data is unavailable (e.g., for very recent trades), the engine uses **Execution Prices** as a lower-accuracy proxy.
3.  **Efficiency Audit**: Calculates Opportunity Cost based on the peak price reached during the hold.

---

## Key Metric Definitions

### 1. MAE (Max Adverse Excursion)
*   **Definition**: The maximum "unrealized loss" experienced during the trade.
*   **Trader Insight**: "How much did I have to sweat?" High MAE relative to profit indicates poor entry timing or a too-loose stop loss.

### 2. MFE (Max Favorable Excursion)
*   **Definition**: The maximum "unrealized profit" available during the trade.
*   **Trader Insight**: "What was the potential?" High MFE suggests the market gave you an opportunity to exit better.

### 3. Opportunity Cost
*   **Formula**: `abs(MFE - Actual Profit Per Share)`
*   **Definition**: The profit "left on the table."
*   **Trader Insight**: If Opp. Cost is consistently high, the trader is "giving back" gains or exiting too late.

---

## Case Studies (Real-World Analysis)

### Case Study A: Sub-optimal Execution (ADANIPORTS)

*   **Metric Analysis**:
    *   **MAE (₹0.6)**: The trade went deep into the red immediately.
    *   **Opp. Cost**: Low. The trader didn't leave much money on the table; the market simply didn't move.
    *   **Fee Leakage**: **₹60** in commissions. This trade used 3 orders (1 entry, 2 exits). Since each order is capped at ₹20, the fees were 3x the standard minimum, significantly hurting the Net P&L.

### Case Study B: Optimal Execution (RELIANCE)

*   **Metric Analysis**:
    *   **MAE (₹0)**: A "Clean Entry." The price never went below the entry price.
    *   **Opp. Cost (₹0)**: A "Perfect Exit." The trader sold at the exact 1-minute high.
    *   **Efficiency**: Minimized fees (₹40) by using a single entry and a single exit.

---

## Frontend Information Architecture

The UI is designed for **High-Density Auditability**:

*   **Collapsible Rows**: Allows the trader to switch between a high-level performance list and a deep-dive audit.
*   **Tooltip Explanations**: Every metric (MAE, MFE, Opp. Cost) includes a hovering guide to explain its significance to the user.
*   **Monospace Columns**: Numerical columns are aligned with monospace fonts for easy visual comparison of large portfolios.

---

## Technical Constraints & SLA

*   **Immutability**: Once a `TradeResult` is finalized, it is never modified. Versioning (`CalculationVersion`) allows for future recalculations if algorithms improve.
*   **Performance**: The page is optimized to load:
    *   < 300ms for 1,000 trades.
    *   < 800ms for 10,000 trades (using projection and indexing on `exit_time`).
*   **Asynchronous Engine**: MAE/MFE calculation runs in a background goroutine to ensure zero latency impact on the core matching engine.
