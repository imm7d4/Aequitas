# Stop Order Implementation Examples

## Example 1: Basic Stop-Loss Order (SELL STOP)

### Scenario
Trader owns 100 shares of RELIANCE bought at ₹2,500. Wants to limit loss to 5%.

### Order Placement
```json
POST /api/orders
{
  "instrumentId": "507f1f77bcf86cd799439011",
  "symbol": "RELIANCE",
  "side": "SELL",
  "orderType": "STOP",
  "quantity": 100,
  "stopPrice": 2375.00,
  "clientOrderId": "uuid-123"
}
```

### Execution Flow
1. **T+0s**: Order placed, status = PENDING
2. **T+300s**: Market price drops to ₹2,380 (still above stop)
3. **T+600s**: Market price drops to ₹2,370 (below stop price)
4. **T+603s**: Trigger detected, order converts to MARKET SELL
5. **T+605s**: Market order executes at ₹2,368 (slight slippage)
6. **Final Status**: FILLED at ₹2,368

### Database State After Trigger
```json
{
  "id": "...",
  "orderType": "STOP",
  "status": "TRIGGERED",
  "stopPrice": 2375.00,
  "triggeredAt": "2026-01-05T10:10:03Z",
  "triggerPrice": 2370.00,
  "parentOrderId": null
}
```

---

## Example 2: Trailing Stop Order (SELL TRAILING-STOP with Percentage)

### Scenario
Trader owns 50 shares of TCS bought at ₹3,500. Wants to protect profits with 3% trailing stop.

### Order Placement
```json
POST /api/orders
{
  "instrumentId": "507f1f77bcf86cd799439012",
  "symbol": "TCS",
  "side": "SELL",
  "orderType": "TRAILING_STOP",
  "quantity": 50,
  "trailAmount": 3.0,
  "trailType": "PERCENTAGE",
  "clientOrderId": "uuid-456"
}
```

### Execution Flow with Price Updates

| Time | LTP | Highest Price | Stop Price (3% below) | Action |
|------|-----|---------------|----------------------|--------|
| T+0s | ₹3,500 | ₹3,500 | ₹3,395 | Order placed (PENDING) |
| T+60s | ₹3,550 | ₹3,550 | ₹3,443.50 | Stop price updated ⬆ |
| T+120s | ₹3,600 | ₹3,600 | ₹3,492 | Stop price updated ⬆ |
| T+180s | ₹3,650 | ₹3,650 | ₹3,540.50 | Stop price updated ⬆ |
| T+240s | ₹3,620 | ₹3,650 | ₹3,540.50 | No change (price dropped) |
| T+300s | ₹3,580 | ₹3,650 | ₹3,540.50 | No change |
| T+360s | ₹3,530 | ₹3,650 | ₹3,540.50 | **TRIGGERED** (LTP < Stop) |

### Final Result
- **Entry**: ₹3,500
- **Peak**: ₹3,650 (+4.3%)
- **Exit**: ₹3,530 (approx, after trigger)
- **Profit**: ₹30/share = ₹1,500 total

---

## Example 3: Stop-Limit Order (BUY STOP-LIMIT for Breakout)

### Scenario
Trader wants to buy INFY if it breaks above resistance at ₹1,500, but only up to ₹1,505.

### Order Placement
```json
POST /api/orders
{
  "instrumentId": "507f1f77bcf86cd799439013",
  "symbol": "INFY",
  "side": "BUY",
  "orderType": "STOP_LIMIT",
  "quantity": 100,
  "stopPrice": 1500.00,
  "limitPrice": 1505.00,
  "clientOrderId": "uuid-789"
}
```

### Execution Flow - Scenario A (Successful Fill)
1. **T+0s**: Order placed, status = PENDING
2. **T+600s**: LTP = ₹1,502 (stop triggered)
3. **T+603s**: LIMIT BUY order placed at ₹1,505
4. **T+610s**: Limit order fills at ₹1,503
5. **Final Status**: FILLED at ₹1,503

### Execution Flow - Scenario B (Limit Not Filled)
1. **T+0s**: Order placed, status = PENDING
2. **T+600s**: LTP = ₹1,502 (stop triggered)
3. **T+603s**: LIMIT BUY order placed at ₹1,505
4. **T+610s**: Price jumps to ₹1,510 (above limit)
5. **T+900s**: Price stays above ₹1,505
6. **Final Status**: TRIGGERED but limit order remains OPEN/UNFILLED

