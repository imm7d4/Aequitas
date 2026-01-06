# US-6.1 - Order Matching & Execution Engine

**Epic:** Matching Engine  
**Phase:** Phase 6 - Matching Engine (CORE)  
**Status:** Not Started  
**Priority:** Critical  
**Complexity:** High

## User Story

As a **trader**  
I want my **orders to be executed and filled automatically**  
So that I can **actually buy and sell securities and build positions**.

## Business Context

**Current Problem:**
- Orders are placed but never executed
- Orders stay in NEW/PENDING status forever
- No trades happen, no positions created
- Portfolio & Holdings feature is blocked

**Solution:**
A matching engine that:
- Executes MARKET orders instantly at current price
- Matches LIMIT orders when price conditions are met
- Creates trade records and updates positions
- Enables the complete trading lifecycle

---

## Acceptance Criteria

### 1. MARKET Order Execution

**Behavior:**
- [ ] MARKET orders execute **immediately** upon placement
- [ ] Fill price = current market price (last traded price)
- [ ] Order status changes: NEW → FILLED
- [ ] Execution happens within 100ms of order placement
- [ ] Trade record created with execution details

**Example:**
```
User places: BUY 10 TCS @ MARKET
Current price: ₹1,055.86
Result: Order filled at ₹1,055.86, total cost = ₹10,558.60
```

---

### 2. LIMIT Order Matching

**Behavior:**
- [ ] LIMIT orders wait in order book until price condition met
- [ ] **BUY LIMIT:** Executes when market price ≤ limit price
- [ ] **SELL LIMIT:** Executes when market price ≥ limit price
- [ ] Orders matched using **Price-Time Priority**
  - Best price first
  - Earlier timestamp wins for same price
- [ ] Order status: NEW → FILLED (when matched)

**Example:**
```
User places: BUY 10 TCS @ ₹1,050 LIMIT
Current price: ₹1,055
Status: NEW (waiting)

Later, price drops to ₹1,049
Result: Order filled at ₹1,050 (limit price), total cost = ₹10,500
```

---

### 3. Stop Order Execution (Integration)

**Behavior:**
- [ ] When stop order triggers → creates MARKET/LIMIT order
- [ ] Triggered order goes through matching engine
- [ ] STOP → MARKET: Executes immediately
- [ ] STOP_LIMIT → LIMIT: Waits for limit price match

**Flow:**
```
STOP order triggers → Create MARKET order → Match immediately → FILLED
STOP_LIMIT triggers → Create LIMIT order → Wait for match → FILLED
```

---

### 4. Trade Record Creation

**For each execution:**
- [ ] Create Trade record with:
  - Trade ID
  - Order ID (link to original order)
  - User ID, Account ID
  - Instrument ID, Symbol
  - Side (BUY/SELL)
  - Quantity filled
  - Execution price
  - Total value (qty × price)
  - Fees/commissions
  - Execution timestamp
- [ ] Update order status to FILLED
- [ ] Update order filledQuantity field

---

### 5. Partial Fills (Future Enhancement)

**For now (MVP):**
- [ ] All orders fill completely (no partial fills)
- [ ] Order is either 100% filled or not filled

**Future:**
- Partial fills for large orders
- Multiple trade records per order
- PARTIALLY_FILLED status

---

### 6. Order Book Management

**Simplified Approach (MVP):**
- [ ] No persistent order book (for now)
- [ ] LIMIT orders checked against current market price
- [ ] If price matches, execute immediately
- [ ] No order book depth/levels

**Future:**
- Full order book with bid/ask levels
- Market depth display
- Order book matching algorithm

---

## Technical Requirements

### Backend

#### 1. Trade Model

