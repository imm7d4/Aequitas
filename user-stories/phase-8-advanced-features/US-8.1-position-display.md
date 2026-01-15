# US-8.1 - Position Display on Instrument Detail Page

**Epic:** Advanced Trading Features  
**Phase:** Phase 8 - Enhanced Trading Experience  
**Status:** Completed  
**Priority:** High  
**Complexity:** Low

## User Story

As a **trader**  
I want to **see my current position for an instrument on its detail page**  
So that I can **quickly understand my exposure and P&L before placing additional orders**.

## Business Context

When viewing an instrument detail page, traders need immediate visibility into:
- Whether they currently hold this stock
- Their average purchase price
- Current profit/loss
- Position size

This contextual information helps traders make informed decisions about buying more, selling, or holding.

## Acceptance Criteria

### 1. Position Banner Display

**When user has a position:**
- [ ] Display prominent banner above the TradePanel
- [ ] Show position information clearly
- [ ] Update P&L in real-time as price changes
- [ ] Use color coding (green for profit, red for loss)

**Banner Content:**
- [ ] **Quantity**: Number of shares held
- [ ] **Avg Price**: Average purchase price
- [ ] **Current Value**: Quantity × Current Price
- [ ] **P&L**: Unrealized profit/loss
  - Absolute value (₹)
  - Percentage (%)
- [ ] **Investment**: Total cost basis

**Visual Design:**
```
┌────────────────────────────────────────────────┐
│ 📊 Your Position                               │
│                                                │
│ 50 shares @ avg ₹1,050.00                     │
│ Current Value: ₹53,312.00                     │
│ P&L: +₹812.00 (+1.55%) ✅                     │
│                                                │
│ [Sell All] [Sell Partial]                     │
└────────────────────────────────────────────────┘
```

---

### 2. No Position State

**When user has no position:**
- [ ] Do not display banner
- [ ] TradePanel shows normally without position context

---

### 3. Real-Time P&L Updates

**Behavior:**
- [ ] P&L recalculates as market price updates
- [ ] Color changes dynamically (profit/loss)
- [ ] Smooth transitions (no flickering)
- [ ] Updates every tick (via WebSocket)

---

### 4. Quick Actions

**Sell All Button:**
- [ ] Pre-fills TradePanel with:
  - Side: SELL
  - Quantity: Current holding quantity
  - Order Type: MARKET (default)

**Sell Partial Button:**
- [ ] Pre-fills TradePanel with:
  - Side: SELL
  - Quantity: Empty (user enters)
  - Order Type: LIMIT (default)

---

## Technical Requirements

### Backend

#### API Endpoint
```
GET /api/portfolio/position/:instrumentId
```

**Response:**
```json
{
  "hasPosition": true,
  "position": {
    "instrumentId": "...",
    "symbol": "ICICIBANK",
    "quantity": 50,
    "averagePrice": 1050.00,
    "totalCost": 52500.00,
    "side": "LONG"
  }
}
```

**Error Cases:**
- 404: No position found (return `hasPosition: false`)
- 401: Unauthorized

---

### Frontend

#### Component
**File**: `frontend/src/features/portfolio/components/PositionBanner.tsx`

```tsx
interface PositionBannerProps {
  instrumentId: string;
  symbol: string;
  currentPrice: number;
  onSellAll: () => void;
  onSellPartial: () => void;
}

export const PositionBanner: React.FC<PositionBannerProps> = ({
  instrumentId,
  symbol,
  currentPrice,
  onSellAll,
  onSellPartial
}) => {
  const { position, isLoading } = usePosition(instrumentId);
  
  if (isLoading || !position) return null;
  
  const currentValue = position.quantity * currentPrice;
  const pl = currentValue - position.totalCost;
  const plPercent = (pl / position.totalCost) * 100;
  const isProfit = pl >= 0;
  
  return (
    <Alert 
      severity={isProfit ? "success" : "error"}
      icon={<AccountBalanceWalletIcon />}
      sx={{ mb: 2 }}
    >
      <Typography variant="body2" fontWeight={600}>
        Your Position: {position.quantity} shares @ avg ₹{position.averagePrice.toFixed(2)}
      </Typography>
      <Typography variant="caption" display="block">
        Current Value: ₹{currentValue.toLocaleString()} | 
        P&L: {isProfit ? '+' : ''}₹{pl.toFixed(2)} ({isProfit ? '+' : ''}{plPercent.toFixed(2)}%)
      </Typography>
      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
        <Button size="small" variant="outlined" onClick={onSellAll}>
          Sell All
        </Button>
        <Button size="small" variant="outlined" onClick={onSellPartial}>
          Sell Partial
        </Button>
      </Box>
    </Alert>
  );
};
```

#### Hook
**File**: `frontend/src/features/portfolio/hooks/usePosition.ts`

```tsx
export const usePosition = (instrumentId: string) => {
  const [position, setPosition] = useState<Position | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        const data = await portfolioService.getPosition(instrumentId);
        setPosition(data.hasPosition ? data.position : null);
      } catch (err) {
        setPosition(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosition();
  }, [instrumentId]);
  
  return { position, isLoading };
};
```

---

### Integration

**Modify**: `frontend/src/features/instruments/components/InstrumentDetail.tsx`

```tsx
// Add above TradePanel
{instrument && (
  <PositionBanner
    instrumentId={instrument.id}
    symbol={instrument.symbol}
    currentPrice={ltp}
    onSellAll={() => {
      // Pre-fill TradePanel
      setSide('SELL');
      setQuantity(position.quantity.toString());
      setOrderType('MARKET');
    }}
    onSellPartial={() => {
      setSide('SELL');
      setOrderType('LIMIT');
    }}
  />
)}
```

---

## Implementation Steps

1. **Backend** (1 hour):
   - Add `GetPosition` method to PortfolioService
   - Create `/api/portfolio/position/:instrumentId` endpoint
   - Test with existing positions

2. **Frontend** (1.5 hours):
   - Create PositionBanner component
   - Create usePosition hook
   - Add portfolioService.getPosition method
   - Integrate into InstrumentDetail

3. **Testing** (0.5 hour):
   - Test with position (profit/loss scenarios)
   - Test without position
   - Test quick actions
   - Test real-time P&L updates

**Total: 3 hours**

---

## Success Metrics

- [ ] Position banner displays when user has holdings
- [ ] P&L calculations are accurate
- [ ] Real-time updates work smoothly
- [ ] Quick actions pre-fill TradePanel correctly
- [ ] No performance impact on page load

---

## Dependencies

**Required:**
- ✅ US-5.1: Portfolio Holdings (position data must exist)
- ✅ US-2.2.1: Market Data Feed (for current price)

---

## Non-Goals

- ❌ Full position history (separate page)
- ❌ Multiple positions across accounts
- ❌ Short positions
- ❌ Options positions
