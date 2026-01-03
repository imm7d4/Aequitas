# US-1.1.1 - Instrument Master Data

**Epic:** EPIC 1.1 - Market & Instrument Foundation  
**Phase:** Phase 1 - Market & Instrument Setup  
**Status:** Completed

## User Story

As an **admin**  
I want to **define tradable instruments**  
So that **users can search and trade stocks**

## Acceptance Criteria

- [x] Create instrument with symbol, name, ISIN, exchange
- [x] Instrument type (STOCK, ETF, BOND, etc.)
- [x] Trading status (ACTIVE, SUSPENDED, DELISTED)
- [x] Lot size and tick size configuration
- [x] Instrument search by symbol or ISIN
- [x] List all active instruments
- [x] Update instrument details
- [x] Deactivate/suspend instrument
- [x] **New:** Toggle between Grid and List views
- [x] **New:** Advanced filtering by Exchange, Type, and Sector
- [x] **New:** State persistence for list view, filters, and search query across navigation
- [x] **New:** Global reset for all filters and search query
- [x] **New:** Client-side pagination (25, 50, 75, 100) with sticky bottom controls
- [x] **New:** Admin management of Market Holidays (View/Delete)
- [x] **New:** Dynamic status management in Admin instrument forms

## Technical Requirements

### Backend (Go + MongoDB)

**Model/Schema:**
```go
type Instrument struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Symbol       string             `bson:"symbol" json:"symbol"`           // e.g., "RELIANCE"
    Name         string             `bson:"name" json:"name"`               // e.g., "Reliance Industries Ltd"
    ISIN         string             `bson:"isin" json:"isin"`               // e.g., "INE002A01018"
    Exchange     string             `bson:"exchange" json:"exchange"`       // e.g., "NSE", "BSE"
    Type         string             `bson:"type" json:"type"`               // STOCK, ETF, BOND
    Sector       string             `bson:"sector" json:"sector"`           // e.g., "Energy"
    LotSize      int                `bson:"lot_size" json:"lotSize"`        // Minimum tradable quantity
    TickSize     float64            `bson:"tick_size" json:"tickSize"`      // Minimum price movement (e.g., 0.05)
    Status       string             `bson:"status" json:"status"`           // ACTIVE, SUSPENDED, DELISTED
    ListingDate  time.Time          `bson:"listing_date" json:"listingDate"`
    CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt    time.Time          `bson:"updated_at" json:"updatedAt"`
}
```

**API Endpoints:**
- `POST /api/admin/instruments` - Create instrument (admin only)
- `GET /api/instruments` - List all active instruments
- `GET /api/instruments/:id` - Get instrument by ID
- `GET /api/instruments/search?q=symbol` - Search by symbol or ISIN
- `PUT /api/admin/instruments/:id` - Update instrument (admin only)
- `DELETE /api/admin/instruments/:id` - Deactivate instrument (admin only)

**Business Logic (InstrumentService):**
- Validate symbol uniqueness per exchange
- Validate ISIN format (12 characters, alphanumeric)
- Validate lot size > 0
- Validate tick size > 0
- Search by symbol (case-insensitive) or ISIN
- Only return ACTIVE instruments for trading

**Validation Rules:**
- Symbol required, max 20 characters
- Name required, max 200 characters
- ISIN required, exactly 12 characters
- Exchange required (NSE, BSE)
- Type required (STOCK, ETF, BOND, MUTUAL_FUND)
- Lot size minimum 1
- Tick size minimum 0.01
- Status required (ACTIVE, SUSPENDED, DELISTED)

### Frontend (TypeScript + React)

**Components:**
- `InstrumentList.tsx` - Display list of instruments (50-150 lines)
- `InstrumentSearch.tsx` - Search bar for instruments (50-100 lines)
- `InstrumentCard.tsx` - Display instrument details (50-100 lines)
- `AdminInstrumentForm.tsx` - Create/edit instrument (admin) (100-150 lines)

