# Short Selling - Critical Edge Cases & Potential Bugs

## 🔴 CRITICAL ISSUES (Must Fix Before Production)

### 1. Race Condition: Concurrent Order Placement
**Scenario:** User rapidly places multiple short sell orders before first one executes

**Current Code:**
```go
// OrderService.PlaceOrder checks available margin
available := account.Balance - account.BlockedMargin
if available < requiredMargin {
    return error
}
```

**Problem:** 
- User has ₹1L balance
- Places Order 1: Short 100 TCS @ ₹3,500 (needs ₹70k margin) ✓
- **Immediately** places Order 2: Short 100 INFY @ ₹1,500 (needs ₹30k margin) ✓
- Both pass validation (both see ₹1L available)
- Both execute → Need ₹1L margin but only have ₹1L balance
- **Result:** Account goes negative or second order fails during settlement

**Fix Required:**
```go
// Use database transaction with row-level locking
tx := session.StartTransaction()
account := repo.FindByUserIDForUpdate(userID) // SELECT ... FOR UPDATE
// Now check and update atomically
```

**Severity:** 🔴 CRITICAL - Can cause account balance corruption

---

### 2. Margin Release Calculation Error
**Scenario:** Partial cover with floating point precision issues

**Current Code:**
```go
releaseRatio := float64(trade.Quantity) / float64(holding.Quantity)
marginToRelease := holding.BlockedMargin * releaseRatio
```

**Problem:**
- Short 100 shares, blocked margin = ₹70,000
- Cover 33 shares: releaseRatio = 33/100 = 0.33
- Release: ₹70,000 × 0.33 = ₹23,100
- Remaining: ₹70,000 - ₹23,100 = ₹46,900
- Cover 33 more: releaseRatio = 33/67 = 0.492537...
- Release: ₹46,900 × 0.492537 = ₹23,102
- Remaining: ₹46,900 - ₹23,102 = ₹23,798
- Cover final 34: Should release ₹23,798
- **But:** Rounding errors accumulate, might leave ₹0.01 - ₹1 stuck

**Fix Required:**
```go
if holding.Quantity == 0 {
    // Full close - release ALL remaining margin
    marginToRelease = holding.BlockedMargin
} else {
    // Partial close - proportional
    releaseRatio := float64(trade.Quantity) / float64(holding.Quantity + trade.Quantity)
    marginToRelease = holding.BlockedMargin * releaseRatio
}
```

**Severity:** 🟡 MEDIUM - Causes margin leakage over time

---

### 3. Stop Order Intent Loss on Restart
**Scenario:** Server crashes while stop order is pending

**Current Code:**
```go
// Stop order saved to DB with Intent field
// On restart, StopOrderService loads pending orders
```

**Problem:**
- User places BUY STOP @ ₹3,700 to cover short (Intent: CLOSE_SHORT)
- Order saved to DB
- **Server crashes**
- On restart, stop order monitoring resumes
- Stop triggers, creates child order
- **If Intent field is empty in DB** → Defaults to OPEN_LONG
- **Result:** User now has both short AND long position (violates single-direction policy)

**Verification Needed:**
```bash
# Check if Intent is properly persisted
db.orders.findOne({order_type: "STOP", intent: {$exists: false}})
```

**Fix Required:**
- Ensure Intent is NOT NULL in schema
- Add migration to set default Intent for existing stop orders
- Add validation: reject stop order creation if Intent is missing

**Severity:** 🔴 CRITICAL - Violates core business rule

---

### 4. Margin Monitor False Positives
**Scenario:** Price spike triggers false margin call

**Current Code:**
```go
// Runs every 3 minutes
equity := snapshot.TotalEquity
ratio := equity / blockedMargin
if ratio < 0.5 {
    sendCriticalAlert()
}
```

