# US-9.1 - Short Selling Support

**Epic:** Advanced Trading  
**Phase:** Phase 9 - Short Positions  
**Status:** Not Started  
**Priority:** High  
**Complexity:** High  
**Estimated Effort:** 20-25 hours

## User Story

As a **sophisticated trader**  
I want to **sell stocks short (sell first, buy later)**  
So that I can **profit from declining stock prices and hedge my portfolio**.

## Business Context

Currently, Aequitas only supports LONG positions (buy first, sell later). Short selling is a fundamental trading strategy that allows traders to:
- Profit from bearish market views
- Hedge existing long positions
- Implement advanced trading strategies
- Access the full spectrum of trading opportunities

Short selling is available on all major Indian platforms (Zerodha, Groww, Upstox) and is essential for a complete trading platform.

## Regulatory Context (India - SEBI)

### SEBI Regulations
- ✅ Short selling is permitted for all investors (retail + institutional)
- ❌ **Naked short selling is PROHIBITED** - must deliver shares at settlement
- ✅ Only stocks in F&O segment are eligible for short selling
- ✅ Securities Lending & Borrowing (SLB) mechanism required
- ✅ Disclosure required (institutional upfront, retail by EOD)

### Margin Requirements (India)
- **Initial Margin:** 20% of trade value (VaR + ELM)
- **Maintenance Margin:** Minimum 12.5% (recent SEBI recommendation)
- **Upfront Collection:** Margins collected before trade execution
- **Mark-to-Market:** Daily MTM adjustments

**Note:** For MVP, we'll implement simplified margin requirements. Full SLB integration can be Phase 2.

## Current State Analysis

### What Exists ✅
- Order placement (MARKET, LIMIT, STOP)
- Portfolio tracking with `Holding` model
- `Quantity` field is `int` (can be negative!)
- P&L calculation logic
- Matching engine

### What's Missing ❌
- Short sell order validation
- Negative quantity handling in portfolio
- Short position P&L calculation (inverse logic)
- Margin requirement checks for shorts
- Short position display (distinguish from long)
- Cover/buy-back functionality

### Architectural Improvements Needed 🏗️

**Critical (Must-Do):**
1. **Explicit PositionType** - Don't rely on `quantity < 0`, use enum (`LONG`/`SHORT`)
2. **Position-Level Margin** - Track `BlockedMargin` per holding, not globally
3. **OrderIntent Enum** - Replace `IsShort` with explicit intent (`OPEN_LONG`, `OPEN_SHORT`, `CLOSE_LONG`, `CLOSE_SHORT`)
4. **Backend-Owned P&L** - Calculate P&L in backend, frontend only displays
5. **AvgEntryPrice** - Rename `AvgCost` to be semantically clear

**Important (Should-Do):**
6. **Margin Status States** - Track `OK`, `CALL`, `CRITICAL` states
7. **CoverPositionID** - Link cover orders to specific positions
8. **Disclosure Tracking** - SEBI compliance for short sell acknowledgment

**Nice-to-Have:**
9. **SLB Placeholder** - Stub for future Securities Lending & Borrowing
10. **Lifecycle Diagrams** - Visual documentation for position & margin flows

## Acceptance Criteria

### 1. Short Sell Order Placement

**UI Changes:**
- [ ] TradePanel supports "SELL SHORT" action (new button/mode)
- [ ] Visual distinction: "SELL SHORT" in orange/red vs regular "SELL" in red
- [ ] Show required margin before order placement
- [ ] Warning message: "Short selling involves unlimited risk"

**Backend Validation:**
- [ ] Verify instrument is eligible for short selling (F&O segment)
- [ ] Check user has sufficient balance for margin
- [ ] Create order with `Intent = OPEN_SHORT`

**Order Execution:**
- [ ] Execute short sell order via matching engine
- [ ] Create holding with **positive quantity** and `PositionType = SHORT`
- [ ] Block margin on execution (first fill)
- [ ] Update portfolio summary

---

### 2. Short Position Management

