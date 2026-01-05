# US-4.1.4 - Stop-Loss & Contingent Orders (Advanced)

**Epic:** Trading Engine  
**Phase:** Phase 4 - Order Management System  
**Status:** Not Started  
**Priority:** High  
**Complexity:** High

## User Story

As a **trader**  
I want to **place stop-loss, stop-limit, and trailing stop orders**  
So that I can **protect my capital, automate my exit strategy, and lock in profits without constant monitoring**.

## Business Context

Stop and contingent orders are essential risk management tools that allow traders to:
- **Protect capital** by automatically exiting losing positions
- **Lock in profits** as the market moves favorably
- **Execute disciplined trading** without emotional interference
- **Trade 24/7** with automated protection even when offline

These order types are standard in modern trading platforms and expected by retail traders.

## Acceptance Criteria

### 1. Stop-Loss Orders (Stop Market)
- [ ] Users can place STOP orders that trigger a MARKET order when the stop price is reached
- [ ] For **BUY STOP**: Trigger activates when LTP >= Stop Price (breakout entry)
- [ ] For **SELL STOP**: Trigger activates when LTP <= Stop Price (stop-loss exit)
- [ ] Stop orders remain in **PENDING** status until triggered
- [ ] Once triggered, stop orders convert to MARKET orders and execute immediately
- [ ] Users can view and cancel PENDING stop orders before they trigger

### 2. Stop-Limit Orders
- [ ] Users can place STOP-LIMIT orders with both a Stop Price and a Limit Price
- [ ] When Stop Price is reached, a LIMIT order is placed at the specified Limit Price
- [ ] For **BUY STOP-LIMIT**: Trigger when LTP >= Stop Price, then place BUY LIMIT at Limit Price
- [ ] For **SELL STOP-LIMIT**: Trigger when LTP <= Stop Price, then place SELL LIMIT at Limit Price
- [ ] Stop-Limit orders provide price protection but may not execute if market moves too fast
- [ ] Triggered limit orders follow standard limit order lifecycle (can remain unfilled)

### 3. Trailing Stop Orders
- [ ] Users can place TRAILING-STOP orders with a trail amount (Absolute ₹ or Percentage %)
- [ ] **Trail Type: ABSOLUTE** - Trail amount is a fixed rupee value (e.g., ₹10)
- [ ] **Trail Type: PERCENTAGE** - Trail amount is a percentage of current price (e.g., 2%)
- [ ] For **SELL TRAILING-STOP** (most common - protecting long positions):
    - Initial stop price = Entry Price - Trail Amount
    - As LTP increases, stop price automatically adjusts upward
    - Stop price NEVER decreases (locks in gains)
    - Triggers when LTP <= Current Stop Price
- [ ] For **BUY TRAILING-STOP** (protecting short positions):
    - Initial stop price = Entry Price + Trail Amount
    - As LTP decreases, stop price automatically adjusts downward
    - Stop price NEVER increases
    - Triggers when LTP >= Current Stop Price
- [ ] Trailing stop price updates are logged for audit trail
- [ ] Users can view current trailing stop price in real-time

### 4. Order Validation & Risk Checks
- [ ] Stop Price must be a valid price (positive, respects tick size)
- [ ] For STOP-LIMIT, Limit Price must also be valid
- [ ] For TRAILING-STOP, Trail Amount must be positive
- [ ] Percentage trail amounts must be between 0.1% and 50%
- [ ] Absolute trail amounts must be >= instrument tick size
- [ ] Stop orders validate balance/holdings at placement time (not trigger time)
- [ ] Reject illogical stop prices (e.g., SELL STOP above current market price)

### 5. Trigger Monitoring & Execution
- [ ] Background service monitors market data for all PENDING stop orders
- [ ] Trigger checks occur on every market data update (every 3 seconds minimum)
- [ ] When triggered, order status changes: PENDING → TRIGGERED → FILLED/REJECTED
- [ ] Triggered orders execute via existing order placement logic
- [ ] Failed triggers are logged with reason (e.g., insufficient balance at trigger time)
- [ ] Trigger events are recorded with timestamp and trigger price

### 6. User Interface & Experience
- [ ] TradePanel has "Advanced" mode toggle to show stop order options
- [ ] UI clearly explains each order type with tooltips/help text
- [ ] Visual preview of stop price relative to current market price
- [ ] For trailing stops, show both current stop price and trail amount
- [ ] Real-time updates of trailing stop prices in order list
- [ ] Clear visual distinction between PENDING, TRIGGERED, and FILLED stop orders
- [ ] Warning messages for potentially risky configurations