**Problem:**
- User has ₹1L equity, ₹70k blocked margin (ratio = 1.43) ✓
- **Flash crash:** Stock drops 10% for 30 seconds
- Margin monitor runs during crash
- Equity drops to ₹90k (ratio = 1.29) → Still OK
- **But if stock was shorted at ₹3,500 and spikes to ₹5,000:**
  - Liability: ₹5,000 × 100 = ₹5L
  - Proceeds: ₹3,500 × 100 = ₹3.5L
  - Equity: ₹1L + ₹3.5L - ₹5L = -₹50k
  - Ratio: -₹50k / ₹70k = -0.71 → CRITICAL ALERT
- **Then price reverts in 1 minute**
- User gets panic alert for temporary glitch

**Fix Required:**
```go
// Add hysteresis - require sustained breach
type MarginStatus struct {
    LastCheckRatio float64
    ConsecutiveWarnings int
    LastAlertTime time.Time
}

if ratio < 0.5 {
    status.ConsecutiveWarnings++
    if status.ConsecutiveWarnings >= 2 && time.Since(status.LastAlertTime) > 5*time.Minute {
        sendCriticalAlert()
        status.LastAlertTime = time.Now()
    }
} else {
    status.ConsecutiveWarnings = 0
}
```

**Severity:** 🟡 MEDIUM - Causes user anxiety, not financial loss

---

### 5. Negative Equity Not Prevented
**Scenario:** Price moves faster than margin monitor can react

**Current Code:**
```go
// Margin monitor runs every 3 minutes
// Only sends alerts, no auto-liquidation
```

**Problem:**
- User shorts 1000 TCS @ ₹3,500 with ₹7L margin
- Stock announces buyback at ₹5,000 (42% jump)
- **Gap up opening:** Stock opens at ₹5,200 (no trading between ₹3,500 and ₹5,200)
- Liability: ₹5,200 × 1000 = ₹52L
- Proceeds: ₹3,500 × 1000 = ₹35L
- Loss: ₹17L
- User equity: ₹7L - ₹17L = **-₹10L**
- Margin monitor detects after 3 minutes
- **Platform owes ₹10L**

**Fix Required:**
```go
// Add circuit breaker in PortfolioService.CaptureSnapshot
if equity < 0 {
    log.Printf("CRITICAL: User %s has negative equity: %.2f", userID, equity)
    // Force liquidate ALL positions immediately
    for _, holding := range holdings {
        if holding.PositionType == models.PositionShort {
            forceLiquidate(holding)
        }
    }
    // Notify admin
    notifyAdmin("Negative equity detected", userID, equity)
}
```

**Severity:** 🔴 CRITICAL - Platform financial risk

---

### 6. Blocked Margin Sync Drift
**Scenario:** Margin blocked on holding but not on account

**Current Code:**
```go
// PortfolioService.UpdatePosition
holding.BlockedMargin += marginToBlock
accountService.BlockMargin(userID, marginToBlock)
```

**Problem:**
- `holding.BlockedMargin` update succeeds
- `accountService.BlockMargin` fails (network error, DB timeout)
- **Result:** Holding shows ₹70k blocked, account shows ₹0 blocked
- User can place more orders than they should
- Portfolio summary shows wrong available cash

**Fix Required:**
```go
// Use database transaction
session := mongo.StartSession()
session.StartTransaction()

// Update holding
holdingRepo.Update(holding, session)

// Update account
accountRepo.UpdateBlockedMargin(accountID, amount, session)

// Commit atomically
session.CommitTransaction()
```

**Severity:** 🔴 CRITICAL - Data integrity violation

---

## 🟡 MEDIUM ISSUES (Should Fix Soon)

### 7. Pending Order Validation Race
**Scenario:** User places limit order, then immediately places market order

**Current Code:**
```go
pendingQty := GetPendingQuantity(userID, instrumentID, "CLOSE_SHORT")
totalCommitted := pendingQty + req.Quantity
if holding.Quantity < totalCommitted {
    return error
}
```