**Portfolio Display:**
- [ ] Holdings table shows quantities with negative sign for display (e.g. "-50") based on `PositionType`
- [ ] Underlying data uses **positive quantity** with `PositionType = SHORT`
- [ ] Visual indicator for short positions (e.g., "SHORT" badge, red background)
- [ ] Display:
  - Quantity: `-50` (derived from `SHORT` type + `50` qty)
  - Avg Entry Price: ₹100 (price at which sold short)
  - Current Price: ₹95 (market price)
  - Unrealized P&L: +₹250 (profit if price fell)
  - Margin Blocked: ₹1,000

**P&L Calculation (Inverse Logic):**
```
For SHORT positions:
- Profit when price FALLS
- Loss when price RISES

Unrealized P&L = (Avg Sell Price - Current Price) × |Quantity|
Example: (₹100 - ₹95) × 50 = +₹250 (profit)

If price rises to ₹105:
Unrealized P&L = (₹100 - ₹105) × 50 = -₹250 (loss)
```

---

### 3. Cover Short Position (Buy Back)

**UI:**
- [ ] "COVER" or "BUY TO COVER" button for short positions
- [ ] Pre-fills quantity to close entire position
- [ ] Shows estimated P&L before covering

**Backend Logic:**
- [ ] Place BUY order to cover short
- [ ] Match quantity with short position
- [ ] Calculate realized P&L
- [ ] Release margin back to available balance
- [ ] Update or remove holding (if fully covered)

**Partial Cover:**
- [ ] Allow partial covering (e.g., cover 20 out of 50 shares)
- [ ] Update holding quantity: `-50` → `-30`
- [ ] Proportional margin release

---

### 4. Margin Management

**Initial Margin:**
- [ ] Calculate: `Required Margin = Trade Value × 20%`
- [ ] Example: Sell short 100 shares @ ₹50 = ₹5,000 trade value
  - Required margin = ₹1,000
- [ ] Block margin from available balance
- [ ] Show "Margin Blocked" in account summary

**Maintenance Margin:**
- [ ] Monitor position value every **10 minutes** (triggered from run start)
- [ ] If unrealized loss exceeds threshold, trigger margin call
- [ ] Margin call threshold: Loss > 50% of initial margin
- [ ] Notification: "Margin call - add funds or cover position"

**Margin Release:**
- [ ] Release margin when position is covered
- [ ] Add released margin back to available balance

**Margin Trigger Logic:**
- [ ] Run background job every 10 minutes
- [ ] Iterate through all active short positions
- [ ] Re-calculate margin status based on current market price
- [ ] Send notifications if status changes to CALL or CRITICAL

---

### 5. Risk Warnings & Limits

**Risk Warnings:**
- [ ] Display warning before first short sell:
  - "Short selling involves unlimited risk"
  - "You may lose more than your initial investment"
  - "Margin calls may require immediate action"
- [ ] Checkbox: "I understand the risks of short selling"

**Position Limits (Optional - Phase 2):**
- [ ] Max short position per stock: 10% of portfolio value
- [ ] Max total short exposure: 30% of portfolio value
- [ ] Configurable limits per user

---

### 6. Order History & Reporting

**Order List:**
- [ ] Show "SHORT SELL" badge for short sell orders
- [ ] Filter: "Short Positions Only"
- [ ] Display margin blocked per order

**Trade History:**
- [ ] Distinguish short sell trades from regular sells
- [ ] Show cover trades separately
- [ ] P&L calculation for closed short positions

---

## Technical Requirements

### Backend Changes

#### 1. Order Model Enhancement
**File:** `backend/internal/models/order.go`

**Add OrderIntent Enum:**
```go
type OrderIntent string

const (
    IntentOpenLong   OrderIntent = "OPEN_LONG"    // Buy to open long position
    IntentCloseLong  OrderIntent = "CLOSE_LONG"   // Sell to close long position
    IntentOpenShort  OrderIntent = "OPEN_SHORT"   // Sell short to open short position
    IntentCloseShort OrderIntent = "CLOSE_SHORT"  // Buy to cover short position
)

type Order struct {
    // ... existing fields
    Intent          OrderIntent `bson:"intent" json:"intent"`                   // NEW: Explicit intent
    CoverPositionID string      `bson:"cover_position_id,omitempty" json:"coverPositionId,omitempty"` // NEW: For CLOSE_SHORT orders
}
```

