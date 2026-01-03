# US-2.2.1 - Market Data Feed

**Epic:** EPIC 2.2 - Real-time Market Data  
**Phase:** Phase 2 - Watchlist & Market Data  
**Status:** Completed

## User Story

As a **trader**  
I want to **see live price updates for instruments**  
So that I can **make informed trading decisions based on current market conditions**

## Acceptance Criteria

- [x] View Last Traded Price (LTP) for instruments
- [x] View daily absolute and percentage change
- [x] View trading volume (simulated)
- [x] Prices update periodically (every 3 seconds) without page refresh
- [x] Visual indicators for price movement (green for up, red for down)
- [x] Live data displayed on Dashboard, Watchlist, and Instrument Details pages
- [x] Optimized batch polling for multiple instruments

## Technical Requirements

### Backend (Go + MongoDB)

**Model/Schema:**
```go
type MarketData struct {
    InstrumentID primitive.ObjectID `bson:"instrument_id" json:"instrumentId"`
    LastPrice    float64           `json:"lastPrice"`
    PrevClose    float64           `json:"prevClose"`
    Open         float64           `json:"open"`
    High         float64           `json:"high"`
    Low          float64           `json:"low"`
    Volume       int64             `json:"volume"`
    UpdatedAt    time.Time         `json:"updatedAt"`
}
```

**API Endpoints:**
- `GET /api/market/data?ids=id1,id2` - Batch fetch latest prices for specific instruments
- `GET /api/market/data/:id` - Fetch latest price for a single instrument

**Price Simulation (PricingService):**
- Implement a background generator that updates prices for active instruments
- Simulate realistic price movements based on tick size
- Calculate daily change relative to `PrevClose`

### Frontend (TypeScript + React)

**Components:**
- `PriceDisplay.tsx` - Reusable component for price + color-coded change
- `MiniChart.tsx` - Simple sparkline visualization (optional)

**Hooks:**
- `useMarketData.tsx` - Custom hook for polling market data for a list of instruments

**State Management (Zustand):**
- Integrate prices into `instrumentStore` or a dedicated `marketDataStore`

## Dependencies

- US-1.1.1 (Instrument Master) - Market data is tied to instruments

## Implementation Notes

- **Real-time approach**: Initially use short-polling (3-5 seconds). Upgrade to WebSockets in a later phase if required for scale.
- **Simulation**: Since we don't have a real data provider, the `PricingService` will randomly fluctuate prices within a specific range starting from the seed price.

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
| 2026-01-03 | AI Assistant | Implemented Phase 2 market data features, PricingService simulation, and polling hook |
