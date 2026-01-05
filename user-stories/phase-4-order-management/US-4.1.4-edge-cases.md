# Stop Order Edge Cases & Error Scenarios

## 1. Trigger Time Validation Failures

### 1.1 Insufficient Balance at Trigger Time

**Scenario**: User places BUY STOP order with sufficient balance, then withdraws funds before trigger.

**Flow**:
1. User balance: ₹500,000
2. Places BUY STOP for 100 shares at ₹4,500 stop price
3. Required funds: ₹450,000 (validated at placement ✓)
4. User withdraws ₹300,000 → balance: ₹200,000
5. Market price hits ₹4,500 → trigger activated
6. Balance check at trigger time: ₹200,000 < ₹450,000 ❌

**Handling**:
- Mark order status as `REJECTED`
- Set rejection reason: "Insufficient balance at trigger time"
- Log event: `{ event: 'TRIGGER_FAILED', reason: 'INSUFFICIENT_BALANCE', requiredFunds: 450000, availableFunds: 200000 }`
- Send user notification (email/push)
- Do NOT retry trigger

**Database State**:
```json
{
  "status": "REJECTED",
  "rejectionReason": "Insufficient balance at trigger time. Required: ₹450,000, Available: ₹200,000",
  "triggeredAt": "2026-01-05T10:15:23Z",
  "triggerPrice": 4500.00,
  "executedAt": null
}
```

---

### 1.2 Insufficient Holdings for SELL STOP

**Scenario**: User places SELL STOP but sells shares before trigger (once position tracking is implemented).

**Flow**:
1. User holds 200 shares of RELIANCE
2. Places SELL STOP for 200 shares at ₹2,400
3. User manually sells 150 shares → holdings: 50 shares
4. Market price hits ₹2,400 → trigger activated
5. Holdings check: 50 < 200 ❌

**Handling**:
- Option A: Reject entire order
- Option B: Partial execution (sell 50 shares only) - **NOT RECOMMENDED for Phase 4**
- **Chosen**: Reject with clear message

**Error Message**: "Insufficient holdings at trigger time. Required: 200 shares, Available: 50 shares"

---

## 2. Market Data Issues

### 2.1 Market Data Unavailable During Trigger Check

**Scenario**: Market data service is down or delayed during monitoring cycle.

**Flow**:
1. Stop order monitoring service runs every 3 seconds
2. At T+300s, attempts to fetch market data
3. Market data service returns error or timeout

**Handling**:
- **DO NOT** trigger order without price data
- Log warning: `{ event: 'MARKET_DATA_UNAVAILABLE', orderId: '...', timestamp: '...' }`
- Skip this monitoring cycle
- Retry on next cycle (T+303s)
- If market data unavailable for > 30 seconds:
  - Alert system administrators
  - Log critical error
  - Continue retrying (do not cancel orders)

**Code**:
```go
marketData, err := s.marketDataRepo.FindByInstrumentID(order.InstrumentID.Hex())
if err != nil || marketData == nil {
    log.Warn("Market data unavailable for order", "orderId", order.ID, "instrumentId", order.InstrumentID)
    return nil // Skip this cycle, retry next
}
```

---

### 2.2 Stale Market Data

**Scenario**: Market data is outdated (last update > 10 seconds ago).

**Flow**:
1. Current time: 10:15:30
2. Market data last updated: 10:15:15 (15 seconds ago)
3. Stop order monitoring detects stale data

**Handling**:
- Define staleness threshold: 10 seconds
- If `time.Now() - marketData.UpdatedAt > 10s`:
  - Log warning
  - Skip trigger check for this cycle
  - Alert if staleness persists > 30 seconds

**Code**:
```go
if time.Since(marketData.UpdatedAt) > 10*time.Second {
    log.Warn("Stale market data", "orderId", order.ID, "lastUpdate", marketData.UpdatedAt)
    return nil
}
```

---

## 3. Price Movement Edge Cases

### 3.1 Price Gap Through Stop Price

**Scenario**: Market gaps down overnight, skipping through stop price without trading at stop level.

**Example**:
- SELL STOP at ₹1,000
- Previous close: ₹1,020
- Market opens at ₹980 (gap down ₹40)

**Handling**:
- **Trigger immediately** when first price below stop is detected
- Record trigger price as first detected price (₹980)
- Execute at best available market price
- This is **expected behavior** - stop orders do NOT guarantee execution at stop price