---

## Example 4: Absolute Trailing Stop (SELL TRAILING-STOP)

### Scenario
Trader owns 200 shares of HDFC bought at ₹1,600. Wants ₹50 trailing stop.

### Order Placement
```json
POST /api/orders
{
  "instrumentId": "507f1f77bcf86cd799439014",
  "symbol": "HDFC",
  "side": "SELL",
  "orderType": "TRAILING_STOP",
  "quantity": 200,
  "trailAmount": 50.00,
  "trailType": "ABSOLUTE",
  "clientOrderId": "uuid-101"
}
```

### Execution Flow

| Time | LTP | Highest Price | Stop Price (LTP - ₹50) | Action |
|------|-----|---------------|------------------------|--------|
| T+0s | ₹1,600 | ₹1,600 | ₹1,550 | Order placed |
| T+60s | ₹1,625 | ₹1,625 | ₹1,575 | Stop updated ⬆ |
| T+120s | ₹1,650 | ₹1,650 | ₹1,600 | Stop updated ⬆ |
| T+180s | ₹1,640 | ₹1,650 | ₹1,600 | No change |
| T+240s | ₹1,595 | ₹1,650 | ₹1,600 | **TRIGGERED** |

---

## Example 5: Edge Case - Insufficient Balance at Trigger Time

### Scenario
Trader places stop order but withdraws funds before trigger.

### Order Placement
```json
POST /api/orders
{
  "instrumentId": "507f1f77bcf86cd799439015",
  "symbol": "SBIN",
  "side": "BUY",
  "orderType": "STOP",
  "quantity": 500,
  "stopPrice": 625.00,
  "clientOrderId": "uuid-202"
}
```

### Execution Flow
1. **T+0s**: Order placed, balance = ₹320,000 (sufficient)
2. **T+300s**: User withdraws ₹200,000, balance = ₹120,000
3. **T+600s**: LTP = ₹626 (stop triggered)
4. **T+603s**: Trigger detected, attempts to place MARKET BUY
5. **T+604s**: Balance check fails (need ₹312,500, have ₹120,000)
6. **Final Status**: REJECTED with reason "Insufficient balance at trigger time"

### User Notification
```json
{
  "type": "ORDER_REJECTED",
  "orderId": "ORD-...",
  "reason": "Insufficient balance at trigger time. Required: ₹312,500, Available: ₹120,000",
  "timestamp": "2026-01-05T10:10:04Z"
}
```

---

## Example 6: Price Gap Through Stop Price

### Scenario
Market gaps down overnight, skipping through stop price.

### Order Placement
```json
POST /api/orders
{
  "instrumentId": "507f1f77bcf86cd799439016",
  "symbol": "TATAMOTORS",
  "side": "SELL",
  "orderType": "STOP",
  "quantity": 100,
  "stopPrice": 750.00,
  "clientOrderId": "uuid-303"
}
```

### Execution Flow
1. **Day 1, 3:30 PM**: Market closes at ₹765
2. **Day 1, 3:31 PM**: Order placed with stop at ₹750
3. **Day 2, 9:15 AM**: Market opens at ₹735 (gap down)
4. **Day 2, 9:15:03 AM**: First market data update, LTP = ₹735
5. **Day 2, 9:15:03 AM**: Trigger detected (₹735 < ₹750)
6. **Day 2, 9:15:05 AM**: Market order executes at ₹734
7. **Final Status**: FILLED at ₹734

### Notes
- Stop price was ₹750, but execution at ₹734 (₹16 slippage)
- This is expected behavior - stop orders do NOT guarantee execution price
- Trigger price recorded as ₹735 (first detected price below stop)

---

## Code Examples

### Backend: Stop Order Validation