**Why This Matters:**
- ✅ Zero ambiguity - no confusion between regular SELL and short SELL
- ✅ Safer audit trail - intent is explicit in database
- ✅ Prevents accidental misuse - can't accidentally close when opening
- ✅ FIFO/LIFO ready - `CoverPositionID` enables specific position targeting

#### 2. Order Service - Short Sell Validation
**File:** `backend/internal/services/order_service.go`

**New Method:**
```go
func (s *OrderService) ValidateShortSell(
    userID string,
    instrumentID string,
    quantity int,
    price float64,
) error {
    // 1. Check if instrument is eligible for short selling
    instrument, err := s.instrumentService.GetByID(instrumentID)
    if !instrument.IsShortable { // NEW field needed
        return errors.New("instrument not eligible for short selling")
    }
    
    // 2. Calculate required margin (20% of trade value)
    tradeValue := float64(quantity) * price
    requiredMargin := tradeValue * 0.20
    
    // 3. Check available balance
    account, err := s.accountService.GetTradingAccount(userID)
    if account.Balance < requiredMargin {
        return fmt.Errorf("insufficient margin. Required: ₹%.2f, Available: ₹%.2f", 
            requiredMargin, account.Balance)
    }
    
    return nil
}
```

#### 2. Order Service - Short Sell Validation
**File:** `backend/internal/services/order_service.go`

**New Method:**
```go
func (s *OrderService) ValidateShortSell(
    userID string,
    instrumentID string,
    quantity int,
    price float64,
) error {
    // 1. Check if instrument is eligible for short selling
    instrument, err := s.instrumentService.GetByID(instrumentID)
    if !instrument.IsShortable {
        return errors.New("instrument not eligible for short selling")
    }
    
    // 2. Check available balance (Validation only, blocking happens on fill)
    requiredMargin := float64(quantity) * price * 0.20
    account, err := s.accountService.GetTradingAccount(userID)
    if account.AvailableBalance < requiredMargin {
        return fmt.Errorf("insufficient margin. Required: ₹%.2f, Available: ₹%.2f", 
            requiredMargin, account.AvailableBalance)
    }
    
    return nil
}
```

**Modified Method:**
```go
func (s *OrderService) PlaceOrder(req PlaceOrderRequest) (*Order, error) {
    // ... existing validation
    
    // Short sell validation
    if req.Intent == IntentOpenShort {
        if err := s.ValidateShortSell(userID, req.InstrumentID, req.Quantity, orderPrice); err != nil {
            return nil, err
        }
    }
    
    // ... rest of order placement
}
```

#### 3. Holding Model - Explicit Position Type
**File:** `backend/internal/models/holding.go`

