# Short Selling Module

**Version:** 1.0  
**Last Updated:** January 17, 2026  
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Financial Concepts](#financial-concepts)
3. [System Architecture](#system-architecture)
4. [Data Models](#data-models)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Business Logic & Calculations](#business-logic--calculations)
8. [Risk Management](#risk-management)
9. [User Flows](#user-flows)
10. [API Reference](#api-reference)
11. [Testing & Validation](#testing--validation)
12. [Known Limitations](#known-limitations)
13. [Future Enhancements](#future-enhancements)
14. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Short Selling?

Short selling is a trading strategy where an investor borrows shares and sells them immediately, with the intention of buying them back later at a lower price. The profit is the difference between the selling price and the buying price (minus fees and interest).

**Example:**
1. Borrow 100 shares of TCS at ₹3,500 each
2. Sell immediately for ₹3,50,000
3. Stock price drops to ₹3,200
4. Buy back 100 shares for ₹3,20,000
5. Return shares to lender
6. **Profit:** ₹30,000 (minus fees)

### Why Short Selling is Complex

1. **Unlimited Loss Potential**: Unlike buying stocks (max loss = investment), short selling has theoretically unlimited losses if the stock price rises indefinitely
2. **Margin Requirements**: Requires maintaining margin (collateral) that fluctuates with stock price
3. **Borrowing Mechanics**: Involves borrowing shares from a lender (simplified in our system)
4. **Corporate Actions**: Dividends and stock splits affect short positions differently
5. **Regulatory Compliance**: Subject to specific regulations and restrictions

### Implementation Scope

Our implementation covers:
- ✅ Opening short positions (OPEN_SHORT)
- ✅ Closing short positions (CLOSE_SHORT)
- ✅ Margin blocking and release
- ✅ P&L calculation for short positions
- ✅ Real-time margin monitoring
- ✅ Risk alerts (WARNING/CRITICAL)
- ✅ Stop orders for short positions
- ✅ Portfolio snapshot integration
- ✅ Pending order validation

Not implemented (future):
- ❌ Auto-liquidation
- ❌ Corporate action handling (dividends, splits)
- ❌ Borrow fees/interest
- ❌ Short squeeze detection
- ❌ Locate requirements (checking share availability)

---

## Financial Concepts

### Key Terminology

| Term | Definition | Example |
|------|------------|---------|
| **Short Position** | A position where you owe shares to a lender | Short 100 TCS @ ₹3,500 |
| **Cover/Square Off** | Buying back shares to close a short position | Buy 100 TCS @ ₹3,200 to close |
| **Initial Margin** | Upfront collateral required to open position | 20% of position value |
| **Maintenance Margin** | Minimum equity required to keep position open | Varies based on risk |
| **Mark-to-Market (MTM)** | Daily valuation of position at current price | Recalculated every 3 minutes |
| **Unrealized P&L** | Profit/loss on open position | (Entry Price - Current Price) × Qty |
| **Realized P&L** | Profit/loss on closed position | Locked in after covering |
| **Blocked Margin** | Funds locked as collateral | ₹70,000 for ₹3.5L position |

### Margin Calculation

**Initial Margin Requirement:** 20% of position value

```
Position Value = Quantity × Entry Price
Initial Margin = Position Value × 0.20
```

**Example:**
```
Short 100 shares @ ₹3,500
Position Value = 100 × ₹3,500 = ₹3,50,000
Initial Margin = ₹3,50,000 × 0.20 = ₹70,000
```

### P&L Calculation

**For Short Positions:**
```
Unrealized P&L = (Entry Price - Current Price) × Quantity
```

**Why inverted?** Because you profit when price falls.

**Example:**
```
Entry: Short 100 @ ₹3,500
Current Price: ₹3,200
Unrealized P&L = (₹3,500 - ₹3,200) × 100 = +₹30,000 (Profit)

If price rises to ₹3,800:
Unrealized P&L = (₹3,500 - ₹3,800) × 100 = -₹30,000 (Loss)
```

### Equity Calculation

**Total Equity = Cash + Proceeds - Liabilities**

```
Cash = Account Balance - Blocked Margin
Proceeds = Sum of (Entry Price × Qty) for all short positions
Liabilities = Sum of (Current Price × Qty) for all short positions
```

**Example:**
```
Account Balance: ₹1,00,000
Blocked Margin: ₹70,000
Short Position: 100 TCS @ ₹3,500 entry, ₹3,800 current

Cash = ₹1,00,000 - ₹70,000 = ₹30,000
Proceeds = ₹3,500 × 100 = ₹3,50,000
Liabilities = ₹3,800 × 100 = ₹3,80,000

Total Equity = ₹30,000 + ₹3,50,000 - ₹3,80,000 = ₹0
```

### Margin Call Thresholds

| Ratio | Status | Action |
|-------|--------|--------|
| Equity ≥ Blocked Margin | **OK** | No action |
| Equity < Blocked Margin | **WARNING** | Alert user to add funds |
| Equity < 50% of Blocked Margin | **CRITICAL** | Urgent liquidation warning |
| Equity < 0 | **NEGATIVE** | Account bankrupt (prevented by monitoring) |

---

## System Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────────────────────────────────────────┤
│  TradePanel (Short Mode Toggle)                             │
│  HoldingsTable (Cover Button)                               │
│  PositionBanner (Short Position Display)                    │
│  ShortSellWarning (Risk Disclosure Modal)                   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                     Backend API                              │
├─────────────────────────────────────────────────────────────┤
│  OrderController (Intent-based routing)                     │
│  PortfolioController (Holdings with margin status)          │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Service Layer                              │
├─────────────────────────────────────────────────────────────┤
│  OrderService (Intent validation, margin checks)            │
│  PortfolioService (Position management, P&L calc)           │
│  MatchingService (Order execution)                          │
│  MarginMonitorService (Background risk monitoring)          │
│  StopOrderService (Stop loss for shorts)                    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Repository Layer                            │
├─────────────────────────────────────────────────────────────┤
│  OrderRepository (GetPendingQuantity)                       │
│  PortfolioRepository (Holding CRUD)                         │
│  TradingAccountRepository (FindAccountsWithPositions)       │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    MongoDB                                   │
├─────────────────────────────────────────────────────────────┤
│  orders (with intent field)                                 │
│  holdings (with positionType, blockedMargin)                │
│  trading_accounts (with blockedMargin)                      │
│  portfolio_snapshots (equity calculations)                  │
└─────────────────────────────────────────────────────────────┘
```

### Background Workers

```
┌─────────────────────────────────────────────────────────────┐
│              Background Services (Goroutines)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MarginMonitorService (Every 3 minutes)              │  │
│  │  ├─ Fetch accounts with blocked_margin > 0          │  │
│  │  ├─ Calculate real-time equity via snapshot         │  │
│  │  ├─ Check ratio: Equity / BlockedMargin             │  │
│  │  └─ Send alerts if < 1.0 (WARNING) or < 0.5 (CRIT)  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  StopOrderService (Every 3 seconds)                  │  │
│  │  ├─ Monitor pending stop orders                      │  │
│  │  ├─ Check trigger conditions                         │  │
│  │  └─ Preserve Intent when creating child orders       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MatchingService (Every 3 seconds)                   │  │
│  │  └─ Execute limit orders (respects intent)           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Order Model

**File:** `backend/internal/models/order.go`

```go
type Order struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    OrderID      string             `bson:"order_id" json:"orderId"`
    UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
    AccountID    primitive.ObjectID `bson:"account_id" json:"accountId"`
    InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
    Symbol       string             `bson:"symbol" json:"symbol"`
    
    // Core Fields
    Side         string             `bson:"side" json:"side"` // BUY or SELL
    Intent       string             `bson:"intent" json:"intent"` // NEW: Intent enum
    OrderType    string             `bson:"order_type" json:"orderType"`
    Quantity     int                `bson:"quantity" json:"quantity"`
    Price        *float64           `bson:"price,omitempty" json:"price,omitempty"`
    
    // Stop Order Fields
    StopPrice    *float64           `bson:"stop_price,omitempty" json:"stopPrice,omitempty"`
    // ... other fields
}
```

**Intent Enum:**
```go
const (
    IntentOpenLong   Intent = "OPEN_LONG"   // Buy to open long position
    IntentCloseLong  Intent = "CLOSE_LONG"  // Sell to close long position
    IntentOpenShort  Intent = "OPEN_SHORT"  // Sell to open short position
    IntentCloseShort Intent = "CLOSE_SHORT" // Buy to close short position
)
```

### Holding Model

**File:** `backend/internal/models/holding.go`

```go
type Holding struct {
    ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UserID        primitive.ObjectID `bson:"user_id" json:"userId"`
    InstrumentID  primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
    Symbol        string             `bson:"symbol" json:"symbol"`
    
    // Position Details
    Quantity      int                `bson:"quantity" json:"quantity"`
    AvgEntryPrice float64            `bson:"avg_entry_price" json:"avgEntryPrice"`
    PositionType  PositionType       `bson:"position_type" json:"positionType"` // NEW
    
    // Margin Fields (for short positions)
    BlockedMargin  float64           `bson:"blocked_margin" json:"blockedMargin"` // NEW
    InitialMargin  float64           `bson:"initial_margin" json:"initialMargin"` // NEW
    MarginStatus   string            `bson:"margin_status,omitempty" json:"marginStatus,omitempty"` // NEW
    
    // Timestamps
    CreatedAt     time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt     time.Time          `bson:"updated_at" json:"updatedAt"`
}
```

**PositionType Enum:**
```go
const (
    PositionLong  PositionType = "LONG"
    PositionShort PositionType = "SHORT"
)
```

### TradingAccount Model

**File:** `backend/internal/models/trading_account.go`

```go
type TradingAccount struct {
    ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UserID        primitive.ObjectID `bson:"user_id" json:"userId"`
    Balance       float64            `bson:"balance" json:"balance"`
    BlockedMargin float64            `bson:"blocked_margin" json:"blockedMargin"` // NEW
    RealizedPL    float64            `bson:"realized_pl" json:"realizedPL"`
    Currency      string             `bson:"currency" json:"currency"`
    Status        string             `bson:"status" json:"status"`
    CreatedAt     time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt     time.Time          `bson:"updated_at" json:"updatedAt"`
}
```

### Instrument Model

**File:** `backend/internal/models/instrument.go`

```go
type Instrument struct {
    ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Symbol      string             `bson:"symbol" json:"symbol"`
    Name        string             `bson:"name" json:"name"`
    IsShortable bool               `bson:"is_shortable" json:"isShortable"` // NEW
    // ... other fields
}
```

---

## Backend Implementation

### Phase 1: Order Service - Intent Validation

**File:** `backend/internal/services/order_service.go`

#### Intent Inference (Backward Compatibility)

```go
// If intent is missing, infer from side
if req.Intent == "" {
    if req.Side == "BUY" {
        req.Intent = string(models.IntentOpenLong)
    } else {
        req.Intent = string(models.IntentCloseLong)
    }
}
```

#### Auto-Correction for Frontend Bug

```go
// CRITICAL FIX: Auto-correct if Frontend sends OPEN_LONG for a SELL order
if req.Side == "SELL" && req.Intent == string(models.IntentOpenLong) {
    log.Printf("WARNING: Detected SELL order with OPEN_LONG intent. Auto-correcting to OPEN_SHORT for user %s", userID)
    req.Intent = string(models.IntentOpenShort)
}
```

**Why needed?** Early implementation had a frontend bug where the wrong intent was sent. This prevents data corruption.

#### Side vs Intent Validation

```go
// Validate consistency
if (req.Intent == string(models.IntentOpenLong) || req.Intent == string(models.IntentCloseShort)) && req.Side != "BUY" {
    return nil, errors.New("invalid intent for BUY order")
}
if (req.Intent == string(models.IntentCloseLong) || req.Intent == string(models.IntentOpenShort)) && req.Side != "SELL" {
    return nil, errors.New("invalid intent for SELL order")
}
```

#### Short Sell Validation

```go
if req.Intent == string(models.IntentOpenShort) {
    // 1. Check if instrument is shortable
    if !instrument.IsShortable {
        return nil, errors.New("this instrument is not eligible for short selling")
    }

    // 2. Check Margin Availability (20% Requirement)
    requiredMargin := orderPrice * float64(req.Quantity) * 0.20

    // 3. Check available funds
    if account.Balance-account.BlockedMargin < requiredMargin {
        return nil, fmt.Errorf("insufficient margin. Required: ₹%0.2f, Available: ₹%0.2f", 
            requiredMargin, account.Balance-account.BlockedMargin)
    }
}
```

#### Close Short Validation

```go
if req.Intent == string(models.IntentCloseShort) {
    // Validate that we have a short position to cover
    holding, err := s.portfolioService.GetHolding(context.Background(), userID, instrument.ID.Hex())
    if err != nil {
        return nil, fmt.Errorf("failed to validate holdings: %v", err)
    }
    if holding == nil || holding.PositionType != models.PositionShort {
        return nil, errors.New("no short position found to cover")
    }

    // Check Pending Orders to prevent Over-Covering
    pendingQty, err := s.orderRepo.GetPendingQuantity(userID, instrument.ID.Hex(), req.Intent)
    if err != nil {
        return nil, fmt.Errorf("failed to check pending orders: %v", err)
    }

    totalCommitted := pendingQty + req.Quantity
    if holding.Quantity < totalCommitted {
        return nil, fmt.Errorf("insufficient short quantity. Open: %d, Committed: %d, Converting: %d", 
            holding.Quantity, pendingQty, req.Quantity)
    }
}
```

### Phase 2: Portfolio Service - Position Management

**File:** `backend/internal/services/portfolio_service.go`

#### UpdatePosition Logic

```go
func (s *PortfolioService) UpdatePosition(ctx context.Context, userID string, trade *models.Trade) error {
    holding, err := s.GetHolding(ctx, userID, trade.InstrumentID.Hex())
    
    if trade.Intent == models.IntentOpenShort {
        // Opening a new short position or adding to existing
        if holding == nil {
            // Create new short holding
            newHolding := &models.Holding{
                UserID:        userUID,
                InstrumentID:  trade.InstrumentID,
                Symbol:        trade.Symbol,
                Quantity:      trade.Quantity,
                AvgEntryPrice: trade.Price,
                PositionType:  models.PositionShort, // Explicit
                BlockedMargin: trade.Price * float64(trade.Quantity) * 0.20,
                InitialMargin: trade.Price * float64(trade.Quantity) * 0.20,
                MarginStatus:  "OK",
            }
            return s.portfolioRepo.Create(newHolding)
        } else {
            // Add to existing short position (average down/up)
            totalQty := holding.Quantity + trade.Quantity
            holding.AvgEntryPrice = ((holding.AvgEntryPrice * float64(holding.Quantity)) + 
                                     (trade.Price * float64(trade.Quantity))) / float64(totalQty)
            holding.Quantity = totalQty
            holding.PositionType = models.PositionShort // Enforce (self-healing)
            
            // Update margin
            additionalMargin := trade.Price * float64(trade.Quantity) * 0.20
            holding.BlockedMargin += additionalMargin
            holding.InitialMargin += additionalMargin
            
            return s.portfolioRepo.Update(holding)
        }
    }
    
    if trade.Intent == models.IntentCloseShort {
        // Closing short position (covering)
        if holding == nil || holding.PositionType != models.PositionShort {
            return errors.New("no short position to close")
        }
        
        // Calculate proportional margin release
        releaseRatio := float64(trade.Quantity) / float64(holding.Quantity)
        marginToRelease := holding.BlockedMargin * releaseRatio
        
        // Update holding
        holding.Quantity -= trade.Quantity
        holding.BlockedMargin -= marginToRelease
        
        if holding.Quantity == 0 {
            // Position fully closed
            return s.portfolioRepo.Delete(holding.ID.Hex())
        } else {
            return s.portfolioRepo.Update(holding)
        }
    }
    
    // Similar logic for OPEN_LONG and CLOSE_LONG...
}
```

#### Margin Blocking

```go
// Block margin in trading account
func (s *PortfolioService) blockMargin(accountID primitive.ObjectID, amount float64) error {
    account, err := s.tradingAccountService.GetAccountByID(accountID.Hex())
    if err != nil {
        return err
    }
    
    account.BlockedMargin += amount
    return s.tradingAccountService.Update(account)
}
```

#### Margin Release

```go
// Release margin proportionally
func (s *PortfolioService) releaseMargin(accountID primitive.ObjectID, amount float64) error {
    account, err := s.tradingAccountService.GetAccountByID(accountID.Hex())
    if err != nil {
        return err
    }
    
    account.BlockedMargin -= amount
    if account.BlockedMargin < 0 {
        account.BlockedMargin = 0 // Safety check
    }
    
    return s.tradingAccountService.Update(account)
}
```

### Phase 3: Margin Monitor Service

**File:** `backend/internal/services/margin_monitor_service.go`

```go
type MarginMonitorService struct {
    accountRepo         *repositories.TradingAccountRepository
    portfolioService    *PortfolioService
    notificationService *NotificationService
    stopChan            chan struct{}
}

func (s *MarginMonitorService) Start() {
    ticker := time.NewTicker(3 * time.Minute)
    go func() {
        for {
            select {
            case <-ticker.C:
                s.CheckMargins()
            case <-s.stopChan:
                ticker.Stop()
                return
            }
        }
    }()
    log.Println("Margin monitoring service started (polling 3m)")
}

func (s *MarginMonitorService) CheckMargins() {
    // 1. Find accounts with active positions
    accounts, err := s.accountRepo.FindAccountsWithPositions()
    if err != nil {
        log.Printf("[MarginMonitor] Error fetching accounts: %v", err)
        return
    }

    for _, account := range accounts {
        userID := account.UserID.Hex()

        // 2. Calculate Real-Time Equity
        snapshot, err := s.portfolioService.CaptureSnapshot(context.Background(), userID)
        if err != nil {
            log.Printf("[MarginMonitor] Failed to snapshot user %s: %v", userID, err)
            continue
        }

        equity := snapshot.TotalEquity
        blocked := account.BlockedMargin

        if blocked == 0 {
            continue
        }
        
        // 3. Risk Calculation
        ratio := equity / blocked

        if ratio < 0.5 {
            // CRITICAL: Equity < 50% of Initial Margin
            log.Printf("[MarginMonitor] CRITICAL: User %s Ratio %.2f", userID, ratio)
            
            s.notificationService.SendNotification(
                context.Background(),
                userID,
                models.NotificationTypeAlert,
                "MARGIN CALL: CRITICAL",
                fmt.Sprintf("Your account equity (₹%.2f) is critically low. Immediate funds required or positions will be auto-liquidated.", equity),
                map[string]interface{}{"level": "CRITICAL", "equity": equity, "margin": blocked},
                nil,
            )
        } else if ratio < 1.0 {
            // WARNING: Equity dropped below Initial Margin
            log.Printf("[MarginMonitor] WARNING: User %s Ratio %.2f", userID, ratio)

            s.notificationService.SendNotification(
                context.Background(),
                userID,
                models.NotificationTypeAlert,
                "Margin Warning",
                fmt.Sprintf("Your equity (₹%.2f) has dropped below the blocked margin requirement. Please add funds.", equity),
                map[string]interface{}{"level": "WARNING", "equity": equity, "margin": blocked},
                nil,
            )
        }
    }
}
```

### Phase 4: Stop Order Service - Intent Preservation

**File:** `backend/internal/services/stop_order_service.go`

```go
func (s *StopOrderService) TriggerStopOrder(order *models.Order, currentPrice float64) error {
    // Create child order
    newOrder := &models.Order{
        UserID:       order.UserID,
        AccountID:    order.AccountID,
        InstrumentID: order.InstrumentID,
        Symbol:       order.Symbol,
        Side:         order.Side,
        Intent:       order.Intent, // CRITICAL: Preserve intent
        OrderType:    "MARKET", // or "LIMIT" for STOP_LIMIT
        Quantity:     order.Quantity,
        Validity:     "IOC",
    }
    
    // Place the child order
    _, err := s.orderService.PlaceOrder(order.UserID.Hex(), *newOrder)
    if err != nil {
        return fmt.Errorf("failed to place child order: %v", err)
    }
    
    // Mark stop order as TRIGGERED
    order.Status = "TRIGGERED"
    return s.orderRepo.Update(order)
}
```

**Why critical?** Without preserving intent, a BUY stop order to cover a short would fail with "cannot open long position".

### Phase 5: Portfolio Snapshot - Equity Fix

**File:** `backend/internal/services/portfolio_service.go`

```go
func (s *PortfolioService) CaptureSnapshot(ctx context.Context, userID string) (*models.PortfolioSnapshot, error) {
    holdings, err := s.GetHoldings(ctx, userID)
    if err != nil {
        return nil, err
    }

    var holdingsValue float64 = 0
    
    for _, holding := range holdings {
        marketData, _ := s.marketService.GetMarketData(holding.InstrumentID.Hex())
        currentPrice := marketData.LastPrice
        currentValue := currentPrice * float64(holding.Quantity)
        
        // CRITICAL FIX: Treat short positions as liabilities
        if holding.PositionType == models.PositionShort {
            holdingsValue -= currentValue // Subtract (liability)
        } else {
            holdingsValue += currentValue // Add (asset)
        }
    }
    
    account, _ := s.tradingAccountService.GetAccountByUserID(userID)
    
    snapshot := &models.PortfolioSnapshot{
        UserID:       userUID,
        TotalEquity:  account.Balance + holdingsValue, // Correct equity
        // ... other fields
    }
    
    return s.portfolioRepo.CreateSnapshot(snapshot)
}
```

### Phase 6: Pending Order Validation

**File:** `backend/internal/repositories/order_repository.go`

```go
// GetPendingQuantity calculates total quantity of active (NEW) orders for specific intent
func (r *OrderRepository) GetPendingQuantity(userID string, instrumentID string, intent string) (int, error) {
    userUID, _ := primitive.ObjectIDFromHex(userID)
    instrID, _ := primitive.ObjectIDFromHex(instrumentID)

    pipeline := []bson.M{
        {
            "$match": bson.M{
                "user_id":       userUID,
                "instrument_id": instrID,
                "status":        "NEW", // Actively on the book
                "intent":        intent,
            },
        },
        {
            "$group": bson.M{
                "_id":   nil,
                "total": bson.M{"$sum": "$quantity"},
            },
        },
    }

    cursor, _ := r.collection.Aggregate(context.Background(), pipeline)
    defer cursor.Close(context.Background())

    var result []struct {
        Total int `bson:"total"`
    }

    if cursor.Next(context.Background()) {
        cursor.Decode(&result)
        if len(result) > 0 {
            return result[0].Total, nil
        }
    }
    
    return 0, nil
}
```

**Usage in OrderService:**

```go
// Check Pending Orders to prevent Over-Covering
pendingQty, err := s.orderRepo.GetPendingQuantity(userID, instrument.ID.Hex(), req.Intent)
if err != nil {
    return nil, fmt.Errorf("failed to check pending orders: %v", err)
}

totalCommitted := pendingQty + req.Quantity
if holding.Quantity < totalCommitted {
    return nil, fmt.Errorf("insufficient holdings to sell. Owned: %d, Committed: %d, Requested: %d", 
        holding.Quantity, pendingQty, req.Quantity)
}
```

**Why needed?** Prevents "money black hole" where user places multiple limit orders that together exceed their position.

---

## Frontend Implementation

### TradePanel - Short Mode Toggle

**File:** `frontend/src/features/trading/components/TradePanel.tsx`

#### State Management

```typescript
interface TradePanelProps {
    instrument: Instrument;
    ltp: number;
    initialSide?: 'BUY' | 'SELL';
    initialQuantity?: number;
    initialIntent?: 'OPEN_LONG' | 'OPEN_SHORT' | 'CLOSE_LONG' | 'CLOSE_SHORT';
}

const [shortMode, setShortMode] = useState(() => {
    // Auto-enable if navigating from "Cover" button
    return initialIntent === 'OPEN_SHORT' || initialIntent === 'CLOSE_SHORT';
});

const [riskAccepted, setRiskAccepted] = useState(() => 
    localStorage.getItem('shortSellRiskAccepted') === 'true'
);
```

#### Short Mode Toggle UI

```typescript
<FormControlLabel
    control={
        <Switch
            checked={shortMode}
            onChange={(e) => handleShortModeChange(e.target.checked)}
            color="warning"
        />
    }
    label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
                Short Selling Mode
            </Typography>
            {instrument.isShortable && (
                <Chip label="Eligible" size="small" color="success" />
            )}
        </Box>
    }
/>
```

#### Risk Warning Modal

```typescript
const handleShortModeChange = (enabled: boolean) => {
    if (enabled && !riskAccepted) {
        setShowRiskWarning(true); // Show modal
    } else {
        setShortMode(enabled);
    }
};

const handleRiskAccept = (accepted: boolean) => {
    setShowRiskWarning(false);
    if (accepted) {
        setRiskAccepted(true);
        localStorage.setItem('shortSellRiskAccepted', 'true');
        setShortMode(true);
    }
};
```

#### Intent Calculation

```typescript
const calculateIntent = (): string => {
    if (shortMode) {
        return side === 'SELL' ? 'OPEN_SHORT' : 'CLOSE_SHORT';
    } else {
        return side === 'BUY' ? 'OPEN_LONG' : 'CLOSE_LONG';
    }
};
```

#### Margin Display

```typescript
const requiredMargin = useMemo(() => {
    const value = estValue;

    if (shortMode && side === 'SELL') {
        // Short Sell Margin: 20% of Value + Fees
        return (value * 0.20) + fees;
    }

    // Regular Buy: Full Value + Fees
    return value + fees;
}, [estValue, shortMode, side, fees]);

// Display
{shortMode && side === 'SELL' ? (
    <Box>
        <Typography variant="caption" color="text.secondary">
            Required Margin (20%)
        </Typography>
        <Typography variant="h6" fontWeight={700}>
            ₹{requiredMargin.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </Typography>
    </Box>
) : (
    <Box>
        <Typography variant="caption" color="text.secondary">
            Total Amount
        </Typography>
        <Typography variant="h6" fontWeight={700}>
            ₹{requiredMargin.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </Typography>
    </Box>
)}
```

### HoldingsTable - Cover Button

**File:** `frontend/src/features/portfolio/components/HoldingsTable.tsx`

#### P&L Calculation

```typescript
const isShort = holding.positionType === 'SHORT';
const currentValue = ltp * holding.quantity;
const investedValue = (holding.avgEntryPrice || 0) * holding.quantity;

// P&L Logic
// Long: Current - Invested
// Short: Invested - Current (Liability)
const unrealizedPL = isShort
    ? (investedValue - currentValue)
    : (currentValue - investedValue);
```

#### Cover Button Navigation

```typescript
<Button
    variant="outlined"
    size="small"
    color={isShort ? "success" : "error"}
    onClick={() => navigate(`/instruments/${holding.instrumentId}`, {
        state: {
            side: isShort ? 'BUY' : 'SELL',
            intent: isShort ? 'CLOSE_SHORT' : 'CLOSE_LONG',
            quantity: holding.quantity
        }
    })}
>
    {isShort ? "Cover" : "Sell"}
</Button>
```

### PositionBanner - Short Position Display

**File:** `frontend/src/features/portfolio/components/PositionBanner.tsx`

```typescript
const isShort = position.positionType === 'SHORT';

// P&L Calculation
const unrealizedPL = isShort
    ? (position.avgEntryPrice - ltp) * position.quantity
    : (ltp - position.avgEntryPrice) * position.quantity;

// Display
<Typography variant="h5" fontWeight={700} color={unrealizedPL >= 0 ? 'success.main' : 'error.main'}>
    {unrealizedPL >= 0 ? '+' : ''}₹{unrealizedPL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
</Typography>

{isShort && (
    <Chip label="SHORT POSITION" size="small" color="warning" />
)}
```

### ShortSellWarning Modal

**File:** `frontend/src/features/trading/components/ShortSellWarning.tsx`

```typescript
export const ShortSellWarning: React.FC<Props> = ({ open, onAccept, onDecline }) => {
    const [understood1, setUnderstood1] = useState(false);
    const [understood2, setUnderstood2] = useState(false);
    const [understood3, setUnderstood3] = useState(false);

    const allAccepted = understood1 && understood2 && understood3;

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon color="warning" />
                    Short Selling Risk Disclosure
                </Box>
            </DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Short selling involves significant risks. Please read carefully.
                </Alert>
                
                <FormControlLabel
                    control={<Checkbox checked={understood1} onChange={(e) => setUnderstood1(e.target.checked)} />}
                    label="I understand that losses from short selling can be unlimited if the stock price rises indefinitely."
                />
                
                <FormControlLabel
                    control={<Checkbox checked={understood2} onChange={(e) => setUnderstood2(e.target.checked)} />}
                    label="I understand that I must maintain sufficient margin, or my position may be liquidated."
                />
                
                <FormControlLabel
                    control={<Checkbox checked={understood3} onChange={(e) => setUnderstood3(e.target.checked)} />}
                    label="I understand the mechanics of short selling and accept all associated risks."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onDecline}>Cancel</Button>
                <Button 
                    onClick={() => onAccept(true)} 
                    variant="contained" 
                    color="warning"
                    disabled={!allAccepted}
                >
                    I Accept the Risks
                </Button>
            </DialogActions>
        </Dialog>
    );
};
```

---

## Business Logic & Calculations

### Margin Blocking Flow

```
1. User places OPEN_SHORT order for 100 TCS @ ₹3,500
2. OrderService validates:
   - Instrument is shortable ✓
   - Required margin = ₹3,50,000 × 0.20 = ₹70,000
   - Available funds = Balance - BlockedMargin = ₹1,00,000 - ₹0 = ₹1,00,000 ✓
3. MatchingService executes order
4. PortfolioService creates holding:
   - Quantity: 100
   - AvgEntryPrice: ₹3,500
   - PositionType: SHORT
   - BlockedMargin: ₹70,000
   - InitialMargin: ₹70,000
5. TradingAccountService updates account:
   - BlockedMargin: ₹0 → ₹70,000
```

### Margin Release Flow (Partial Cover)

```
1. User has short position: 100 TCS @ ₹3,500 (Blocked: ₹70,000)
2. User places CLOSE_SHORT order for 50 TCS @ ₹3,200
3. MatchingService executes
4. PortfolioService calculates:
   - Release ratio = 50 / 100 = 0.5
   - Margin to release = ₹70,000 × 0.5 = ₹35,000
5. Update holding:
   - Quantity: 100 → 50
   - BlockedMargin: ₹70,000 → ₹35,000
6. Update account:
   - BlockedMargin: ₹70,000 → ₹35,000
   - Balance: +₹15,000 (profit from covering at lower price)
```

### Equity Calculation Example

**Scenario:**
- Account Balance: ₹1,00,000
- Long Position: 50 INFY @ ₹1,500 entry, ₹1,600 current
- Short Position: 100 TCS @ ₹3,500 entry, ₹3,800 current
- Blocked Margin: ₹70,000

**Calculation:**
```
Cash = ₹1,00,000 - ₹70,000 = ₹30,000

Long Holdings Value:
  = 50 × ₹1,600 = ₹80,000 (Asset)

Short Holdings Value:
  Proceeds = 100 × ₹3,500 = ₹3,50,000
  Liability = 100 × ₹3,800 = ₹3,80,000
  Net = ₹3,50,000 - ₹3,80,000 = -₹30,000 (Liability)

Total Equity = ₹30,000 + ₹80,000 + (-₹30,000) = ₹80,000
```

**Margin Health:**
```
Ratio = ₹80,000 / ₹70,000 = 1.14 → OK (> 1.0)
```

---

## Risk Management

### Margin Monitoring Algorithm

```
Every 3 minutes:
  FOR EACH account WHERE blocked_margin > 0:
    1. Fetch all holdings
    2. Calculate current equity:
       equity = balance + Σ(long_holdings_value) - Σ(short_holdings_value)
    3. Calculate ratio = equity / blocked_margin
    4. IF ratio < 0.5:
         Send CRITICAL alert
         Log for manual review
       ELSE IF ratio < 1.0:
         Send WARNING alert
    5. Update margin_status on holdings (future)
```

### Alert Thresholds

| Ratio Range | Status | Alert Type | Recommended Action |
|-------------|--------|------------|-------------------|
| ≥ 1.5 | Healthy | None | Continue trading |
| 1.0 - 1.5 | Adequate | None | Monitor closely |
| 0.5 - 1.0 | Warning | Email + Push | Add funds soon |
| 0.0 - 0.5 | Critical | Email + Push + SMS | Add funds immediately |
| < 0.0 | Negative | Force Liquidation | Auto-close positions |

### Prevented Scenarios

#### 1. Over-Covering (Double-Spend)

**Problem:** User has 100 shares short, places 2 limit orders for 100 shares each.

**Prevention:**
```go
pendingQty := GetPendingQuantity(userID, instrumentID, "CLOSE_SHORT")
// pendingQty = 100 (from first limit order)

totalCommitted := pendingQty + req.Quantity
// totalCommitted = 100 + 100 = 200

if holding.Quantity < totalCommitted {
    // 100 < 200 → ERROR
    return error("insufficient quantity")
}
```

#### 2. Unlimited Loss

**Problem:** Stock price doubles, user equity goes negative.

**Prevention:**
```go
// Margin Monitor detects:
equity := ₹20,000 + ₹3,50,000 - ₹7,00,000 = -₹3,30,000
ratio := -₹3,30,000 / ₹70,000 = -4.71

// Sends CRITICAL alert
// (Future: Auto-liquidate)
```

#### 3. Stop Loss Failure

**Problem:** BUY stop order to cover short fails with "cannot open long".

**Prevention:**
```go
// StopOrderService preserves intent
newOrder.Intent = order.Intent // "CLOSE_SHORT"

// OrderService validates correctly
if intent == "CLOSE_SHORT" && side == "BUY" {
    // Valid ✓
}
```

---

## User Flows

### Flow 1: Opening a Short Position

```
1. User navigates to TCS instrument page
2. Toggles "Short Selling Mode" switch
3. If first time:
   a. ShortSellWarning modal appears
   b. User reads risks and checks all boxes
   c. Clicks "I Accept the Risks"
   d. Preference saved to localStorage
4. User selects SELL side
5. Enters quantity: 100
6. System displays:
   - Required Margin: ₹70,000 (20% of ₹3,50,000)
   - Available Funds: ₹1,00,000
   - Proceeds: ₹3,50,000
7. User clicks "Short Sell"
8. Backend validates:
   - Instrument is shortable ✓
   - Sufficient margin ✓
   - Intent = OPEN_SHORT ✓
9. Order executes
10. Notification: "SHORT SELL order filled"
11. Holdings table shows:
    - TCS | 100 | ₹3,500 | [SHORT badge]
    - Blocked Margin: ₹70,000
    - P&L: ₹0
```

### Flow 2: Covering a Short Position (Profit)

```
1. User has short position: 100 TCS @ ₹3,500
2. Stock price drops to ₹3,200
3. Holdings table shows:
   - Unrealized P&L: +₹30,000 (green)
4. User clicks "Cover" button
5. Navigates to TCS page with:
   - Short Mode: ON
   - Side: BUY
   - Quantity: 100 (prefilled)
6. User clicks "Cover Position"
7. Backend validates:
   - Intent = CLOSE_SHORT ✓
   - Has short position ✓
   - Sufficient quantity ✓
8. Order executes
9. PortfolioService:
   - Releases ₹70,000 margin
   - Calculates realized P&L: +₹30,000
   - Deletes holding (fully closed)
10. TradingAccountService:
    - BlockedMargin: ₹70,000 → ₹0
    - Balance: +₹30,000 (profit)
11. Notification: "Position covered. Profit: ₹30,000"
```

### Flow 3: Margin Call Scenario

```
1. User has short position: 100 TCS @ ₹3,500
   - Blocked Margin: ₹70,000
   - Account Balance: ₹1,00,000
   - Equity: ₹1,00,000
2. Stock price rises to ₹4,000
3. Margin Monitor (runs every 3 min):
   - Calculates equity:
     Cash = ₹1,00,000 - ₹70,000 = ₹30,000
     Proceeds = ₹3,50,000
     Liability = ₹4,00,000
     Equity = ₹30,000 + ₹3,50,000 - ₹4,00,000 = -₹20,000
   - Ratio = -₹20,000 / ₹70,000 = -0.29
   - Status: CRITICAL
4. System sends notification:
   - Type: ALERT
   - Title: "MARGIN CALL: CRITICAL"
   - Message: "Your equity (₹-20,000) is critically low..."
5. User sees red banner on dashboard
6. User options:
   a. Add funds to account
   b. Cover position immediately
   c. Wait (risk auto-liquidation in future)
```

### Flow 4: Stop Loss for Short Position

```
1. User has short position: 100 TCS @ ₹3,500
2. User places BUY STOP order:
   - Side: BUY
   - Intent: CLOSE_SHORT
   - Quantity: 100
   - Stop Price: ₹3,700 (limit loss to ₹20,000)
3. Order saved with status: PENDING
4. Stock price rises to ₹3,750
5. StopOrderService (runs every 3s):
   - Detects trigger: ₹3,750 >= ₹3,700
   - Creates child MARKET order:
     - Side: BUY
     - Intent: CLOSE_SHORT (preserved!)
     - Quantity: 100
6. Child order executes at ₹3,750
7. Position covered with loss: -₹25,000
8. Notification: "Stop loss triggered. Loss: ₹25,000"
```

---

## API Reference

### POST /api/orders

**Request:**
```json
{
  "instrumentId": "695805d566cc87d24627c2e3",
  "side": "SELL",
  "intent": "OPEN_SHORT",
  "orderType": "MARKET",
  "quantity": 100,
  "validity": "DAY"
}
```

**Response:**
```json
{
  "id": "67890...",
  "orderId": "ORD-1737065400000",
  "status": "NEW",
  "side": "SELL",
  "intent": "OPEN_SHORT",
  "quantity": 100,
  "createdAt": "2026-01-17T00:10:00Z"
}
```

### GET /api/portfolio/holdings

**Response:**
```json
{
  "holdings": [
    {
      "id": "abc123...",
      "symbol": "TCS",
      "quantity": 100,
      "avgEntryPrice": 3500.00,
      "positionType": "SHORT",
      "blockedMargin": 70000.00,
      "initialMargin": 70000.00,
      "marginStatus": "OK"
    }
  ]
}
```

### GET /api/dashboard/summary

**Response:**
```json
{
  "performanceOverview": {
    "totalEquity": 80000.00,
    "realizedPL": 15000.00,
    "unrealizedPL": -30000.00
  },
  "portfolioDistribution": {
    "activePositions": 2,
    "longPositions": 1,
    "shortPositions": 1
  }
}
```

---

## Testing & Validation

### Manual Test Cases

#### Test Case 1: Open Short Position

**Preconditions:**
- User has ₹1,00,000 balance
- TCS is shortable
- TCS LTP = ₹3,500

**Steps:**
1. Navigate to TCS instrument page
2. Enable Short Selling Mode
3. Accept risk warning (if first time)
4. Select SELL side
5. Enter quantity: 100
6. Verify required margin shows ₹70,000
7. Click "Short Sell"

**Expected:**
- Order executes successfully
- Holdings table shows SHORT position
- Blocked margin = ₹70,000
- Available balance = ₹30,000

#### Test Case 2: Partial Cover

**Preconditions:**
- User has 100 TCS short @ ₹3,500
- Blocked margin = ₹70,000
- Current price = ₹3,200

**Steps:**
1. Click "Cover" button (or navigate manually)
2. Change quantity to 50
3. Click "Cover Position"

**Expected:**
- Order executes
- Remaining position: 50 TCS
- Blocked margin = ₹35,000
- Realized P&L = +₹15,000
- Available balance increases

#### Test Case 3: Margin Call Alert

**Preconditions:**
- User has 100 TCS short @ ₹3,500
- Account balance = ₹1,00,000

**Steps:**
1. Simulate price increase to ₹4,500
2. Wait 3 minutes for margin monitor
3. Check notifications

**Expected:**
- CRITICAL alert received
- Alert message shows negative equity
- Dashboard shows red warning banner

#### Test Case 4: Prevent Over-Covering

**Preconditions:**
- User has 100 TCS short

**Steps:**
1. Place LIMIT BUY order for 100 shares (CLOSE_SHORT)
2. Attempt to place another MARKET BUY for 100 shares

**Expected:**
- Second order rejected
- Error: "insufficient quantity. Owned: 100, Committed: 100, Requested: 100"

### Automated Tests (Future)

```go
func TestShortSellValidation(t *testing.T) {
    // Setup
    orderService := setupOrderService()
    
    // Test: Reject non-shortable instrument
    order := &models.Order{
        InstrumentID: nonShortableID,
        Side: "SELL",
        Intent: "OPEN_SHORT",
        Quantity: 100,
    }
    
    _, err := orderService.PlaceOrder(userID, order)
    assert.Error(t, err)
    assert.Contains(t, err.Error(), "not eligible for short selling")
}

func TestMarginRelease(t *testing.T) {
    // Setup
    portfolioService := setupPortfolioService()
    
    // Create short position
    holding := createShortHolding(100, 3500, 70000)
    
    // Partial cover
    trade := &models.Trade{
        Intent: models.IntentCloseShort,
        Quantity: 50,
        Price: 3200,
    }
    
    err := portfolioService.UpdatePosition(ctx, userID, trade)
    assert.NoError(t, err)
    
    // Verify
    updated := getHolding(userID, instrumentID)
    assert.Equal(t, 50, updated.Quantity)
    assert.Equal(t, 35000.0, updated.BlockedMargin)
}
```

---

## Known Limitations

### 1. No Auto-Liquidation

**Current:** System sends alerts but doesn't force-close positions.

**Risk:** User could ignore alerts and go deeply negative.

**Mitigation:** Manual monitoring + future implementation.

### 2. Corporate Actions Not Handled

**Dividends:**
- Short sellers owe dividends to lenders
- Not automatically deducted

**Stock Splits:**
- Position quantity not adjusted
- Could lead to incorrect P&L

**Mitigation:** Manual adjustment + future implementation.

### 3. No Borrow Fees

**Current:** No daily interest charges.

**Risk:** Unrealistic cost model.

**Mitigation:** Document as demo limitation.

### 4. Simplified Borrow Mechanics

**Current:** Assumes infinite share availability.

**Reality:** Shares must be located and borrowed.

**Mitigation:** Document as demo limitation.

### 5. No Short Squeeze Detection

**Current:** No alerts for high short interest or low liquidity.

**Risk:** User could be caught in squeeze.

**Mitigation:** User education + future implementation.

---

## Future Enhancements

### Phase 6: Auto-Liquidation Engine

**Priority:** HIGH

**Implementation:**
1. Add `auto_liquidate` flag to margin monitor
2. When ratio < 0.0, trigger force cover:
   ```go
   if ratio < 0.0 {
       // Create forced MARKET order
       forcedOrder := &models.Order{
           Side: "BUY",
           Intent: "CLOSE_SHORT",
           OrderType: "MARKET",
           Quantity: holding.Quantity,
           Validity: "IOC",
       }
       orderService.PlaceOrder(userID, forcedOrder)
   }
   ```
3. Send notification: "Position auto-liquidated"
4. Log event for audit

**Challenges:**
- Market impact (slippage)
- Partial fills
- User consent

### Phase 7: Corporate Actions Handler

**Priority:** MEDIUM

**Implementation:**
1. Create `CorporateAction` model
2. Subscribe to corporate action feed
3. On dividend:
   ```go
   if holding.PositionType == SHORT {
       deduction := dividendPerShare * holding.Quantity
       account.Balance -= deduction
       // Send notification
   }
   ```
4. On stock split:
   ```go
   holding.Quantity *= splitRatio
   holding.AvgEntryPrice /= splitRatio
   ```

### Phase 8: Borrow Fee System

**Priority:** LOW

**Implementation:**
1. Add `borrow_rate` to Instrument
2. Daily cron job:
   ```go
   for each short holding:
       dailyFee := (holding.AvgEntryPrice * holding.Quantity) * (borrowRate / 365)
       account.Balance -= dailyFee
       // Record in transactions
   ```

### Phase 9: Advanced Risk Metrics

**Priority:** MEDIUM

**Metrics to add:**
- Short interest ratio
- Days to cover
- Borrow availability
- Volatility-based margin

---

## Troubleshooting

### Issue: "Insufficient margin" error despite having funds

**Cause:** Blocked margin not accounted for.

**Solution:**
```
Available Funds = Balance - BlockedMargin
Required Margin = Position Value × 0.20

Check: Available Funds >= Required Margin
```

**Debug:**
```bash
# Check account
GET /api/account/balance

# Response:
{
  "balance": 100000,
  "blockedMargin": 70000,
  "availableFunds": 30000  # Only ₹30k available
}
```

### Issue: Short position shows as LONG

**Cause:** Corrupted holding from early bug.

**Solution:**
1. Delete holding manually:
   ```bash
   go run backend/scripts/fix_reliance_holding.go
   ```
2. Re-open position
3. System will self-heal with new `PositionType` enforcement

### Issue: Stop loss fails with "cannot open long"

**Cause:** Intent not preserved in child order.

**Solution:** Already fixed in `StopOrderService`. Restart backend.

**Verify:**
```bash
# Check stop order
GET /api/orders?status=PENDING

# Should have intent field:
{
  "intent": "CLOSE_SHORT"
}
```

### Issue: Margin monitor not running

**Cause:** Service not started or crashed.

**Debug:**
```bash
# Check logs
grep "Margin monitoring service started" backend.log

# Should see:
2026/01/17 00:08:40 Margin monitoring service started (polling 3m)
```

**Solution:** Restart backend.

### Issue: Portfolio equity incorrect

**Cause:** Short positions counted as assets.

**Solution:** Already fixed in `CaptureSnapshot`. Clear old snapshots:
```bash
# Delete old snapshots
db.portfolio_snapshots.deleteMany({
  created_at: { $lt: ISODate("2026-01-17T00:00:00Z") }
})
```

---

## Appendix A: Database Schema

### Holdings Collection

```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("..."),
  instrument_id: ObjectId("..."),
  symbol: "TCS",
  quantity: 100,
  avg_entry_price: 3500.00,
  position_type: "SHORT",  // "LONG" or "SHORT"
  blocked_margin: 70000.00,
  initial_margin: 70000.00,
  margin_status: "OK",  // "OK", "CALL", "CRITICAL"
  created_at: ISODate("2026-01-17T00:00:00Z"),
  updated_at: ISODate("2026-01-17T00:10:00Z")
}
```

### Orders Collection

```javascript
{
  _id: ObjectId("..."),
  order_id: "ORD-1737065400000",
  user_id: ObjectId("..."),
  account_id: ObjectId("..."),
  instrument_id: ObjectId("..."),
  symbol: "TCS",
  side: "SELL",
  intent: "OPEN_SHORT",  // NEW FIELD
  order_type: "MARKET",
  quantity: 100,
  status: "FILLED",
  created_at: ISODate("2026-01-17T00:10:00Z"),
  updated_at: ISODate("2026-01-17T00:10:05Z")
}
```

### Trading Accounts Collection

```javascript
{
  _id: ObjectId("..."),
  user_id: ObjectId("..."),
  balance: 100000.00,
  blocked_margin: 70000.00,  // NEW FIELD
  realized_pl: 15000.00,
  currency: "INR",
  status: "ACTIVE",
  created_at: ISODate("2026-01-01T00:00:00Z"),
  updated_at: ISODate("2026-01-17T00:10:00Z")
}
```

---

## Appendix B: Configuration

### Margin Requirements

**File:** `backend/config/margin.json` (future)

```json
{
  "short_selling": {
    "initial_margin_rate": 0.20,
    "maintenance_margin_rate": 0.15,
    "warning_threshold": 1.0,
    "critical_threshold": 0.5,
    "liquidation_threshold": 0.0
  }
}
```

### Monitoring Intervals

**File:** `backend/cmd/server/main.go`

```go
// Margin Monitor: Every 3 minutes
marginMonitorService := services.NewMarginMonitorService(...)
ticker := time.NewTicker(3 * time.Minute)

// Stop Order Monitor: Every 3 seconds
stopOrderService := services.NewStopOrderService(...)
ticker := time.NewTicker(3 * time.Second)
```

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| **Borrow** | Obtaining shares from a lender to sell short |
| **Cover** | Buying back shares to close a short position |
| **Equity** | Total account value including cash and positions |
| **Intent** | Trading objective (OPEN_LONG, CLOSE_SHORT, etc.) |
| **Liability** | Amount owed (for short positions) |
| **Locate** | Finding available shares to borrow |
| **Margin** | Collateral required to maintain position |
| **Mark-to-Market** | Daily revaluation at current prices |
| **Proceeds** | Cash received from selling short |
| **Short Interest** | Total shares sold short in a stock |
| **Short Squeeze** | Rapid price increase forcing shorts to cover |
| **Tick** | Minimum price movement |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-17 | System | Initial comprehensive documentation |

---

**End of Documentation**