**Hooks:**
- `useInstruments.ts` - Fetch and manage instruments (< 200 lines)
  - List instruments
  - Search instruments
  - Filter by exchange/type
  - Pagination support

**Services:**
- `instrumentService.ts` - API integration
  - `getInstruments(): Promise<Instrument[]>`
  - `searchInstruments(query: string): Promise<Instrument[]>`
  - `getInstrumentById(id: string): Promise<Instrument>`
  - `createInstrument(data: CreateInstrumentRequest): Promise<Instrument>` (admin)
  - `updateInstrument(id: string, data: UpdateInstrumentRequest): Promise<Instrument>` (admin)

**Types:**
```typescript
export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  isin: string;
  exchange: 'NSE' | 'BSE';
  type: 'STOCK' | 'ETF' | 'BOND' | 'MUTUAL_FUND';
  sector: string;
  lotSize: number;
  tickSize: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELISTED';
  listingDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInstrumentRequest {
  symbol: string;
  name: string;
  isin: string;
  exchange: string;
  type: string;
  sector: string;
  lotSize: number;
  tickSize: number;
}
```

**State Management (Zustand):**
- Global state for instrument list (cache)
- Search results state
- Selected instrument state
- **New:** `viewMode` (grid/list)
- **New:** `filters` (exchange, type, sector)
- **New:** `searchQuery` (persisted search term)
- **New:** `pagination` (page, rowsPerPage)

## Dependencies

**Upstream:**
- US-0.1.3 (Authentication) - Admin role required for instrument management

**Downstream:**
- US-1.1.2 (Market Hours) - Instruments need market hours
- US-3.1.1 (Place Order) - Orders reference instruments
- US-7.1.1 (Order Book) - Order book per instrument

## Implementation Notes

### Business Rules
- **Symbol Uniqueness**: Symbol must be unique per exchange (NSE:RELIANCE ≠ BSE:RELIANCE)
- **ISIN Format**: 2-letter country code + 9-digit NSIN + 1 check digit
- **Lot Size**: NSE typically uses lot size of 1 for stocks
- **Tick Size**: NSE uses ₹0.05 for stocks priced ≥ ₹1

### Edge Cases
- Duplicate symbol on same exchange
- Invalid ISIN format
- Instrument suspended during active trading
- Search with special characters
- Empty search results

### Performance Considerations
- Index on symbol, ISIN, exchange for fast search
- Cache active instruments list
- Pagination for large instrument lists

### Error Messages
- "Symbol already exists on this exchange"
- "Invalid ISIN format"
- "Instrument not found"
- "Lot size must be at least 1"

## Testing Requirements

### Backend Unit Tests
- [ ] Valid instrument creation succeeds
- [ ] Duplicate symbol on same exchange returns error
- [ ] Invalid ISIN format returns error
- [ ] Search by symbol returns correct results
- [ ] Search by ISIN returns correct results
- [ ] Only ACTIVE instruments returned for trading

### Backend Integration Tests
- [ ] POST /api/admin/instruments creates instrument
- [ ] GET /api/instruments returns active instruments
- [ ] GET /api/instruments/search finds by symbol
- [ ] PUT /api/admin/instruments/:id updates instrument
- [ ] DELETE /api/admin/instruments/:id deactivates instrument

### Frontend Unit Tests
- [ ] InstrumentSearch filters results
- [ ] InstrumentList displays instruments
- [ ] AdminInstrumentForm validates inputs

### E2E Tests
- [ ] Admin can create new instrument
- [ ] User can search for instruments
- [ ] User can view instrument details
- [ ] Admin can update instrument

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-02 | AI Assistant | Initial creation |
| 2026-01-03 | AI Assistant | Added Grid/List toggle, advanced filtering, and state persistence |
| 2026-01-03 | AI Assistant | Implemented client-side pagination with sticky bottom controls |