**User Education**:
- UI tooltip: "Stop orders trigger when price reaches stop level but may execute at a different price due to market gaps or rapid movement"
- Show historical slippage statistics (future enhancement)

---

### 3.2 Price Whipsaw (Rapid Up/Down Movement)

**Scenario**: Price rapidly crosses stop price multiple times within seconds.

**Example**:
- SELL TRAILING STOP at ₹500
- T+0s: LTP = ₹505
- T+1s: LTP = ₹498 (below stop) → TRIGGER
- T+2s: LTP = ₹510 (back above stop)

**Handling**:
- **First trigger wins** - once triggered, order converts to MARKET
- Do not "un-trigger" if price moves back
- Trailing stop updates are atomic - use database locks to prevent race conditions

**Code**:
```go
// Use optimistic locking to prevent race conditions
filter := bson.M{"_id": order.ID, "status": "PENDING"}
update := bson.M{"$set": bson.M{"status": "TRIGGERED", "triggeredAt": time.Now()}}
result := s.orderRepo.UpdateOne(filter, update)
if result.ModifiedCount == 0 {
    // Another process already triggered this order
    return nil
}
```

---

### 3.3 Extreme Volatility (Circuit Breaker Hit)

**Scenario**: Stock hits circuit breaker (price limit), freezing trading.

**Example**:
- SELL STOP at ₹100
- Stock hits lower circuit at ₹95 (5% down)
- Trading halted

**Handling**:
- Trigger order when circuit breaker price is detected
- Market order will queue but may not execute until trading resumes
- This is **expected behavior** - stop orders do not guarantee execution
- Log event: `{ event: 'CIRCUIT_BREAKER_TRIGGER', orderId: '...', circuitPrice: 95 }`

---

## 4. Trailing Stop Specific Edge Cases

### 4.1 Trailing Stop Initialization with No Price History

**Scenario**: User places trailing stop immediately after market open with no prior price data.

**Handling**:
- Use current LTP as baseline
- Initialize `highestPrice` (for SELL) or `lowestPrice` (for BUY) to current LTP
- Calculate initial stop price from current LTP

**Code**:
```go
if order.HighestPrice == nil {
    currentPrice := marketData.LastPrice
    order.HighestPrice = &currentPrice
    
    if order.TrailType == "PERCENTAGE" {
        stopPrice := currentPrice * (1 - *order.TrailAmount/100)
        order.CurrentStopPrice = &stopPrice
    } else {
        stopPrice := currentPrice - *order.TrailAmount
        order.CurrentStopPrice = &stopPrice
    }
}
```

---

### 4.2 Trailing Stop Triggers Immediately After Placement

**Scenario**: User places SELL TRAILING STOP but market immediately drops.

**Example**:
- Current price: ₹1,000
- User places 5% trailing stop
- Initial stop price: ₹950
- Market immediately drops to ₹945
- Stop triggers within 3 seconds of placement

**Handling**:
- This is **valid behavior** - allow trigger
- UI warning: "Stop price is close to current market - may trigger immediately"
- Consider minimum distance requirement (e.g., stop must be at least 0.5% away)

**Validation**:
```go
minDistance := currentPrice * 0.005 // 0.5%
if math.Abs(currentPrice - *order.CurrentStopPrice) < minDistance {
    return errors.New("Stop price too close to market. Minimum distance: 0.5%")
}
```

---

### 4.3 Trailing Stop Never Moves (Price Only Goes Down)

**Scenario**: User places SELL TRAILING STOP but price never rises, only falls.

**Example**:
- Entry: ₹1,000
- 5% trailing stop → initial stop: ₹950
- Price drops to ₹980, then ₹960, then ₹940
- Stop price never updates (still ₹950)
- Eventually triggers at ₹950

**Handling**:
- This is **expected behavior**
- Trailing stops only move in favorable direction
- If price never moves favorably, acts like regular stop-loss

**User Education**:
- UI tooltip: "Trailing stops only adjust when price moves in your favor. If price only moves against you, it acts like a regular stop-loss."

---

## 5. Order Modification Edge Cases

### 5.1 Modify Stop Price While Market is Moving Toward Trigger

**Scenario**: User modifies stop price just before trigger.