```go
func (s *StopOrderService) ValidateStopOrder(order *models.Order) error {
    // 1. Validate stop price
    if order.StopPrice == nil || *order.StopPrice <= 0 {
        return errors.New("stop price is required and must be positive")
    }

    // 2. Validate tick size
    instrument, _ := s.instrumentRepo.FindByID(order.InstrumentID.Hex())
    remainder := math.Mod(*order.StopPrice, instrument.TickSize)
    if remainder > 0.000001 && instrument.TickSize-remainder > 0.000001 {
        return fmt.Errorf("stop price must be a multiple of tick size (%v)", instrument.TickSize)
    }

    // 3. Validate logical stop price
    marketData, _ := s.marketDataRepo.FindByInstrumentID(order.InstrumentID.Hex())
    currentPrice := marketData.LastPrice

    if order.Side == "SELL" && *order.StopPrice >= currentPrice {
        return errors.New("SELL stop price must be below current market price")
    }
    if order.Side == "BUY" && *order.StopPrice <= currentPrice {
        return errors.New("BUY stop price must be above current market price")
    }

    // 4. Validate trailing stop specific fields
    if order.OrderType == "TRAILING_STOP" {
        if order.TrailAmount == nil || *order.TrailAmount <= 0 {
            return errors.New("trail amount is required and must be positive")
        }
        if order.TrailType == "PERCENTAGE" {
            if *order.TrailAmount < 0.1 || *order.TrailAmount > 50 {
                return errors.New("percentage trail amount must be between 0.1% and 50%")
            }
        } else if order.TrailType == "ABSOLUTE" {
            if *order.TrailAmount < instrument.TickSize {
                return errors.New("absolute trail amount must be >= tick size")
            }
        }
    }

    // 5. Validate stop-limit specific fields
    if order.OrderType == "STOP_LIMIT" {
        if order.LimitPrice == nil || *order.LimitPrice <= 0 {
            return errors.New("limit price is required for stop-limit orders")
        }
        // Validate limit price tick size
        remainder := math.Mod(*order.LimitPrice, instrument.TickSize)
        if remainder > 0.000001 && instrument.TickSize-remainder > 0.000001 {
            return fmt.Errorf("limit price must be a multiple of tick size (%v)", instrument.TickSize)
        }
    }

    return nil
}
```

### Backend: Trigger Detection

```go
func (s *StopOrderService) CheckTriggerConditions(order *models.Order, currentPrice float64) bool {
    if order.OrderType == "TRAILING_STOP" {
        // Use current stop price for trailing stops
        if order.CurrentStopPrice == nil {
            return false
        }
        if order.Side == "SELL" {
            return currentPrice <= *order.CurrentStopPrice
        } else {
            return currentPrice >= *order.CurrentStopPrice
        }
    } else {
        // Use fixed stop price for STOP and STOP_LIMIT
        if order.StopPrice == nil {
            return false
        }
        if order.Side == "SELL" {
            return currentPrice <= *order.StopPrice
        } else {
            return currentPrice >= *order.StopPrice
        }
    }
}
```

### Backend: Trailing Stop Update

```go
func (s *StopOrderService) UpdateTrailingStop(order *models.Order, currentPrice float64) error {
    if order.OrderType != "TRAILING_STOP" {
        return nil // Not a trailing stop
    }

    var newStopPrice float64
    updated := false

    if order.Side == "SELL" {
        // Update highest price if current price is higher
        if order.HighestPrice == nil || currentPrice > *order.HighestPrice {
            order.HighestPrice = &currentPrice
            updated = true
        }

        // Calculate new stop price
        if order.TrailType == "PERCENTAGE" {
            newStopPrice = *order.HighestPrice * (1 - *order.TrailAmount/100)
        } else {
            newStopPrice = *order.HighestPrice - *order.TrailAmount
        }

        // Update stop price if it increased
        if order.CurrentStopPrice == nil || newStopPrice > *order.CurrentStopPrice {
            order.CurrentStopPrice = &newStopPrice
            updated = true
        }
    } else {
        // BUY trailing stop (for short positions)
        if order.LowestPrice == nil || currentPrice < *order.LowestPrice {
            order.LowestPrice = &currentPrice
            updated = true
        }

        if order.TrailType == "PERCENTAGE" {
            newStopPrice = *order.LowestPrice * (1 + *order.TrailAmount/100)
        } else {
            newStopPrice = *order.LowestPrice + *order.TrailAmount
        }

        if order.CurrentStopPrice == nil || newStopPrice < *order.CurrentStopPrice {
            order.CurrentStopPrice = &newStopPrice
            updated = true
        }
    }

    if updated {
        return s.orderRepo.Update(order)
    }
    return nil
}
```

### Frontend: Advanced Trade Panel

