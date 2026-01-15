# US-5.1 - Portfolio Overview & Holdings Management

**Epic:** Portfolio Management  
**Phase:** Phase 5 - Portfolio & Risk Management  
**Status:** Completed  
**Priority:** High  
**Complexity:** Medium

## User Story

As a **trader**  
I want to **view my current holdings and portfolio performance**  
So that I can **track my positions, P&L, and make informed trading decisions**.

## Business Context

After placing and managing orders, traders need visibility into:
- **Current positions** (what they own)
- **Profit & Loss** (unrealized and realized)
- **Portfolio value** (total worth)
- **Performance metrics** (day change, overall returns)

This completes the core trading loop: Place Order → Monitor Order → View Position → Manage Position.

## Acceptance Criteria

### 1. Portfolio Summary Dashboard

**Display Metrics:**
- [ ] **Total Portfolio Value** (sum of all holdings at current market price + cash)
- [ ] **Cash Available** (buying power)
- [ ] **Total Invested** (total cost basis of all positions)
- [ ] **Total P&L** (unrealized + realized)
  - Absolute value (₹)
  - Percentage (%)
- [ ] **Day Change** (today's P&L)
  - Absolute value (₹)
  - Percentage (%)
- [ ] **Total Returns** (all-time P&L)

**Visual Design:**
- [ ] Large, prominent cards for key metrics
- [ ] Color-coded: Green for gains, Red for losses
- [ ] Trend indicators (up/down arrows)
- [ ] Refresh button for real-time updates

---

### 2. Holdings List

**Display Columns:**
- [ ] **Instrument** (symbol, name)
- [ ] **Quantity** (shares owned)
- [ ] **Avg Cost** (average purchase price)
- [ ] **Current Price** (live market price)
- [ ] **Current Value** (quantity × current price)
- [ ] **P&L** (current value - total cost)
  - Absolute (₹)
  - Percentage (%)
- [ ] **Day Change** (today's price movement)
- [ ] **Actions** (Buy More, Sell, View Details)

**Features:**
- [ ] Sortable columns (by P&L, value, symbol, etc.)
- [ ] Search/filter by symbol
- [ ] Color-coded P&L (green/red)
- [ ] Click row to expand details
- [ ] Real-time price updates

---

### 3. Position Details (Expanded Row)

**Show:**
- [ ] **Purchase History** (all buy transactions for this position)
  - Date, quantity, price, total cost
- [ ] **Sale History** (all sell transactions)
  - Date, quantity, price, total proceeds
- [ ] **Realized P&L** (from closed positions)
- [ ] **Unrealized P&L** (from open positions)
- [ ] **Average Cost Calculation** (FIFO/LIFO/Weighted Average)
- [ ] **Quick Actions**
  - "Buy More" → Opens TradePanel with symbol pre-filled
  - "Sell All" → Opens TradePanel with quantity = current holding
  - "Sell Partial" → Opens TradePanel for partial exit

---

### 4. Real-Time Updates

**Behavior:**
- [ ] Portfolio value updates as market prices change
- [ ] P&L recalculates in real-time
- [ ] Visual indicator when prices update (pulse/flash)
- [ ] Auto-refresh every 3-5 seconds (configurable)
- [ ] Manual refresh button

---

### 5. Empty State

**When no holdings:**
- [ ] Show friendly message: "No holdings yet"
- [ ] CTA button: "Start Trading" → Navigate to Markets
- [ ] Educational content: "Build your portfolio by placing your first order"

---

## Technical Requirements

### Backend

#### 1. Position Model

```go
type Position struct {
    ID           primitive.ObjectID `bson:"_id,omitempty"`
    UserID       primitive.ObjectID `bson:"userId"`
    AccountID    primitive.ObjectID `bson:"accountId"`
    InstrumentID primitive.ObjectID `bson:"instrumentId"`
    Symbol       string             `bson:"symbol"`
    
    // Quantity
    Quantity     int                `bson:"quantity"`      // Current holding
    
    // Cost Basis
    AvgCost      float64            `bson:"avgCost"`       // Average purchase price
    TotalCost    float64            `bson:"totalCost"`     // Total invested
    
    // P&L
    RealizedPL   float64            `bson:"realizedPL"`    // From closed positions
    UnrealizedPL float64            `bson:"unrealizedPL"`  // From open positions
    
    // Metadata
    FirstBuyDate time.Time          `bson:"firstBuyDate"`
    LastUpdated  time.Time          `bson:"lastUpdated"`
}
```

#### 2. Transaction Model (for history)

```go
type Transaction struct {
    ID           primitive.ObjectID `bson:"_id,omitempty"`
    UserID       primitive.ObjectID `bson:"userId"`
    AccountID    primitive.ObjectID `bson:"accountId"`
    InstrumentID primitive.ObjectID `bson:"instrumentId"`
    Symbol       string             `bson:"symbol"`
    
    Type         string             `bson:"type"`          // BUY, SELL
    Quantity     int                `bson:"quantity"`
    Price        float64            `bson:"price"`
    TotalValue   float64            `bson:"totalValue"`    // Qty × Price
    Fees         float64            `bson:"fees"`
    
    OrderID      primitive.ObjectID `bson:"orderId"`       // Link to order
    ExecutedAt   time.Time          `bson:"executedAt"`
}
```

#### 3. Portfolio Service

**Methods:**
- `GetPortfolioSummary(userID, accountID)` → Portfolio metrics
- `GetHoldings(userID, accountID)` → List of positions
- `GetPositionDetails(positionID)` → Detailed position info
- `GetTransactionHistory(userID, accountID, instrumentID)` → Trade history
- `UpdatePosition(transaction)` → Update position after trade execution
- `CalculateUnrealizedPL(position, currentPrice)` → Real-time P&L

**Position Update Logic (on order fill):**
```
BUY Order Filled:
  - Increase quantity
  - Recalculate avgCost: (totalCost + newCost) / totalQuantity
  - Update totalCost
  - Create Transaction record

SELL Order Filled:
  - Decrease quantity
  - Calculate realizedPL: (sellPrice - avgCost) × soldQty
  - Update totalCost proportionally
  - Create Transaction record
  - If quantity = 0, mark position as closed
```

#### 4. API Endpoints

```
GET  /api/portfolio/summary        → Portfolio summary
GET  /api/portfolio/holdings       → List of holdings
GET  /api/portfolio/positions/:id  → Position details
GET  /api/portfolio/transactions   → Transaction history
```

---

### Frontend

#### 1. Components

**PortfolioPage.tsx:**
- Main page component
- Layout: Summary cards + Holdings table

**PortfolioSummary.tsx:**
- Display portfolio metrics
- Large metric cards
- Color-coded P&L

**HoldingsList.tsx:**
- Table of current positions
- Sortable, searchable
- Expandable rows

**PositionDetails.tsx:**
- Expanded row content
- Transaction history
- Quick action buttons

**PortfolioMetricCard.tsx:**
- Reusable metric display
- Value, change, percentage
- Trend indicator

#### 2. Services

**portfolioService.ts:**
```typescript
export interface PortfolioSummary {
  totalValue: number;
  cashAvailable: number;
  totalInvested: number;
  totalPL: number;
  totalPLPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface Holding {
  id: string;
  instrumentId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  currentValue: number;
  totalCost: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export const portfolioService = {
  getPortfolioSummary: () => Promise<PortfolioSummary>,
  getHoldings: () => Promise<Holding[]>,
  getPositionDetails: (id: string) => Promise<PositionDetails>,
  getTransactionHistory: (instrumentId?: string) => Promise<Transaction[]>,
};
```

#### 3. Hooks

**usePortfolio.ts:**
```typescript
export const usePortfolio = () => {
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch portfolio data
  // Auto-refresh every 5 seconds
  // Calculate real-time P&L with market data
  
  return { summary, holdings, isLoading, refresh };
};
```

**useRealTimePL.ts:**
```typescript
// Subscribes to market data updates
// Recalculates P&L as prices change
// Returns updated holdings with live P&L
```

---

## Data Flow

### 1. Order Execution → Position Update

```
Order Filled (FILLED status)
    ↓
OrderService.handleOrderFill()
    ↓
PortfolioService.UpdatePosition(transaction)
    ↓
Calculate new avgCost, quantity, realizedPL
    ↓
Save Position + Transaction to DB
```

### 2. Portfolio Display

```
User opens Portfolio page
    ↓
Fetch Holdings from DB
    ↓
Fetch current market prices
    ↓
Calculate unrealizedPL for each position
    ↓
Calculate portfolio summary
    ↓
Display with real-time updates
```

---

## UI/UX Design

### Color Palette

**P&L Colors:**
- Positive: `success.main` (#2e7d32 green)
- Negative: `error.main` (#d32f2f red)
- Neutral: `text.secondary` (gray)

**Metric Cards:**
- Background: `background.paper`
- Border: `divider`
- Hover: Subtle elevation increase

### Typography

**Portfolio Value:**
- Font: `fontFamily: 'Inter'`
- Size: `variant: 'h3'`
- Weight: `fontWeight: 800`

**P&L Display:**
- Font: `fontFamily: 'monospace'`
- Size: `variant: 'h6'` for main, `'body2'` for secondary
- Weight: `fontWeight: 700`

### Layout

**Desktop:**
```
┌─────────────────────────────────────────┐
│  Portfolio Summary (4 metric cards)    │
├─────────────────────────────────────────┤
│  Holdings Table                         │
│  ┌────────────────────────────────────┐ │
│  │ Symbol │ Qty │ Avg │ Current │ P&L │ │
│  ├────────────────────────────────────┤ │
│  │ TCS    │ 10  │ 100 │ 110     │ +10%│ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Mobile:**
- Stacked metric cards (2 per row)
- Simplified holdings list (card view)
- Swipe to reveal actions

---

## Implementation Phases

### Phase 1: Backend Foundation (3-4 hours)
1. Create Position and Transaction models
2. Create PortfolioRepository
3. Create PortfolioService with position update logic
4. Create API endpoints
5. Integrate with OrderService (update positions on fill)

### Phase 2: Frontend Display (3-4 hours)
1. Create portfolioService.ts
2. Create usePortfolio hook
3. Create PortfolioSummary component
4. Create HoldingsList component
5. Create PortfolioPage

### Phase 3: Real-Time Updates (2-3 hours)
1. Integrate with market data
2. Calculate live P&L
3. Add auto-refresh
4. Add visual update indicators

### Phase 4: Position Details & Actions (2-3 hours)
1. Create PositionDetails component
2. Add transaction history
3. Add quick action buttons
4. Integrate with TradePanel

**Total Estimated Time: 10-14 hours**

---

## Success Metrics

- [ ] Users can view all holdings in one place
- [ ] P&L calculations are accurate (verified against manual calculation)
- [ ] Real-time updates work smoothly (< 5 second delay)
- [ ] Position updates correctly after order fills
- [ ] Transaction history is complete and accurate

---

## Dependencies

**Required:**
- ✅ US-4.1.1: Order Placement (orders must fill to create positions)
- ✅ US-3.1.3: Market Data (for current prices)
- ❌ US-3.1.4: Account Finances (for cash balance) - Can use placeholder

**Optional:**
- US-4.1.5: Validity & Margin (for buying power calculation)
- US-5.2: Performance Analytics (for advanced metrics)

---

## Non-Goals (Out of Scope)

- ❌ Tax lot tracking (FIFO/LIFO selection)
- ❌ Dividend tracking
- ❌ Corporate actions (splits, mergers)
- ❌ Multi-currency support
- ❌ Performance charts/graphs (separate user story)
- ❌ Export to CSV/PDF (future enhancement)

---

## Testing Strategy

### Unit Tests
- Position update calculations (avgCost, P&L)
- Transaction creation
- Portfolio summary aggregation

### Integration Tests
- Order fill → Position update flow
- Real-time P&L calculation
- API endpoint responses

### Manual Testing
1. Place BUY order → Verify position created
2. Place another BUY → Verify avgCost updated
3. Place SELL order → Verify quantity decreased, realizedPL calculated
4. Check portfolio summary → Verify totals match
5. Test real-time updates → Verify P&L changes with market price

---

## Future Enhancements

1. **Performance Charts** - Visual P&L over time
2. **Sector Allocation** - Pie chart of holdings by sector
3. **Diversification Score** - Risk analysis
4. **Tax Reports** - Capital gains/losses
5. **Export** - CSV/PDF download
6. **Alerts** - Notify when position hits target P&L

---

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-06 | AI Assistant | Initial creation based on requirements gathering |