**Example**:
- Original SELL STOP at ₹500
- Current price: ₹502 (approaching stop)
- User modifies stop to ₹490
- Price drops to ₹499 (would have triggered original stop)

**Handling**:
- Allow modification of PENDING orders
- Use new stop price immediately
- Original stop price is overwritten (not preserved in history)
- Log modification event for audit trail

**Audit Log**:
```json
{
  "event": "ORDER_MODIFIED",
  "orderId": "...",
  "changes": {
    "stopPrice": { "old": 500, "new": 490 }
  },
  "timestamp": "2026-01-05T10:15:23Z"
}
```

---

### 5.2 Cancel Stop Order During Trigger Check

**Scenario**: User cancels order at exact moment monitoring service is checking trigger.

**Handling**:
- Use database-level locking (optimistic or pessimistic)
- If cancel succeeds first → trigger check fails (order not found)
- If trigger succeeds first → cancel fails (order already triggered)
- Return appropriate error to user

**Code**:
```go
// Cancellation
filter := bson.M{"_id": order.ID, "status": "PENDING"}
update := bson.M{"$set": bson.M{"status": "CANCELLED"}}
result := s.orderRepo.UpdateOne(filter, update)
if result.ModifiedCount == 0 {
    return errors.New("Cannot cancel order - already triggered or not found")
}
```

---

## 6. Multiple Stop Orders on Same Instrument

### 6.1 Multiple Stop Orders Trigger Simultaneously

**Scenario**: User has 3 SELL STOP orders on same instrument, all trigger at once.

**Example**:
- Order A: SELL 100 at ₹500 stop
- Order B: SELL 150 at ₹495 stop
- Order C: SELL 200 at ₹490 stop
- Holdings: 500 shares
- Price drops to ₹485 → all 3 trigger

**Handling**:
- Trigger orders in sequence (by creation time or order ID)
- Validate holdings for each trigger
- If holdings exhausted, reject subsequent triggers

**Flow**:
1. Trigger Order A → sell 100 shares → holdings: 400
2. Trigger Order B → sell 150 shares → holdings: 250
3. Trigger Order C → attempt sell 200 shares → holdings: 250 ❌
4. Order C rejected: "Insufficient holdings at trigger time"

---

### 6.2 Conflicting Stop Orders (BUY and SELL)

**Scenario**: User has both BUY STOP and SELL STOP on same instrument (unusual but possible).

**Example**:
- Order A: BUY STOP 100 shares at ₹550 (breakout entry)
- Order B: SELL STOP 100 shares at ₹500 (stop-loss)
- Current price: ₹520

**Handling**:
- Allow both orders (valid use case for complex strategies)
- Trigger each independently based on conditions
- Validate balance/holdings for each trigger separately

---

## 7. System Failures & Recovery

### 7.1 Monitoring Service Crashes

**Scenario**: Stop order monitoring service crashes and restarts.

**Handling**:
- On restart, immediately query all PENDING stop orders
- Resume monitoring from current state
- No triggers are missed (orders remain PENDING in database)
- Log restart event for audit

**Recovery Code**:
```go
func (s *StopOrderService) Initialize() {
    pendingOrders, _ := s.orderRepo.FindPendingStopOrders()
    log.Info("Stop order monitor initialized", "pendingOrders", len(pendingOrders))
}
```

---

### 7.2 Database Connection Lost During Trigger

**Scenario**: Database connection fails while processing trigger.

**Handling**:
- Use database transactions for trigger execution
- If transaction fails, order remains PENDING
- Retry on next monitoring cycle
- Log error for investigation

**Code**:
```go
session, _ := s.db.StartSession()
defer session.EndSession(ctx)

err := session.StartTransaction()
if err != nil {
    return err
}

// Update order status
// Create market order
// Commit transaction

if err := session.CommitTransaction(ctx); err != nil {
    session.AbortTransaction(ctx)
    return err
}
```

---

## 8. User Experience Edge Cases

### 8.1 Stop Price Too Close to Market

**Scenario**: User sets stop price within 1 tick of current price.

**Handling**:
- Show warning: "⚠ Stop price very close to market - may trigger immediately"
- Require confirmation before placing order
- Consider minimum distance requirement (configurable)

**UI**:
```typescript
if (Math.abs(stopPrice - ltp) < instrument.tickSize * 5) {
  setWarning("Stop price is very close to current market price and may trigger immediately");
}
```