```go
type Trade struct {
    ID           primitive.ObjectID `bson:"_id,omitempty"`
    TradeID      string             `bson:"tradeId"`      // Unique trade identifier
    
    // Order Reference
    OrderID      primitive.ObjectID `bson:"orderId"`
    
    // Parties
    UserID       primitive.ObjectID `bson:"userId"`
    AccountID    primitive.ObjectID `bson:"accountId"`
    
    // Instrument
    InstrumentID primitive.ObjectID `bson:"instrumentId"`
    Symbol       string             `bson:"symbol"`
    
    // Trade Details
    Side         string             `bson:"side"`         // BUY, SELL
    Quantity     int                `bson:"quantity"`
    Price        float64            `bson:"price"`        // Execution price
    TotalValue   float64            `bson:"totalValue"`   // Qty × Price
    
    // Fees
    Commission   float64            `bson:"commission"`
    Fees         float64            `bson:"fees"`
    NetValue     float64            `bson:"netValue"`     // Total ± Fees
    
    // Metadata
    ExecutedAt   time.Time          `bson:"executedAt"`
    CreatedAt    time.Time          `bson:"createdAt"`
}
```

#### 2. Matching Engine Service

**MatchingService:**
```go
type MatchingService struct {
    orderRepo      *OrderRepository
    tradeRepo      *TradeRepository
    marketDataRepo *MarketDataRepository
}

// Core Methods
func (s *MatchingService) ExecuteMarketOrder(order *Order) error
func (s *MatchingService) CheckLimitOrders() error
func (s *MatchingService) CreateTrade(order *Order, price float64) (*Trade, error)
func (s *MatchingService) UpdateOrderStatus(orderID, status string) error
```

**ExecuteMarketOrder Logic:**
```go
1. Get current market price for instrument
2. Calculate total value (qty × price)
3. Calculate fees/commission
4. Create Trade record
5. Update Order status to FILLED
6. Update Order filledQuantity
7. Trigger position update (for US-5.1)
8. Return trade details
```

**CheckLimitOrders Logic:**
```go
1. Fetch all NEW LIMIT orders
2. For each order:
   - Get current market price
   - Check if price condition met:
     * BUY: currentPrice <= limitPrice
     * SELL: currentPrice >= limitPrice
   - If matched: Execute order
3. Run periodically (every 1-3 seconds)
```

#### 3. Background Worker

**Limit Order Monitor:**
```go
// Runs every 3 seconds
func (s *MatchingService) MonitorLimitOrders() {
    ticker := time.NewTicker(3 * time.Second)
    for range ticker.C {
        s.CheckLimitOrders()
    }
}
```

#### 4. API Endpoints

```
POST /api/trades/execute/:orderId  → Manual execution (testing)
GET  /api/trades                   → List trades
GET  /api/trades/:id               → Trade details
GET  /api/trades/order/:orderId    → Trades for specific order
```

#### 5. Order Model Updates

**Add fields:**
```go
type Order struct {
    // ... existing fields ...
    
    FilledQuantity int       `bson:"filledQuantity"` // Quantity filled
    AvgFillPrice   float64   `bson:"avgFillPrice"`   // Average fill price
    FilledAt       time.Time `bson:"filledAt"`       // When fully filled
}
```

---

### Frontend

#### 1. Trade Service

**tradeService.ts:**
```typescript
export interface Trade {
  id: string;
  tradeId: string;
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalValue: number;
  commission: number;
  fees: number;
  netValue: number;
  executedAt: string;
}

export const tradeService = {
  getTrades: () => Promise<Trade[]>,
  getTradeDetails: (id: string) => Promise<Trade>,
  getTradesForOrder: (orderId: string) => Promise<Trade[]>,
};
```

#### 2. UI Updates

**OrderList Component:**
- Show "FILLED" status badge (green)
- Display fill price and quantity
- Show execution timestamp
- Link to trade details

**Trade Confirmation Toast:**
```
✅ Order Filled!
BUY 10 TCS @ ₹1,055.86
Total: ₹10,558.60
```

---

## Execution Flow

### MARKET Order Flow

```
1. User places MARKET order
   ↓
2. OrderService.PlaceOrder()
   ↓
3. Order saved with status: NEW
   ↓
4. MatchingService.ExecuteMarketOrder()
   ↓
5. Get current market price
   ↓
6. Create Trade record
   ↓
7. Update Order status: FILLED
   ↓
8. Return success to user
   ↓
9. Show "Order Filled" notification
```