```typescript
// TradePanel.tsx - Advanced Mode Section
{advancedMode && (
  <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
    <Typography variant="subtitle2" gutterBottom>
      Advanced Order Options
    </Typography>
    
    <ToggleButtonGroup
      fullWidth
      value={orderType}
      exclusive
      onChange={(_, v) => v && setOrderType(v)}
      size="small"
      sx={{ mb: 2 }}
    >
      <ToggleButton value="LIMIT">LIMIT</ToggleButton>
      <ToggleButton value="MARKET">MARKET</ToggleButton>
      <ToggleButton value="STOP">STOP</ToggleButton>
      <ToggleButton value="STOP_LIMIT">STOP-LIMIT</ToggleButton>
      <ToggleButton value="TRAILING_STOP">TRAILING</ToggleButton>
    </ToggleButtonGroup>

    {(orderType === 'STOP' || orderType === 'STOP_LIMIT') && (
      <TextField
        fullWidth
        label="Stop Price"
        type="number"
        size="small"
        value={stopPrice}
        onChange={(e) => setStopPrice(e.target.value)}
        helperText={`Trigger when ${side === 'BUY' ? 'above' : 'below'} this price`}
        InputProps={{
          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
        }}
        sx={{ mb: 2 }}
      />
    )}

    {orderType === 'STOP_LIMIT' && (
      <TextField
        fullWidth
        label="Limit Price"
        type="number"
        size="small"
        value={limitPrice}
        onChange={(e) => setLimitPrice(e.target.value)}
        helperText="Maximum price to pay (BUY) or minimum to accept (SELL)"
        InputProps={{
          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
        }}
        sx={{ mb: 2 }}
      />
    )}

    {orderType === 'TRAILING_STOP' && (
      <>
        <ToggleButtonGroup
          fullWidth
          value={trailType}
          exclusive
          onChange={(_, v) => v && setTrailType(v)}
          size="small"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="PERCENTAGE">Percentage %</ToggleButton>
          <ToggleButton value="ABSOLUTE">Absolute ₹</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          fullWidth
          label={`Trail Amount (${trailType === 'PERCENTAGE' ? '%' : '₹'})`}
          type="number"
          size="small"
          value={trailAmount}
          onChange={(e) => setTrailAmount(e.target.value)}
          helperText={`Stop will trail ${trailAmount}${trailType === 'PERCENTAGE' ? '%' : '₹'} behind peak`}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {trailType === 'PERCENTAGE' ? '%' : '₹'}
              </InputAdornment>
            ),
          }}
        />
      </>
    )}

    {/* Visual indicator of stop price relative to current price */}
    {stopPrice && (
      <Box sx={{ mt: 2, p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Current Price: ₹{ltp.toFixed(2)} | Stop Price: ₹{parseFloat(stopPrice).toFixed(2)}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Distance: ₹{Math.abs(ltp - parseFloat(stopPrice)).toFixed(2)} (
          {((Math.abs(ltp - parseFloat(stopPrice)) / ltp) * 100).toFixed(2)}%)
        </Typography>
      </Box>
    )}
  </Box>
)}
```

---

## Testing Checklist

### Unit Tests
- [ ] Validate stop price (positive, tick size compliance)
- [ ] Validate trail amount (percentage range, absolute minimum)
- [ ] Validate logical stop prices (SELL below market, BUY above market)
- [ ] Calculate trailing stop price (percentage and absolute)
- [ ] Detect trigger conditions (all order types)
- [ ] Update trailing stop price correctly

### Integration Tests
- [ ] Place STOP order → trigger → execute as MARKET
- [ ] Place STOP_LIMIT order → trigger → place LIMIT order
- [ ] Place TRAILING_STOP → price rises → stop price updates → price falls → trigger
- [ ] Insufficient balance at trigger time → reject with error
- [ ] Price gap through stop → trigger immediately
- [ ] Cancel PENDING stop order → verify cancellation
- [ ] Modify PENDING stop order → verify update

### Manual Testing
- [ ] UI shows all order types correctly
- [ ] Tooltips explain each order type clearly
- [ ] Stop price validation errors display correctly
- [ ] Trailing stop price updates in real-time in order list
- [ ] Trigger notifications appear for user
- [ ] Order history shows full lifecycle (PENDING → TRIGGERED → FILLED)
