# Portfolio Module Documentation

## Overview

The Portfolio module is a critical component of the Aequitas trading platform that provides users with a comprehensive view of their financial position, including net worth, cash liquidity, position holdings, profit/loss metrics, and risk exposure. This module follows a trader-centric mental model and implements high-density information architecture for professional use.

---

## Table of Contents

1. [Architecture](#architecture)
2. [User Mental Model](#user-mental-model)
3. [Component Structure](#component-structure)
4. [Data Flow](#data-flow)
5. [Key Features](#key-features)
6. [UI/UX Design Principles](#uiux-design-principles)
7. [API Contracts](#api-contracts)
8. [State Management](#state-management)
9. [Implementation Details](#implementation-details)
10. [Testing Considerations](#testing-considerations)

---

## Architecture

### High-Level Structure

```
Portfolio Module
├── Pages
│   └── PortfolioPage.tsx          # Main container with tab navigation
├── Components
│   ├── PortfolioSummary.tsx       # Overview dashboard (high-density)
│   ├── HoldingsTable.tsx          # Position management table
│   └── ShortRiskWidget.tsx        # Risk exposure indicator (legacy)
└── Services
    └── portfolioService.ts        # API communication layer
```

### Technology Stack

- **Frontend Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Real-time Data**: Custom `useMarketData` hook
- **Styling**: MUI `sx` prop with theme integration

---

## User Mental Model

The Portfolio module is designed around the **trader's decision-making sequence**:

1. **"How much am I worth?"** → Net Worth (Total Equity)
2. **"How much can I use right now?"** → Free Cash (Withdrawable)
3. **"What can blow me up?"** → Short Risk & Margin Health
4. **"Where is my money deployed?"** → Holdings Breakdown

This sequence dictates the **visual hierarchy** and **information ordering** throughout the UI.

---

## Component Structure

### 1. PortfolioPage.tsx

**Purpose**: Main container component with tab-based navigation

**Key Responsibilities**:
- Fetch portfolio summary data from backend
- Calculate real-time portfolio metrics using market prices
- Manage tab state (Overview vs. Holdings)
- Orchestrate data flow to child components

**Tab Structure**:
- **Overview Tab**: High-density financial dashboard
- **Holdings Tab**: Full-height table for position management

**State Management**:
```typescript
const [summaryData, setSummaryData] = useState<PortfolioSummaryData | null>(null);
const [tabValue, setTabValue] = useState(0); // 0 = Overview, 1 = Holdings
```

**Real-time Calculation**:
```typescript
const displaySummary = useMemo(() => {
    // Recalculates portfolio metrics using live market prices
    // Ensures P&L, equity, and holdings values are always current
}, [summaryData, marketPrices]);
```

---

### 2. PortfolioSummary.tsx

**Purpose**: High-density overview dashboard displaying financial snapshot

**Design Philosophy**: 
- **Density > Aesthetics**: Maximize information per viewport
- **Exact Values**: No abbreviations (Cr, L) - show full rupee amounts
- **Trader Mental Model**: Information ordered by decision priority

**Layout Structure**:

#### Row 1: Portfolio Snapshot (4-column grid)
```
┌─────────────────────────────────────────────────────────┐
│ Net Worth    Free Cash    Margin Used    Short Risk    │
│ ₹11,08,75,952 ₹10,74,23,452 ₹4,23,483    ₹22,17,514   │
│ -₹433 (U)    Withdrawable  Locked        Liability     │
└─────────────────────────────────────────────────────────┘
```

**Purpose**: One-glance financial posture

#### Row 2: Equity Breakdown + Cash & Liquidity (2-column grid)

**Left Column - Equity Breakdown**:
- Cash
- Long Holdings
- Short Liability (if applicable)
- Unrealized P&L
- Realized P&L

**Right Column - Cash & Liquidity**:
- Total Cash
  - • Free Cash (withdrawable)
  - • Margin (locked)
  - • Pending (T+1/T+2 settlement)
- Available to Trade

#### Row 3: Short Risk & Margin Health (conditional)

Only displayed when short positions exist.

```
┌──────────────────────────────────────────────────────┐
│ ⚠️ SHORT RISK & MARGIN HEALTH          [2 Shorts]    │
│                                                      │
│ Liability: ₹22,17,514  +5%: ₹1,06,875  +10%: ₹2,12L │
│ MARGIN BUFFER ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%               │
│ ₹3,39,802 remaining • Trigger: ₹3,39,802            │
└──────────────────────────────────────────────────────┘
```

**Risk Metrics**:
- Current Liability: Market value of borrowed shares
- +5% Risk: Additional loss if prices rise 5%
- +10% Risk: Additional loss if prices rise 10%
- Margin Buffer: Visual progress bar (green/amber/red)
- Margin Call Trigger: Price level that triggers margin call

**Visual Indicators**:
- Green buffer: >30% remaining
- Amber buffer: 15-30% remaining
- Red buffer: <15% remaining (critical)

---

### 3. HoldingsTable.tsx

**Purpose**: Detailed position management table

**Features**:
- Full-height viewport utilization
- Real-time P&L calculation
- Position type indicators (LONG/SHORT)
- Sortable columns
- Sticky header
- Dense row spacing

**Columns**:
- Instrument Symbol
- Quantity
- Avg Entry Price
- Current Price (LTP)
- Current Value
- Blocked Margin
- P&L (absolute + percentage)
- Actions (Sell/Cover buttons)

**Design Patterns**:
- Matches `InstrumentList` grid styling
- Hover effects for row highlighting
- Color-coded P&L (green profit, red loss)
- Explicit +/- signs for accessibility

---

## Data Flow

### Backend → Frontend

```
┌─────────────────────────────────────────────────────────┐
│ Backend: portfolio_controller.go                        │
│ GET /api/portfolio/summary                              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Response: PortfolioSummaryData                          │
│ {                                                       │
│   totalEquity, cashBalance, blockedMargin,              │
│   unrealizedPL, realizedPL,                             │
│   freeCash, marginCash, settlementPending,              │
│   holdings: [...],                                      │
│   shortRiskExposure: { ... }                            │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Frontend: portfolioService.ts                           │
│ getSummary() → PortfolioSummaryData                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ PortfolioPage.tsx                                       │
│ - Fetches data on mount                                 │
│ - Subscribes to real-time market prices                 │
│ - Recalculates metrics with live prices                 │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ PortfolioSummary / HoldingsTable                        │
│ - Renders with calculated data                          │
│ - Updates on price changes                              │
└─────────────────────────────────────────────────────────┘
```

### Real-time Price Updates

```typescript
// PortfolioPage.tsx
const instrumentIds = useMemo(() => holdings.map(h => h.instrumentId), [holdings]);
const marketData = useMarketData(instrumentIds); // WebSocket subscription

const displaySummary = useMemo(() => {
    // Recalculate portfolio metrics using live prices
    holdings.forEach(h => {
        const ltp = marketPrices[h.instrumentId] || h.avgEntryPrice;
        // Update current value, P&L, etc.
    });
}, [summaryData, marketPrices]);
```

---

## Key Features

### 1. Cash Breakdown

**Problem Solved**: Users couldn't distinguish between withdrawable cash and locked margin.

**Implementation**:
- **Backend**: Added `freeCash`, `marginCash`, `settlementPending` fields to `TradingAccount` model
- **Calculation**: 
  ```
  freeCash = Balance - BlockedMargin - SettlementPending
  marginCash = BlockedMargin
  settlementPending = (future: T+1/T+2 tracking)
  ```
- **UI**: Hierarchical display with indentation

**Accounting Invariant**:
```
Balance = Free Cash + Margin Collateral + Settlement Pending
```

---

### 2. Short Position Risk Awareness

**Problem Solved**: Users had no visibility into short position risk exposure.

**Implementation**:
- **Backend**: Calculate risk scenarios in `portfolio_controller.go`
  ```go
  risk5Percent := currentLiability * 0.05
  risk10Percent := currentLiability * 0.10
  marginCallTrigger := blockedMargin * 0.8
  availableBuffer := marginCallTrigger - currentLiability
  ```
- **Frontend**: Visual progress bar with color-coded buffer levels

**Risk Scenarios**:
- **+5% Move**: Additional loss if all short positions rise 5%
- **+10% Move**: Additional loss if all short positions rise 10%
- **Margin Call**: Trigger price when buffer exhausted

---

### 3. Tab-Based Navigation

**Rationale**:
- **Overview Tab**: Quick financial health check (high frequency)
- **Holdings Tab**: Position management (action-oriented)

**Benefits**:
- Holdings table gets 100% viewport height
- Cleaner information hierarchy
- Reduced cognitive load
- Industry-standard pattern (Zerodha, Interactive Brokers)

---

### 4. High-Density Layout

**Design Principles**:
1. **Minimal Padding**: 1.25-1.5 units (12-16px)
2. **Compact Spacing**: 0.4-0.75 units between rows
3. **Monospace Fonts**: All currency values use `Roboto Mono`
4. **No Abbreviations**: Full rupee amounts (₹11,08,75,952 not ₹11.08 Cr)
5. **Reduced Font Sizes**: 0.65-0.95rem for density

**Rationale**: Professional traders prefer information density over whitespace.

---

## UI/UX Design Principles

### 1. Accessibility

**Colorblind Support**:
- Explicit +/- signs for all P&L values
- Not relying solely on color (green/red)

**Example**:
```typescript
{isUnrealizedProfit ? '+' : '-'}₹{Math.abs(totalPL).toLocaleString('en-IN')}
```

### 2. Visual Hierarchy

**Size = Importance**:
- Net Worth: Largest (primary metric)
- P&L: Large (secondary)
- Details: Medium (tertiary)

**Color = Meaning**:
- Primary (blue): Net Worth, Available to Trade
- Success (green): Profits, Free Cash
- Error (red): Losses, Short Liability
- Warning (amber): Risk indicators

### 3. Responsive Design

- **Desktop**: Side-by-side grids
- **Tablet**: Stacked columns
- **Mobile**: Single column (future enhancement)

---

## API Contracts

### GET /api/portfolio/summary

**Response**:
```typescript
interface PortfolioSummaryData {
    totalEquity: number;
    totalHoldingsValue: number;
    cashBalance: number;
    blockedMargin: number;
    unrealizedPL: number;
    unrealizedPLPercent: number;
    realizedPL: number;
    holdingsCount: number;
    holdings: Holding[];
    
    // Cash breakdown
    freeCash: number;
    marginCash: number;
    settlementPending: number;
    
    // Short risk (optional)
    shortRiskExposure?: {
        currentLiability: number;
        risk5Percent: number;
        risk10Percent: number;
        marginCallTrigger: number;
        availableBuffer: number;
    };
}

interface Holding {
    id: string;
    instrumentId: string;
    symbol: string;
    quantity: number;
    avgEntryPrice: number;
    positionType: 'LONG' | 'SHORT';
    blockedMargin: number;
}
```

---

## State Management

### Component State

**PortfolioPage**:
```typescript
const [summaryData, setSummaryData] = useState<PortfolioSummaryData | null>(null);
const [isLoading, setIsLoading] = useState(true);
const [tabValue, setTabValue] = useState(0);
```

### Derived State

**Real-time Calculations**:
```typescript
const displaySummary = useMemo(() => {
    // Recalculate with live market prices
    // Ensures UI always shows current values
}, [summaryData, marketPrices]);

const holdings = summaryData?.holdings || [];
const instrumentIds = useMemo(() => holdings.map(h => h.instrumentId), [holdings]);
```

### Market Data Subscription

```typescript
const marketData = useMarketData(instrumentIds);
const marketPrices = useMemo(() => {
    const prices: Record<string, number> = {};
    marketData.forEach(md => {
        prices[md.instrumentId] = md.ltp;
    });
    return prices;
}, [marketData]);
```

---

## Implementation Details

### 1. Cash Breakdown Calculation (Backend)

```go
// portfolio_controller.go
freeCash := account.Balance - account.BlockedMargin - settlementPending
marginCash := account.BlockedMargin
settlementPending := 0.0 // TODO: Implement T+1/T+2 tracking

response := map[string]interface{}{
    "freeCash":           freeCash,
    "marginCash":         marginCash,
    "settlementPending":  settlementPending,
    // ...
}
```

### 2. Short Risk Calculation (Backend)

```go
// Only calculate if short positions exist
if hasShortPositions {
    currentLiability := calculateShortLiability(holdings, marketPrices)
    risk5 := currentLiability * 0.05
    risk10 := currentLiability * 0.10
    marginCallTrigger := account.BlockedMargin * 0.8
    buffer := marginCallTrigger - currentLiability
    
    response["shortRiskExposure"] = map[string]interface{}{
        "currentLiability":   currentLiability,
        "risk5Percent":       risk5,
        "risk10Percent":      risk10,
        "marginCallTrigger":  marginCallTrigger,
        "availableBuffer":    buffer,
    }
}
```

### 3. Real-time P&L Calculation (Frontend)

```typescript
// PortfolioPage.tsx
const calculatedSummary = useMemo(() => {
    let totalUnrealizedPL = 0;
    
    holdings.forEach(h => {
        const ltp = marketPrices[h.instrumentId] || h.avgEntryPrice;
        const pl = (ltp - h.avgEntryPrice) * h.quantity;
        totalUnrealizedPL += pl;
    });
    
    return {
        ...summaryData,
        unrealizedPL: totalUnrealizedPL,
        unrealizedPLPercent: (totalUnrealizedPL / totalInvested) * 100
    };
}, [summaryData, marketPrices]);
```

---

## Testing Considerations

### Unit Tests

**PortfolioService**:
- Test API response parsing
- Test error handling
- Mock HTTP requests

**PortfolioSummary**:
- Test metric calculations
- Test conditional rendering (short risk)
- Test color coding logic

### Integration Tests

- Test real-time price updates
- Test tab navigation
- Test data flow from API to UI

### E2E Tests

- Navigate to Portfolio page
- Verify all metrics display correctly
- Switch between tabs
- Verify holdings table functionality

### Edge Cases

- **No Holdings**: Empty state handling
- **Only Long Positions**: Short risk section hidden
- **Only Short Positions**: Proper liability display
- **Zero Cash**: Negative free cash scenario
- **Margin Call**: Critical buffer state

---

## Future Enhancements

### Planned Features

1. **Settlement Pending Tracking**: Implement T+1/T+2 settlement logic
2. **Withdrawal Guardrail**: Block withdrawals exceeding free cash
3. **Top Holdings Preview**: Condensed table in Overview (currently removed)
4. **Portfolio Analytics**: Historical performance charts
5. **Export Functionality**: Download portfolio statement

### Technical Debt

- [ ] Implement proper settlement pending calculation
- [ ] Add loading skeletons for better UX
- [ ] Optimize re-renders with React.memo
- [ ] Add error boundaries
- [ ] Implement retry logic for failed API calls

---

## Troubleshooting

### Common Issues

**Issue**: P&L not updating in real-time
- **Cause**: Market data subscription not active
- **Fix**: Verify `useMarketData` hook is receiving instrument IDs

**Issue**: Short risk section not displaying
- **Cause**: No short positions or backend not calculating
- **Fix**: Check `hasShortPositions` logic and backend response

**Issue**: Cash breakdown doesn't add up
- **Cause**: Settlement pending not implemented
- **Fix**: Currently expected, settlement tracking is TODO

---

## Code Style Guidelines

### Naming Conventions

- **Components**: PascalCase (`PortfolioSummary`)
- **Props Interfaces**: PascalCase with `Props` suffix
- **State Variables**: camelCase (`summaryData`)
- **Constants**: UPPER_SNAKE_CASE

### TypeScript

- Always define prop interfaces
- Use explicit return types for functions
- Prefer `interface` over `type` for objects
- Use optional chaining (`?.`) for nullable values

### Styling

- Use MUI `sx` prop for inline styles
- Use theme values (`theme.palette`, `theme.spacing`)
- Prefer `fontFamily: '"Roboto Mono", monospace'` for numbers
- Use `toLocaleString('en-IN')` for Indian number formatting

---

## References

- [Material-UI Documentation](https://mui.com/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Portfolio UX Analysis](./portfolio_ux_analysis.md)
- [Tab Structure Analysis](./portfolio_tab_structure_analysis.md)
- [Overview Design Analysis](./overview_design_analysis.md)