### 7. Order Management
- [ ] Users can view all PENDING stop orders in "Open Orders" list
- [ ] Users can cancel PENDING stop orders (before trigger)
- [ ] Users can modify stop price and trail amount of PENDING orders
- [ ] Once triggered, stop orders cannot be cancelled (follow normal order lifecycle)
- [ ] Order history shows full lifecycle: PENDING → TRIGGERED → FILLED

## Technical Requirements

### Backend (Go + MongoDB)

#### 1. Data Model Extensions

**Update `models/order.go`:**
```go
type Order struct {
    // ... existing fields ...
    
    // Stop Order Fields
    StopPrice      *float64 `bson:"stop_price,omitempty" json:"stopPrice,omitempty"`
    LimitPrice     *float64 `bson:"limit_price,omitempty" json:"limitPrice,omitempty"` // For STOP-LIMIT
    
    // Trailing Stop Fields
    TrailAmount    *float64 `bson:"trail_amount,omitempty" json:"trailAmount,omitempty"`
    TrailType      string   `bson:"trail_type,omitempty" json:"trailType,omitempty"` // ABSOLUTE / PERCENTAGE
    CurrentStopPrice *float64 `bson:"current_stop_price,omitempty" json:"currentStopPrice,omitempty"` // For trailing stops
    HighestPrice   *float64 `bson:"highest_price,omitempty" json:"highestPrice,omitempty"` // For SELL trailing stops
    LowestPrice    *float64 `bson:"lowest_price,omitempty" json:"lowestPrice,omitempty"`  // For BUY trailing stops
    
    // Trigger Tracking
    TriggeredAt    *time.Time `bson:"triggered_at,omitempty" json:"triggeredAt,omitempty"`
    TriggerPrice   *float64   `bson:"trigger_price,omitempty" json:"triggerPrice,omitempty"`
    ParentOrderID  *primitive.ObjectID `bson:"parent_order_id,omitempty" json:"parentOrderId,omitempty"` // Links triggered order to original stop order
}
```

**Add new order types to validation:**
- `STOP` - Stop Market Order
- `STOP_LIMIT` - Stop Limit Order
- `TRAILING_STOP` - Trailing Stop Order

**Add new order statuses:**
- `PENDING` - Stop order waiting for trigger
- `TRIGGERED` - Stop order has been triggered and converted to market/limit order

#### 2. Service Layer

**Create `services/stop_order_service.go`:**
```go
type StopOrderService struct {
    orderRepo      *repositories.OrderRepository
    marketDataRepo *repositories.MarketDataRepository
    orderService   *OrderService
}

// Core Methods:
// - ValidateStopOrder(order *models.Order) error
// - MonitorStopOrders() // Background goroutine
// - CheckTriggerConditions(order *models.Order, currentPrice float64) bool
// - TriggerStopOrder(order *models.Order, triggerPrice float64) error
// - UpdateTrailingStop(order *models.Order, currentPrice float64) error
```

**Key Logic:**
1. **Validation**: Ensure stop price, limit price, and trail amounts are valid
2. **Trigger Detection**: Compare current LTP against stop price based on order side
3. **Trailing Stop Updates**: Adjust stop price as market moves favorably
4. **Order Conversion**: Convert triggered stop orders to market/limit orders
5. **Error Handling**: Handle insufficient balance, market data unavailable, etc.

#### 3. Background Monitoring Service

**Implement in `cmd/server/main.go` or separate worker:**
```go
func StartStopOrderMonitor(stopOrderService *StopOrderService) {
    ticker := time.NewTicker(3 * time.Second) // Match market data update frequency
    go func() {
        for range ticker.C {
            stopOrderService.MonitorStopOrders()
        }
    }()
}
```

**Monitoring Flow:**
1. Fetch all PENDING stop orders from database
2. For each order, fetch current market data (LTP)
3. Check if trigger conditions are met
4. If triggered, execute order conversion
5. For trailing stops, update stop price if market moved favorably
6. Log all trigger events and price updates

#### 4. API Endpoints

**Extend `POST /api/orders`:**
- Accept new order types: STOP, STOP_LIMIT, TRAILING_STOP
- Validate stop-specific fields
- Set initial status to PENDING for stop orders

**Add `GET /api/orders/pending-stops`:**
- Return all PENDING stop orders for user
- Include current stop price for trailing stops

**Extend `PUT /api/orders/:id`:**
- Allow modification of stop price and trail amount
- Only for PENDING orders

**Add `GET /api/orders/:id/trigger-history`:**
- Return trigger events and price updates for a stop order

#### 5. Database Indexes

```javascript
// Optimize stop order monitoring queries
db.orders.createIndex({ "status": 1, "order_type": 1, "stop_price": 1 })
db.orders.createIndex({ "user_id": 1, "status": 1 })
```