**Problem:**
- User has 100 shares short
- Places LIMIT order to cover 100 @ ₹3,200 (status: NEW)
- **Immediately** places MARKET order to cover 100
- `GetPendingQuantity` returns 100 (from limit order)
- Market order validation: 100 < (100 + 100) → **FAILS** ✓ (Correct)
- **But:** Limit order might never execute (price doesn't reach ₹3,200)
- User is stuck, can't cover position with market order

**Fix Required:**
```go
// Add order cancellation before placing conflicting order
// OR allow user to cancel pending orders from UI
// OR add "Replace" order type that cancels previous and places new
```

**Severity:** 🟡 MEDIUM - UX issue, not data corruption

---

### 8. Market Data Staleness
**Scenario:** Margin monitor uses stale price data

**Current Code:**
```go
marketData := s.marketService.GetMarketData(holding.InstrumentID.Hex())
currentPrice := marketData.LastPrice
```

**Problem:**
- Market data updates every 3 seconds (pricing engine)
- Margin monitor runs every 3 minutes
- **If market data service is down:**
  - `GetMarketData` returns last known price (could be hours old)
  - Margin calculation uses stale price
  - **Result:** False sense of security or false panic

**Fix Required:**
```go
marketData := s.marketService.GetMarketData(holding.InstrumentID.Hex())
if time.Since(marketData.UpdatedAt) > 1*time.Minute {
    log.Printf("WARNING: Stale market data for %s (age: %v)", holding.Symbol, time.Since(marketData.UpdatedAt))
    // Skip this holding or use conservative estimate
    continue
}
currentPrice := marketData.LastPrice
```

**Severity:** 🟡 MEDIUM - Risk management accuracy

---

### 9. Integer Overflow in Large Positions
**Scenario:** User shorts massive quantity

**Current Code:**
```go
quantity int // 32-bit or 64-bit?
totalCost := trade.Price * float64(trade.Quantity)
```

**Problem:**
- If `int` is 32-bit: max = 2,147,483,647
- User shorts 2 billion shares @ ₹1 = ₹2B
- **Overflow:** Quantity wraps to negative
- **Result:** System thinks user has -2B shares (long position?)

**Fix Required:**
```go
// Ensure quantity is int64 in models
type Holding struct {
    Quantity int64 `bson:"quantity" json:"quantity"`
}

// Add validation
if req.Quantity > 1_000_000 {
    return errors.New("quantity exceeds maximum allowed (1M shares)")
}
```

**Severity:** 🟢 LOW - Unlikely scenario, but catastrophic if it happens

---

### 10. Frontend State Desync
**Scenario:** User opens multiple browser tabs

**Current Code:**
```typescript
// PortfolioPage fetches data on mount
useEffect(() => {
    fetchData();
}, []);
```

**Problem:**
- User opens Tab 1: Shows 100 TCS short, ₹70k blocked
- User opens Tab 2: Shows same
- **In Tab 1:** Covers 50 shares
- Tab 1 updates: 50 TCS short, ₹35k blocked ✓
- **Tab 2:** Still shows 100 TCS short, ₹70k blocked ❌
- User in Tab 2 tries to cover 100 shares → **FAILS** (only 50 left)

**Fix Required:**
```typescript
// Add WebSocket subscription for portfolio updates
useEffect(() => {
    const ws = new WebSocket('/ws');
    ws.on('portfolio_update', (data) => {
        setSummaryData(data);
    });
    return () => ws.close();
}, []);

// Backend sends update after every trade
func (s *PortfolioService) UpdatePosition(...) {
    // ... update logic
    notificationService.BroadcastToUser(userID, "portfolio_update", newSummary)
}
```

**Severity:** 🟡 MEDIUM - UX confusion

---

## 🟢 LOW PRIORITY ISSUES (Nice to Have)

### 11. No Audit Trail for Margin Changes
**Problem:** Can't trace why blocked margin changed

**Fix:** Add `margin_transactions` collection:
```go
type MarginTransaction struct {
    UserID      primitive.ObjectID
    Amount      float64 // positive = block, negative = release
    Reason      string  // "OPEN_SHORT", "CLOSE_SHORT", "MANUAL_ADJUSTMENT"
    HoldingID   primitive.ObjectID
    Timestamp   time.Time
}
```

---

### 12. No Rate Limiting on Short Sells
**Problem:** User can spam short sell orders

**Fix:** Add rate limiter:
```go
if intent == "OPEN_SHORT" {
    count := orderRepo.CountRecentOrders(userID, 1*time.Minute)
    if count > 10 {
        return errors.New("rate limit exceeded: max 10 short sells per minute")
    }
}
```

---

### 13. No Position Size Limits
**Problem:** User can short unlimited quantity

**Fix:** Add position limits:
```go
maxPositionValue := account.Balance * 5 // 5x leverage
if positionValue > maxPositionValue {
    return errors.New("position size exceeds maximum allowed")
}
```

---

## 🔧 RECOMMENDED FIXES (Priority Order)

### Immediate (Before Production):
1. ✅ **Add database transactions for margin blocking** (Issue #6)
2. ✅ **Prevent negative equity with circuit breaker** (Issue #5)
3. ✅ **Fix race condition in order placement** (Issue #1)
4. ✅ **Ensure Intent persistence in stop orders** (Issue #3)

### Short Term (Week 1):
5. ✅ **Fix margin release rounding** (Issue #2)
6. ✅ **Add market data staleness check** (Issue #8)
7. ✅ **Add margin monitor hysteresis** (Issue #4)

### Medium Term (Month 1):
8. ✅ **Add WebSocket portfolio updates** (Issue #10)
9. ✅ **Add audit trail for margin** (Issue #11)
10. ✅ **Add position size limits** (Issue #13)

---

## 🧪 TESTING CHECKLIST

### Manual Tests:
- [ ] Place 2 short sell orders rapidly (< 100ms apart)
- [ ] Partial cover 3 times, verify margin fully released
- [ ] Restart server with pending stop order, verify intent preserved
- [ ] Simulate price spike, verify margin monitor doesn't spam alerts
- [ ] Short sell with insufficient margin, verify rejection
- [ ] Open 2 browser tabs, cover in one, verify other updates

### Automated Tests:
```go
func TestConcurrentShortSells(t *testing.T) {
    // Spawn 10 goroutines placing short sells simultaneously
    // Verify only valid orders succeed
}

func TestMarginReleaseRounding(t *testing.T) {
    // Cover in 7 partial orders
    // Verify final blocked margin = 0
}

func TestNegativeEquityPrevention(t *testing.T) {
    // Mock price jump causing negative equity
    // Verify circuit breaker triggers
}
```

---

## 📊 MONITORING RECOMMENDATIONS

### Alerts to Set Up:
1. **Negative Equity Alert**: `equity < 0` → Page on-call engineer
2. **Margin Drift Alert**: `abs(sum(holdings.blocked_margin) - account.blocked_margin) > 100` → Investigate
3. **Stale Price Alert**: `market_data.updated_at > 5 minutes ago` → Check pricing engine
4. **High Margin Usage**: `blocked_margin / balance > 0.8` → Monitor user

### Dashboards to Create:
- Total blocked margin across all users
- Number of active short positions
- Margin call frequency (warnings vs critical)
- Average time to cover short positions

---

## 🎯 CONCLUSION

**Current Risk Level:** 🟡 MEDIUM-HIGH

**Blockers for Production:**
- Issues #1, #3, #5, #6 MUST be fixed
- Comprehensive testing required
- Monitoring infrastructure needed

**Estimated Time to Production-Ready:** 2-3 days of focused work

**Recommendation:** Do NOT deploy to production until critical issues are resolved and tested.