**Add PositionType and Margin Tracking:**
```go
type PositionType string

const (
    PositionLong  PositionType = "LONG"
    PositionShort PositionType = "SHORT"
)

type MarginStatus string

const (
    MarginOK       MarginStatus = "OK"
    MarginCall     MarginStatus = "CALL"
    MarginCritical MarginStatus = "CRITICAL"
)

type Holding struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
    AccountID    primitive.ObjectID `bson:"account_id" json:"accountId"`
    InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
    Symbol       string             `bson:"symbol" json:"symbol"`
    
    // Position Details
    Quantity     int          `bson:"quantity" json:"quantity"`           // Always positive
    PositionType PositionType `bson:"position_type" json:"positionType"` // NEW: LONG or SHORT
    AvgEntryPrice float64     `bson:"avg_entry_price" json:"avgEntryPrice"` // RENAMED from AvgCost
    TotalCost    float64      `bson:"total_cost" json:"totalCost"`
    TotalFees    float64      `bson:"total_fees" json:"totalFees"`
    
    // P&L Tracking (Backend-Calculated)
    RealizedPL   float64 `bson:"realized_pl" json:"realizedPL"`
    UnrealizedPL float64 `bson:"unrealized_pl" json:"unrealizedPL"` // NEW: Calculated by backend
    TotalPL      float64 `bson:"total_pl" json:"totalPL"`           // NEW: Realized + Unrealized
    
    // Margin Tracking (For Short Positions)
    BlockedMargin float64      `bson:"blocked_margin" json:"blockedMargin"` // NEW: Position-level margin
    InitialMargin float64      `bson:"initial_margin" json:"initialMargin"` // NEW: Original margin requirement
    MarginStatus  MarginStatus `bson:"margin_status" json:"marginStatus"`   // NEW: OK/CALL/CRITICAL
    
    // Compliance
    ShortSellDisclosureAccepted bool      `bson:"short_sell_disclosure_accepted,omitempty" json:"shortSellDisclosureAccepted,omitempty"`
    DisclosureTimestamp         time.Time `bson:"disclosure_timestamp,omitempty" json:"disclosureTimestamp,omitempty"`
    
    LastUpdated time.Time `bson:"last_updated" json:"lastUpdated"`
    CreatedAt   time.Time `bson:"created_at" json:"createdAt"`
}
```

**Why This Matters:**
- ✅ **Explicit PositionType** - No fragile `quantity < 0` checks
- ✅ **Position-Level Margin** - Accurate tracking per position
- ✅ **Backend-Owned P&L** - Single source of truth
- ✅ **Margin Status** - Deterministic margin call logic
- ✅ **Compliance Ready** - SEBI disclosure tracking

#### 4. Portfolio Service - Position Management
**File:** `backend/internal/services/portfolio_service.go`

**Modified Method:**
```go
func (s *PortfolioService) UpdatePosition(trade *Trade) error {
    holding, err := s.GetHolding(trade.UserID, trade.InstrumentID)
    
    switch trade.Order.Intent {
    case IntentOpenLong:
        // BUY to open long position
        if holding == nil || holding.PositionType != PositionLong {
            holding = &Holding{
                Quantity:      trade.Quantity,
                PositionType:  PositionLong,
                AvgEntryPrice: trade.Price,
                // ...
            }
        } else {
            // Add to existing long position
            s.updateAvgEntryPrice(holding, trade)
        }
        
    case IntentOpenShort:
        // SELL SHORT to open short position
        requiredMargin := trade.Price * float64(trade.Quantity) * 0.20
        
        if holding == nil || holding.PositionType != PositionShort {
            holding = &Holding{
                Quantity:      trade.Quantity,
                PositionType:  PositionShort,
                AvgEntryPrice: trade.Price,
                BlockedMargin: requiredMargin,
                InitialMargin: requiredMargin,
                MarginStatus:  MarginOK,
                ShortSellDisclosureAccepted: true,
                DisclosureTimestamp: time.Now(),
                // ...
            }
        } else {
            // Add to existing short position
            s.updateAvgEntryPrice(holding, trade)
            holding.BlockedMargin += requiredMargin
        }
        
    case IntentCloseLong:
        // SELL to close long position
        if holding == nil || holding.PositionType != PositionLong {
            return errors.New("no long position to close")
        }
        
        realizedPL := (trade.Price - holding.AvgEntryPrice) * float64(trade.Quantity)
        holding.RealizedPL += realizedPL
        holding.Quantity -= trade.Quantity
        
        if holding.Quantity == 0 {
            s.DeleteHolding(holding.ID)
        }
        
    case IntentCloseShort:
        // BUY TO COVER short position
        if holding == nil || holding.PositionType != PositionShort {
            return errors.New("no short position to cover")
        }
        
        // Inverse P&L for shorts
        realizedPL := (holding.AvgEntryPrice - trade.Price) * float64(trade.Quantity)
        holding.RealizedPL += realizedPL
        
        // Calculate pre-trade quantity for correct margin release
        preTradeQuantity := holding.Quantity
        
        // Reduce quantity
        holding.Quantity -= trade.Quantity
        
        // Proportional margin release using pre-trade quantity
        marginToRelease := holding.BlockedMargin * (float64(trade.Quantity) / float64(preTradeQuantity))
        
        // Update blocked margin
        holding.BlockedMargin -= marginToRelease
        s.accountService.ReleaseMargin(trade.UserID, marginToRelease)
        
        if holding.Quantity == 0 {
            s.DeleteHolding(holding.ID)
        }
    }
    
    // Calculate unrealized P&L (backend-owned)
    if holding != nil {
        currentPrice := s.marketDataService.GetCurrentPrice(holding.InstrumentID)
        if holding.PositionType == PositionLong {
            holding.UnrealizedPL = (currentPrice - holding.AvgEntryPrice) * float64(holding.Quantity)
        } else {
            holding.UnrealizedPL = (holding.AvgEntryPrice - currentPrice) * float64(holding.Quantity)
        }
        holding.TotalPL = holding.RealizedPL + holding.UnrealizedPL
        
        // Update margin status for shorts
        if holding.PositionType == PositionShort {
            s.updateMarginStatus(holding)
        }
    }
    
    return s.SaveHolding(holding)
}

func (s *PortfolioService) updateMarginStatus(holding *Holding) {
    // Explicit loss calculation (Loss > 0)
    loss := 0.0
    if holding.UnrealizedPL < 0 {
        loss = -holding.UnrealizedPL
    }
    
    if loss > holding.InitialMargin * 0.75 {
        holding.MarginStatus = MarginCritical
    } else if loss > holding.InitialMargin * 0.50 {
        holding.MarginStatus = MarginCall
    } else {
        holding.MarginStatus = MarginOK
    }
}
```