### Frontend (TypeScript + React)

#### 1. Enhanced TradePanel Component

**Add Advanced Mode Toggle:**
```typescript
const [advancedMode, setAdvancedMode] = useState(false);
const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TRAILING_STOP'>('LIMIT');
```

**New Input Fields:**
- Stop Price (for STOP and STOP_LIMIT)
- Limit Price (for STOP_LIMIT)
- Trail Amount (for TRAILING_STOP)
- Trail Type selector (ABSOLUTE / PERCENTAGE)

**Visual Enhancements:**
- Price ladder showing current LTP, stop price, and limit price
- Real-time calculation of trailing stop price
- Warning indicators for potentially risky configurations
- Tooltips explaining each order type

#### 2. Stop Order Visualization

**Create `StopOrderIndicator.tsx`:**
- Visual representation of stop price relative to current price
- Color-coded based on order side (green for BUY, red for SELL)
- Shows distance from current price (absolute and percentage)

**Create `TrailingStopVisualizer.tsx`:**
- Shows current stop price and trail amount
- Displays highest/lowest price reached
- Real-time updates as market moves

#### 3. Order List Enhancements

**Update `OpenOrders` component:**
- Show stop-specific fields (stop price, trail amount)
- Display current trailing stop price with live updates
- Add "Trigger Price" column for triggered orders
- Visual status indicators: PENDING (yellow), TRIGGERED (blue), FILLED (green)

#### 4. Types & Interfaces

**Update `types/order.types.ts`:**
```typescript
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TRAILING_STOP';
export type TrailType = 'ABSOLUTE' | 'PERCENTAGE';
export type OrderStatus = 'NEW' | 'PENDING' | 'TRIGGERED' | 'FILLED' | 'CANCELLED' | 'REJECTED';

export interface StopOrderFields {
  stopPrice?: number;
  limitPrice?: number;
  trailAmount?: number;
  trailType?: TrailType;
  currentStopPrice?: number;
  triggeredAt?: string;
  triggerPrice?: number;
}

export interface Order extends StopOrderFields {
  // ... existing fields ...
}
```

#### 5. Service Layer

**Update `orderService.ts`:**
```typescript
export const orderService = {
  placeStopOrder: (order: StopOrderRequest) => api.post('/orders', order),
  getPendingStops: () => api.get('/orders/pending-stops'),
  modifyStopOrder: (id: string, updates: StopOrderUpdates) => api.put(`/orders/${id}`, updates),
  getTriggerHistory: (id: string) => api.get(`/orders/${id}/trigger-history`),
};
```

## Edge Cases & Error Scenarios

### 1. Trigger Time Validation Failures
**Scenario**: Stop order triggers but insufficient balance at trigger time  
**Handling**: 
- Mark order as REJECTED with reason "Insufficient balance at trigger time"
- Send notification to user
- Log event for audit

### 2. Market Data Unavailable
**Scenario**: Cannot fetch LTP during trigger check  
**Handling**:
- Skip trigger check for this cycle
- Log warning
- Retry on next monitoring cycle
- Alert if market data unavailable for > 30 seconds

### 3. Rapid Price Movement
**Scenario**: Price gaps through stop price (e.g., stop at ₹100, but price jumps from ₹102 to ₹98)  
**Handling**:
- Trigger order immediately when gap is detected
- Record actual trigger price (₹98 in example)
- Execute at best available market price

### 4. Trailing Stop Initialization
**Scenario**: User places trailing stop but no recent price history  
**Handling**:
- Use current LTP as baseline
- Initialize highest/lowest price to current LTP
- Begin trailing from current price

### 5. Conflicting Stop Orders
**Scenario**: User places multiple stop orders on same instrument  
**Handling**:
- Allow multiple stop orders (valid use case)
- Trigger each independently
- Validate holdings/balance for each trigger

### 6. Stop Price Too Close to Market
**Scenario**: User sets stop price within 1 tick of current price  
**Handling**:
- Show warning: "Stop price very close to market - may trigger immediately"
- Allow order but require confirmation
- Consider minimum distance requirement (e.g., 0.5%)

### 7. Trailing Stop in Volatile Market
**Scenario**: Price whipsaws rapidly, trailing stop triggers prematurely  
**Handling**:
- This is expected behavior - trailing stops are sensitive
- Educate users via UI tooltips
- Consider adding "activation price" feature in future (trail only starts after price moves favorably)

## Dependencies

### Required (Must be complete before implementation)
- ✅ US-4.1.1: Order Placement - Core order infrastructure
- ✅ US-4.1.2: Order Management - Cancel/modify functionality
- ✅ US-2.2.1: Market Data Feed - Real-time price updates for trigger monitoring

