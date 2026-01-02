# US-1.1.2 - Market Hours & Trading Sessions

**Epic:** EPIC 1.1 - Market & Instrument Foundation  
**Phase:** Phase 1 - Market & Instrument Setup  
**Status:** Completed

## User Story

As a **system**  
I want to **enforce market trading hours**  
So that **orders are only accepted during active trading sessions**

## Acceptance Criteria

- [x] Define market hours per exchange (NSE, BSE)
- [x] Pre-market, regular market, and post-market sessions
- [x] Market holidays calendar
- [x] Check if market is currently open
- [x] Rejection of orders outside trading hours
- [x] Display market status to users (OPEN, CLOSED, PRE_MARKET, POST_MARKET)
- [x] **New:** Admin dashboard for listing and deleting market holidays
- [x] **New:** Filtering of holiday grid by Month and Exchange
- [x] **New:** Option to clear all holiday filters

## Technical Requirements

### Backend (Go + MongoDB)

**Model/Schema:**
```go
type MarketHours struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Exchange     string             `bson:"exchange" json:"exchange"`       // NSE, BSE
    DayOfWeek    int                `bson:"day_of_week" json:"dayOfWeek"`   // 1=Monday, 7=Sunday
    PreMarketStart   string         `bson:"pre_market_start" json:"preMarketStart"`     // "09:00"
    PreMarketEnd     string         `bson:"pre_market_end" json:"preMarketEnd"`         // "09:15"
    MarketOpen       string         `bson:"market_open" json:"marketOpen"`              // "09:15"
    MarketClose      string         `bson:"market_close" json:"marketClose"`            // "15:30"
    PostMarketStart  string         `bson:"post_market_start" json:"postMarketStart"`   // "15:30"
    PostMarketEnd    string         `bson:"post_market_end" json:"postMarketEnd"`       // "16:00"
    IsHoliday    bool               `bson:"is_holiday" json:"isHoliday"`
    CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt    time.Time          `bson:"updated_at" json:"updatedAt"`
}

type MarketHoliday struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Exchange     string             `bson:"exchange" json:"exchange"`
    Date         time.Time          `bson:"date" json:"date"`
    Name         string             `bson:"name" json:"name"`               // "Republic Day"
    CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
}

type MarketStatus struct {
    Exchange     string    `json:"exchange"`
    Status       string    `json:"status"`        // OPEN, CLOSED, PRE_MARKET, POST_MARKET
    CurrentTime  time.Time `json:"currentTime"`
    NextOpen     time.Time `json:"nextOpen"`
    NextClose    time.Time `json:"nextClose"`
}
```

**API Endpoints:**
- `GET /api/market/status/:exchange` - Get current market status
- `GET /api/market/hours/:exchange` - Get market hours for exchange
- `GET /api/market/holidays/:exchange` - Get market holidays
- `POST /api/admin/market/hours` - Create/update market hours (admin)
- `POST /api/admin/market/holidays` - Add market holiday (admin)

**Business Logic (MarketService):**
- `IsMarketOpen(exchange string) (bool, MarketStatus)`
  - Check current time against market hours
  - Check if today is a holiday
  - Check day of week (markets closed on weekends)
  - Return market status
- `GetMarketStatus(exchange string) MarketStatus`
- `ValidateTradingTime(exchange string) error`
  - Return error if market is closed

**Validation Rules:**
- Exchange required (NSE, BSE)
- Time format HH:MM (24-hour)
- Market open < Market close
- Pre-market end = Market open
- Post-market start = Market close

**NSE Default Hours (IST):**
- Pre-market: 09:00 - 09:15
- Regular market: 09:15 - 15:30
- Post-market: 15:30 - 16:00
- Closed: Saturday, Sunday, and holidays

### Frontend (TypeScript + React)

**Components:**
- `MarketStatusBadge.tsx` - Display market status (50-100 lines)
  - Green badge: OPEN
  - Red badge: CLOSED
  - Yellow badge: PRE_MARKET / POST_MARKET
- `MarketHoursCard.tsx` - Display market hours (50-100 lines)
- `MarketHolidayCalendar.tsx` - Display holidays (100-150 lines)

**Hooks:**
- `useMarketStatus.ts` - Fetch and poll market status (< 200 lines)
  - Poll every 60 seconds
  - Update market status in real-time
  - Notify when market opens/closes

**Services:**
- `marketService.ts` - API integration
  - `getMarketStatus(exchange: string): Promise<MarketStatus>`
  - `getMarketHours(exchange: string): Promise<MarketHours>`
  - `getMarketHolidays(exchange: string): Promise<MarketHoliday[]>`

**Types:**
```typescript
export interface MarketStatus {
  exchange: 'NSE' | 'BSE';
  status: 'OPEN' | 'CLOSED' | 'PRE_MARKET' | 'POST_MARKET';
  currentTime: Date;
  nextOpen: Date;
  nextClose: Date;
}

export interface MarketHours {
  id: string;
  exchange: string;
  dayOfWeek: number;
  preMarketStart: string;
  preMarketEnd: string;
  marketOpen: string;
  marketClose: string;
  postMarketStart: string;
  postMarketEnd: string;
  isHoliday: boolean;
}

export interface MarketHoliday {
  id: string;
  exchange: string;
  date: Date;
  name: string;
}
```

**State Management:**
- Global market status (updated via polling)
- Display in header/navbar

## Dependencies

**Upstream:**
- US-1.1.1 (Instrument Master) - Instruments belong to exchanges

**Downstream:**
- US-3.1.1 (Place Order) - Orders validated against market hours
- US-5.1.1 (Matching Engine) - Only match during market hours

## Implementation Notes

### Business Rules
- **NSE Trading Hours**: 09:15 - 15:30 IST (Monday - Friday)
- **Weekends**: Markets closed on Saturday and Sunday
- **Holidays**: National holidays (Republic Day, Independence Day, Diwali, etc.)
- **Pre-market**: Orders can be placed but not executed
- **Post-market**: Closing auction session

### Edge Cases
- Order placed 1 second before market close
- Market holiday on a weekday
- Daylight saving time (not applicable to India)
- System time vs market time mismatch
- Network delay causing time discrepancy

### Performance Considerations
- Cache market hours in memory
- Poll market status every 60 seconds (not every second)
- Use server time, not client time

### Error Messages
- "Market is currently closed. Trading hours: 09:15 - 15:30 IST"
- "Market is closed for holiday: [Holiday Name]"
- "Orders can only be placed during market hours"

## Testing Requirements

### Backend Unit Tests
- [ ] IsMarketOpen returns true during trading hours
- [ ] IsMarketOpen returns false outside trading hours
- [ ] IsMarketOpen returns false on weekends
- [ ] IsMarketOpen returns false on holidays
- [ ] GetMarketStatus returns correct status

### Backend Integration Tests
- [ ] GET /api/market/status/:exchange returns status
- [ ] GET /api/market/hours/:exchange returns hours
- [ ] GET /api/market/holidays/:exchange returns holidays

### Frontend Unit Tests
- [ ] MarketStatusBadge displays correct color
- [ ] useMarketStatus polls every 60 seconds
- [ ] Market status updates in real-time

### E2E Tests
- [ ] Market status badge displays correctly
- [ ] Order placement blocked outside market hours
- [ ] Holiday calendar displays correctly

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-02 | AI Assistant | Initial creation |
| 2026-01-03 | AI Assistant | Added admin holiday management (list/delete/filter) |