#### 5. Instrument Model - Shortable Flag
**File:** `backend/internal/models/instrument.go`

```go
type Instrument struct {
    // ... existing fields
    IsShortable bool `bson:"is_shortable" json:"isShortable"` // NEW: F&O segment stocks
}
```

**Seed Script Update:**
- Mark F&O stocks as `IsShortable = true`
- Regular stocks: `IsShortable = false`

#### 6. Account Service - Margin Management
**File:** `backend/internal/services/account_service.go`

**New Methods:**
```go
func (s *AccountService) BlockMargin(userID string, amount float64) error {
    // Deduct from available balance
    // Track in separate "blocked_margin" field
}

func (s *AccountService) ReleaseMargin(userID string, amount float64) error {
    // Add back to available balance
}

func (s *AccountService) GetAvailableBalance(userID string) float64 {
    // Balance - BlockedMargin
}
```

#### 7. SLB Placeholder (Future-Proofing)
**File:** `backend/internal/models/borrow_record.go`

**Stub for Phase 2:**
```go
type BorrowRecord struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
    InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
    Quantity     int                `bson:"quantity" json:"quantity"`
    BorrowRate   float64            `bson:"borrow_rate" json:"borrowRate"` // Daily fee
    BorrowedAt   time.Time          `bson:"borrowed_at" json:"borrowedAt"`
    ReturnedAt   *time.Time         `bson:"returned_at,omitempty" json:"returnedAt,omitempty"`
}
```

**Why Add This Now:**
- ✅ Prevents major refactor later
- ✅ Makes design future-proof
- ✅ Shows architectural foresight

---

### Frontend Changes

#### 1. TradePanel - Explicit Intent Selection
**File:** `frontend/src/features/trading/components/TradePanel.tsx`

**New State:**
```typescript
type TradeIntent = 'BUY' | 'SELL' | 'SELL_SHORT' | 'BUY_TO_COVER';
const [tradeIntent, setTradeIntent] = useState<TradeIntent>('BUY');
```