### Optional (Can be implemented in parallel)
- US-4.1.3: Order History - Enhanced to show trigger events
- US-4.1.5: Validity & Margin Control - Day/IOC/GTD validity for stop orders

## Non-Goals (Explicit Scope Exclusions)

- ❌ **Bracket Orders** (OCO - One-Cancels-Other) - Separate user story
- ❌ **Iceberg Orders** - Separate advanced order type
- ❌ **Conditional Orders** (based on other instruments) - Future enhancement
- ❌ **Stop-Loss with Target** (combined order) - Use bracket orders instead
- ❌ **Activation Price** for trailing stops - Future enhancement
- ❌ **WebSocket-based real-time triggers** - Using polling for Phase 4

## Implementation Phases

### Phase 1: Foundation 
1. Extend Order model with stop order fields
2. Implement stop order validation in OrderService
3. Create basic stop order placement API
4. Update frontend TradePanel with advanced mode

### Phase 2: Trigger Monitoring 
1. Implement StopOrderService with trigger logic
2. Create background monitoring service
3. Implement stop order conversion to market orders
4. Add trigger event logging

### Phase 3: Trailing Stops 
1. Implement trailing stop price calculation
2. Add highest/lowest price tracking
3. Implement automatic stop price updates
4. Create real-time UI updates for trailing stops

### Phase 4: Stop-Limit Orders 
1. Extend trigger logic for limit order conversion
2. Implement limit price validation
3. Update UI for limit price input
4. Test stop-limit execution flow

### Phase 5: Testing & Refinement
1. Comprehensive testing of all order types
2. Edge case handling and error scenarios
3. Performance optimization of monitoring service
4. UI/UX refinements based on testing

## Testing Strategy

### Unit Tests
- Stop order validation logic
- Trigger condition detection
- Trailing stop price calculation
- Order conversion logic

### Integration Tests
- End-to-end stop order placement
- Trigger monitoring with simulated market data
- Order lifecycle: PENDING → TRIGGERED → FILLED
- Database persistence of trigger events

### Manual Testing Scenarios
1. **Basic Stop-Loss**: Place SELL STOP, simulate price drop, verify trigger
2. **Trailing Stop**: Place SELL TRAILING-STOP, simulate price rise then fall, verify stop price updates and trigger
3. **Stop-Limit**: Place STOP-LIMIT, verify limit order placed at trigger, verify limit order execution
4. **Rapid Price Movement**: Simulate price gap through stop price, verify immediate trigger
5. **Insufficient Balance**: Place stop order, reduce balance, trigger order, verify rejection
6. **Multiple Stop Orders**: Place multiple stops on same instrument, verify independent triggers
7. **Cancel Pending Stop**: Place stop order, cancel before trigger, verify cancellation
8. **Modify Pending Stop**: Place stop order, modify stop price, verify update

## Success Metrics

- [ ] Users can successfully place all three stop order types
- [ ] Stop orders trigger within 5 seconds of price reaching stop level
- [ ] Trailing stops update correctly as market moves (100% accuracy)
- [ ] Zero false triggers (orders trigger only when conditions are met)
- [ ] UI clearly explains order types (measured by reduced support queries)
- [ ] Background monitoring service handles 1000+ concurrent stop orders efficiently

## Security & Risk Considerations

1. **Authorization**: Verify user owns order before trigger execution
2. **Balance Validation**: Re-check balance at trigger time, not just placement time
3. **Rate Limiting**: Prevent abuse of stop order placement
4. **Audit Trail**: Log all trigger events with timestamp, price, and reason
5. **Monitoring Alerts**: Alert admins if monitoring service fails or lags
6. **Data Integrity**: Ensure stop price updates are atomic and consistent

## Documentation Requirements

- [ ] API documentation for stop order endpoints
- [ ] User guide explaining each order type with examples
- [ ] Developer guide for stop order monitoring service
- [ ] Troubleshooting guide for common issues
- [ ] Database schema documentation for stop order fields

## Future Enhancements (Post-Phase 4)

1. **Bracket Orders**: Combined stop-loss and target orders (OCO)
2. **Activation Price**: Trailing stops activate only after price moves favorably
3. **Time-based Stops**: Stop orders that activate at specific times
4. **Conditional Stops**: Trigger based on other instruments or indicators
5. **WebSocket Triggers**: Real-time trigger detection (sub-second latency)
6. **Smart Trailing**: Dynamic trail amounts based on volatility
7. **Stop Order Analytics**: Show historical trigger accuracy and slippage

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
| 2026-01-05 | AI Assistant | Comprehensive enhancement with detailed requirements, edge cases, and implementation plan |