---

### 8.2 Illogical Stop Price

**Scenario**: User sets SELL STOP above current market price.

**Example**:
- Current price: ₹1,000
- User sets SELL STOP at ₹1,050

**Handling**:
- **Reject at placement time** with clear error
- Error: "SELL stop price must be below current market price (₹1,000). You entered ₹1,050."
- Suggest correct usage in error message

**Validation**:
```go
if order.Side == "SELL" && *order.StopPrice >= currentPrice {
    return fmt.Errorf(
        "SELL stop price must be below current market price (₹%.2f). You entered ₹%.2f. "+
        "Tip: SELL stops protect long positions by triggering when price falls.",
        currentPrice, *order.StopPrice,
    )
}
```

---

### 8.3 Extreme Trail Amount

**Scenario**: User sets 50% trailing stop (maximum allowed).

**Example**:
- Current price: ₹1,000
- 50% trailing stop → stop price: ₹500

**Handling**:
- Allow (within validation range)
- Show warning: "⚠ Large trail amount - stop price is ₹500 (50% below market)"
- Educate user on typical trail amounts (2-5%)

---

## 9. Audit & Compliance Edge Cases

### 9.1 Trigger Event Not Logged

**Scenario**: Trigger executes but logging fails.

**Handling**:
- Trigger execution is PRIMARY - do not block on logging failure
- Use async logging to prevent blocking
- If logging fails, queue for retry
- Alert if logging failures exceed threshold

**Code**:
```go
// Execute trigger first
err := s.TriggerStopOrder(order, triggerPrice)
if err != nil {
    return err
}

// Log asynchronously (non-blocking)
go func() {
    s.auditLogger.LogTriggerEvent(order, triggerPrice)
}()
```

---

### 9.2 Duplicate Trigger Events

**Scenario**: Race condition causes order to be triggered twice.

**Handling**:
- Use optimistic locking (update with status filter)
- Only first trigger succeeds
- Second trigger fails silently (order already triggered)

**Code**:
```go
filter := bson.M{"_id": order.ID, "status": "PENDING"}
update := bson.M{"$set": bson.M{"status": "TRIGGERED"}}
result := s.orderRepo.UpdateOne(filter, update)
if result.ModifiedCount == 0 {
    // Already triggered by another process
    return nil
}
```

---

## 10. Performance Edge Cases

### 10.1 Too Many Pending Stop Orders

**Scenario**: System has 10,000+ pending stop orders to monitor.

**Handling**:
- Batch process orders (e.g., 1,000 at a time)
- Use database indexes on `status` and `order_type`
- Consider horizontal scaling (multiple monitoring instances)
- Monitor query performance and alert if > 2 seconds

**Optimization**:
```go
// Fetch orders in batches
batchSize := 1000
skip := 0
for {
    orders, _ := s.orderRepo.FindPendingStopOrders(skip, batchSize)
    if len(orders) == 0 {
        break
    }
    s.ProcessOrderBatch(orders)
    skip += batchSize
}
```

---

### 10.2 High-Frequency Price Updates

**Scenario**: Market data updates every 100ms instead of 3 seconds.

**Handling**:
- Debounce trigger checks (max once per second per order)
- Use in-memory cache for recent price checks
- Avoid database writes for every price update (only on trigger or trail update)

---

## Summary of Handling Strategies

| Edge Case Category | Primary Strategy | Fallback Strategy |
|-------------------|------------------|-------------------|
| Validation Failures | Reject at trigger time | User notification + audit log |
| Market Data Issues | Skip cycle, retry | Alert if persistent (>30s) |
| Price Gaps | Trigger immediately | Log actual trigger price |
| System Failures | Database transactions | Retry on recovery |
| Race Conditions | Optimistic locking | Idempotency checks |
| Performance Issues | Batching + indexing | Horizontal scaling |
| User Errors | Validation + warnings | Clear error messages |

---

## Testing Recommendations

For each edge case:
1. **Unit Test**: Isolated logic testing
2. **Integration Test**: End-to-end flow with mocked dependencies
3. **Manual Test**: Real-world scenario simulation
4. **Load Test**: Performance under stress (for performance edge cases)

**Priority**: Test validation failures and trigger logic first (highest risk).