**UI Changes:**
- Four distinct buttons: "BUY", "SELL", "SELL SHORT", "BUY TO COVER"
- "SELL SHORT" button: Orange/red color with warning icon
- "BUY TO COVER" button: Green color, only shown when short position exists
- Show margin requirement when "SELL SHORT" selected
- Display risk warning modal on first short sell
- Calculate and show required margin: `tradeValue * 0.20`

**Why This Matters:**
- ✅ Zero ambiguity - user knows exactly what action they're taking
- ✅ Prevents accidents - can't accidentally short when meaning to sell
- ✅ Better analytics - clear intent tracking

#### 2. Holdings Table - Backend P&L Display
**File:** `frontend/src/features/portfolio/components/HoldingsTable.tsx`

**Changes:**
- Display `positionType` badge ("LONG" in green, "SHORT" in red)
- Show `unrealizedPL` from backend (no calculation!)
- Show `totalPL` (realized + unrealized)
- Display `blockedMargin` for short positions
- Show `marginStatus` badge (OK/CALL/CRITICAL)
- "COVER" button for short positions, "SELL" for long positions

**Backend Response:**
```typescript
interface HoldingResponse {
    id: string;
    symbol: string;
    quantity: number;              // Always positive
    positionType: 'LONG' | 'SHORT';
    avgEntryPrice: number;
    unrealizedPL: number;          // Backend-calculated
    realizedPL: number;
    totalPL: number;
    blockedMargin?: number;        // For shorts
    marginStatus?: 'OK' | 'CALL' | 'CRITICAL';
}
```

**Why This Matters:**
- ✅ Single source of truth - backend owns P&L logic
- ✅ No calculation bugs - frontend just displays
- ✅ Consistent across platform - same logic everywhere

#### 3. Position Banner - Short Position Support
**File:** `frontend/src/features/portfolio/components/PositionBanner.tsx`

**Changes:**
- Display position type badge
- Show `unrealizedPL` from backend
- Show `marginStatus` with color coding:
  - OK: Green
  - CALL: Yellow with warning
  - CRITICAL: Red with urgent action required
- Display blocked margin for shorts
- "COVER" button that creates `IntentCloseShort` order
- Inline risk badge: "⚠️ Unlimited loss potential" for shorts

#### 4. Order Service - Intent-Based API
**File:** `frontend/src/features/trading/services/orderService.ts`

```typescript
type OrderIntent = 'OPEN_LONG' | 'CLOSE_LONG' | 'OPEN_SHORT' | 'CLOSE_SHORT';

interface PlaceOrderRequest {
    instrumentId: string;
    quantity: number;
    orderType: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT';
    price?: number;
    stopPrice?: number;
    intent: OrderIntent; // NEW: Explicit intent
    coverPositionId?: string; // NEW: For CLOSE_SHORT
}

async placeOrder(req: PlaceOrderRequest): Promise<OrderResponse> {
    return api.post('/api/orders', req);
}
```

#### 5. Risk Warning Component
**File:** `frontend/src/features/trading/components/ShortSellWarning.tsx`

**First-Time Modal:**
- Show on first short sell attempt
- Checkbox: "I understand short selling involves unlimited risk"
- Checkbox: "I understand I may lose more than my initial investment"
- Checkbox: "I understand margin calls may require immediate action"
- "Accept" button (disabled until all checked)

**Persistent Inline Warning:**
- Show on every short position in portfolio
- Tooltip: "⚠️ Unlimited loss potential"
- Matches Zerodha/Upstox behavior

---

## Architectural Improvements Summary

This user story incorporates **industry best practices** and **production-grade architecture** to avoid common pitfalls in short selling implementations.

### Critical Improvements (Must-Do)

#### 1. Explicit PositionType Enum ✅
**Problem:** Relying on `quantity < 0` is fragile and error-prone  
**Solution:** Explicit `PositionType` enum (`LONG`/`SHORT`)  
**Benefits:**
- No fragile quantity checks everywhere
- Cleaner reporting and analytics
- Easier future expansion (futures, options)
- Safer P&L calculations