**Time:** < 100ms

---

### LIMIT Order Flow

```
1. User places LIMIT order
   ↓
2. OrderService.PlaceOrder()
   ↓
3. Order saved with status: NEW
   ↓
4. Return "Order placed" to user
   ↓
5. Background: MatchingService monitors every 3s
   ↓
6. Check if price condition met
   ↓
7. If YES: Execute order (create trade, update status)
   ↓
8. Send notification to user (WebSocket/polling)
```

**Time:** Variable (depends on market price)

---

## Fee Calculation

**Simple Fee Structure (MVP):**
```
Commission = 0.05% of trade value
Fees = ₹10 flat fee per trade

For BUY:
  Total Cost = (Qty × Price) + Commission + Fees

For SELL:
  Net Proceeds = (Qty × Price) - Commission - Fees
```

**Example:**
```
BUY 10 TCS @ ₹1,055.86
Trade Value = ₹10,558.60
Commission = ₹5.28 (0.05%)
Fees = ₹10
Total Cost = ₹10,573.88
```

---

## Implementation Phases

### Phase 1: MARKET Order Execution (3-4 hours)
1. Create Trade model and repository
2. Create MatchingService
3. Implement ExecuteMarketOrder()
4. Integrate with OrderService
5. Test MARKET order flow

### Phase 2: LIMIT Order Matching (3-4 hours)
1. Implement CheckLimitOrders()
2. Create background monitor
3. Test LIMIT order matching
4. Add price condition logic

### Phase 3: Stop Order Integration (2-3 hours)
1. Update StopOrderService to use MatchingService
2. Test STOP → MARKET execution
3. Test STOP_LIMIT → LIMIT execution

### Phase 4: Frontend & Notifications (2-3 hours)
1. Create tradeService
2. Update OrderList to show FILLED status
3. Add trade confirmation toasts
4. Test end-to-end flow

**Total Estimated Time: 10-14 hours**

---

## Success Metrics

- [ ] MARKET orders execute within 100ms
- [ ] LIMIT orders match when price condition met
- [ ] Trade records created accurately
- [ ] Order status updates correctly
- [ ] No orphaned orders (stuck in NEW)
- [ ] Fees calculated correctly

---

## Dependencies

**Required:**
- ✅ US-4.1.1: Order Placement
- ✅ US-3.1.3: Market Data (for current prices)

**Enables:**
- ❌ US-5.1: Portfolio & Holdings (blocked until this is done)
- ❌ US-7.1: Settlement & Positions

---

## Non-Goals (Out of Scope)

- ❌ Real order book with depth levels
- ❌ Partial fills (all-or-nothing for now)
- ❌ Order matching between users (simulated fills only)
- ❌ Market maker logic
- ❌ Slippage simulation
- ❌ Advanced order types (Iceberg, FOK, etc.)

---

## Testing Strategy

### Unit Tests
- ExecuteMarketOrder logic
- CheckLimitOrders price conditions
- Fee calculations
- Trade record creation

### Integration Tests
- MARKET order → Trade → FILLED flow
- LIMIT order → Wait → Match → FILLED flow
- STOP order → Trigger → Execute → FILLED flow

### Manual Testing
1. Place MARKET BUY → Verify instant fill
2. Place LIMIT BUY above market → Verify instant fill
3. Place LIMIT BUY below market → Verify waits, then fills when price drops
4. Place STOP order → Trigger → Verify execution
5. Check trade records in database
6. Verify fees calculated correctly

---

## Future Enhancements

1. **Order Book** - Full bid/ask levels
2. **Partial Fills** - Large orders filled incrementally
3. **Market Depth** - Show order book to users
4. **Matching Algorithm** - Pro-rata, FIFO, etc.
5. **Slippage** - Realistic price impact
6. **Cross-User Matching** - Match buy/sell between users

---

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-06 | AI Assistant | Initial creation - critical missing piece identified |