#### 2. Position-Level Margin Tracking ✅
**Problem:** Global margin tracking can't handle multiple positions  
**Solution:** `BlockedMargin`, `InitialMargin`, `MarginStatus` per holding  
**Benefits:**
- Accurate margin release on partial cover
- Per-position margin call checks
- Cleaner liquidation logic
- Proper proportional margin handling

#### 3. OrderIntent Enum ✅
**Problem:** `IsShort` boolean is ambiguous  
**Solution:** Explicit intent (`OPEN_LONG`, `OPEN_SHORT`, `CLOSE_LONG`, `CLOSE_SHORT`)  
**Benefits:**
- Zero ambiguity in order flow
- Prevents accidental misuse
- Crystal-clear audit trail
- FIFO/LIFO ready with `CoverPositionID`

#### 4. Backend-Owned P&L ✅
**Problem:** Frontend calculating P&L leads to inconsistencies  
**Solution:** Backend calculates `UnrealizedPL`, `RealizedPL`, `TotalPL`  
**Benefits:**
- Single source of truth
- No calculation bugs in frontend
- Consistent across all clients
- Safer financial logic

#### 5. AvgEntryPrice Naming ✅
**Problem:** `AvgCost` is misleading for shorts (it's actually avg sell price)  
**Solution:** Rename to `AvgEntryPrice`  
**Benefits:**
- Prevents P&L bugs
- Self-documenting code
- Easier onboarding

### Important Improvements (Should-Do)

#### 6. Margin Status States ✅
**Implementation:** `MarginOK`, `MarginCall`, `MarginCritical`  
**Benefits:**
- Deterministic behavior
- Easier notifications
- Phase-2 auto-liquidation becomes trivial

#### 7. CoverPositionID ✅
**Implementation:** Link cover orders to specific positions  
**Benefits:**
- Prevents mismatched covering
- Enables partial cover safely
- Essential for FIFO/LIFO rules

#### 8. Disclosure Tracking ✅
**Implementation:** `ShortSellDisclosureAccepted`, `DisclosureTimestamp`  
**Benefits:**
- SEBI compliance
- Audit safety
- Legal protection

### Nice-to-Have Improvements

#### 9. SLB Placeholder ✅
**Implementation:** Stub `BorrowRecord` model  
**Benefits:**
- Prevents major refactor later
- Future-proof design
- Shows architectural foresight

#### 10. Lifecycle Diagrams
**Implementation:** Visual documentation (to be added)  
**Benefits:**
- Faster dev onboarding
- Easier debugging
- Stakeholder confidence

---

## Implementation Plan

### Phase 1: Backend Foundation (10-12 hours)
1. Add `OrderIntent` enum to Order model
2. Add `PositionType`, `MarginStatus` enums to Holding model
3. Rename `AvgCost` to `AvgEntryPrice` in Holding model
4. Add position-level margin fields (`BlockedMargin`, `InitialMargin`, `MarginStatus`)
5. Add P&L fields (`UnrealizedPL`, `TotalPL`) to Holding model
6. Add disclosure tracking fields
7. Add `IsShortable` flag to Instrument model
8. Update seed script (mark F&O stocks as shortable)
9. Implement `ValidateShortSell` in OrderService
10. Add margin blocking/release in AccountService
11. Update `UpdatePosition` to handle `OrderIntent` switch logic
12. Implement `updateMarginStatus` helper
13. Add backend P&L calculation logic
14. Create `BorrowRecord` model stub
15. Test short sell order placement
16. Test position updates with all intents
17. Test margin calculations and status updates

### Phase 2: Frontend UI (6-8 hours)
1. Add four-button intent selection to TradePanel
2. Show margin requirement calculation
3. Create `ShortSellWarning` component (modal + inline)
4. Update HoldingsTable to display backend P&L
5. Add `positionType` badge display
6. Add `marginStatus` badge with color coding
7. Show `blockedMargin` for short positions
8. Implement intent-based order placement
9. Add "COVER" button functionality with `CoverPositionID`
10. Test UI with mock short positions

### Phase 3: Integration & Testing (6-7 hours)
1. End-to-end testing:
   - Place short sell order (`OPEN_SHORT`)
   - Verify positive quantity with `PositionType = SHORT`
   - Check margin blocked at position level
   - Verify backend-calculated P&L
   - Cover position (`CLOSE_SHORT`)
   - Verify proportional margin released
2. Test P&L calculations (profit and loss scenarios)
3. Test partial covering with margin release
4. Test margin status transitions (OK → CALL → CRITICAL)
5. Test disclosure tracking
6. Browser testing
7. Edge case testing

**Total: 22-27 hours** (increased from 20-25 due to architectural improvements)

---

## Verification Plan

### Manual Testing Scenarios

**Test 1: Short Sell Order**
1. Navigate to instrument detail page (F&O stock)
2. Click "SELL SHORT" button
3. Enter quantity: 50
4. Verify margin requirement displayed
5. Place order
6. Verify order created with `isShort = true`
7. Check portfolio - should show `-50` quantity

**Test 2: P&L Calculation**
1. Place short sell: 50 shares @ ₹100
2. Price drops to ₹95
3. Verify unrealized P&L = +₹250 (profit)
4. Price rises to ₹105
5. Verify unrealized P&L = -₹250 (loss)

**Test 3: Cover Position**
1. Have short position: -50 shares
2. Click "COVER" button
3. Verify BUY order pre-filled with quantity 50
4. Execute cover
5. Verify position closed
6. Verify margin released
7. Check realized P&L

**Test 4: Partial Cover**
1. Have short position: -50 shares
2. Cover 20 shares
3. Verify position updated to -30 shares
4. Verify partial margin released

**Test 5: Margin Validation**
1. Attempt short sell with insufficient balance
2. Verify error: "Insufficient margin"
3. Add funds
4. Retry short sell - should succeed

---

## Success Metrics

- [ ] Users can place short sell orders
- [ ] Negative quantities displayed correctly in portfolio
- [ ] P&L calculations accurate for short positions
- [ ] Margin blocked and released correctly
- [ ] Cover functionality works for full and partial covers
- [ ] Visual distinction between long and short positions
- [ ] No errors with negative quantity handling

---

## Dependencies

**Required:**
- ✅ Order placement system
- ✅ Portfolio tracking
- ✅ Matching engine
- ✅ Holding model (supports int quantity)

**New:**
- ❌ Margin management system
- ❌ Short sell validation
- ❌ Instrument shortable flag

---

## Risks & Mitigations

**Risk 1: Unlimited Loss Potential**
- **Mitigation:** Display clear warnings, implement position limits

**Risk 2: Margin Calls**
- **Mitigation:** Daily monitoring, notifications, auto-liquidation (Phase 2)

**Risk 3: Regulatory Compliance**
- **Mitigation:** Follow SEBI guidelines, implement proper disclosures

**Risk 4: Complex P&L Logic**
- **Mitigation:** Thorough testing, clear documentation

---

## Future Enhancements (Phase 2)

1. **Securities Lending & Borrowing (SLB) Integration**
   - Actual share borrowing mechanism
   - Borrowing fees
   - Availability checking

2. **Advanced Margin Management**
   - Real-time margin monitoring
   - Auto-liquidation on margin call
   - Margin call notifications

3. **Short Interest Reporting**
   - Show short interest % for stocks
   - Days to cover metric
   - Short squeeze alerts

4. **Intraday Short Selling**
   - MIS (Margin Intraday Square-off) for shorts
   - Auto square-off at EOD
   - Higher leverage (5x)

---

## Non-Goals (Out of Scope)

- ❌ Options short selling (separate feature)
- ❌ Futures short selling (separate feature)
- ❌ Short selling in non-F&O stocks
- ❌ Naked short selling (prohibited by SEBI)
- ❌ Advanced short strategies (short straddle, etc.)

---

## References

- SEBI Short Selling Regulations
- NSE/BSE Short Selling Guidelines
- Zerodha Short Selling Documentation
- Industry best practices

---

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-15 | AI Assistant | Initial creation based on requirements gathering |
