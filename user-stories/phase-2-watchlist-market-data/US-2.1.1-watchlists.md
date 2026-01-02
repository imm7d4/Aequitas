# US-2.1.1 - Watchlist Management

**Epic:** EPIC 2.1 - Watchlist & Market Discovery  
**Phase:** Phase 2 - Watchlist & Market Data  
**Status:** Not Started

## User Story

As a **trader**  
I want to **organize instruments into custom lists**  
So that I can **monitor specific stocks and assets efficiently**

## Acceptance Criteria

- [ ] Create multiple watchlists with custom names
- [ ] Add instruments to a watchlist (max 50 instruments per watchlist)
- [ ] Remove instruments from a watchlist
- [ ] Switch between different watchlists on the dashboard
- [ ] Delete a watchlist (prevent deletion of the only watchlist)
- [ ] List all instruments in the active watchlist with key metrics (Symbol, Name, Price, Change)
- [ ] Perspective: Dashboard should remember the last viewed watchlist

## Technical Requirements

### Backend (Go + MongoDB)

**Model/Schema:**
```go
type Watchlist struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
    Name         string             `bson:"name" json:"name"`
    Instruments  []primitive.ObjectID `bson:"instruments" json:"instruments"`
    IsDefault    bool               `bson:"is_default" json:"isDefault"`
    CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt    time.Time          `bson:"updated_at" json:"updatedAt"`
}
```

**API Endpoints:**
- `GET /api/watchlists` - Get all watchlists for current user
- `POST /api/watchlists` - Create a new watchlist
- `GET /api/watchlists/:id` - Get specific watchlist details (including instrument data)
- `PUT /api/watchlists/:id` - Update watchlist name or set as default
- `DELETE /api/watchlists/:id` - Delete watchlist
- `POST /api/watchlists/:id/instruments` - Add instrument to watchlist
- `DELETE /api/watchlists/:id/instruments/:instrumentId` - Remove instrument from watchlist

**Business Logic (WatchlistService):**
- Limit number of watchlists per user (e.g., 5)
- Validate instrument existence before adding
- Prevent duplicate instruments in the same watchlist
- Automatically set the first watchlist as default

### Frontend (TypeScript + React)

**Components:**
- `WatchlistManager.tsx` - Sidebar/Tab switcher for different watchlists
- `WatchlistTable.tsx` - Grid showing instruments in the active watchlist
- `AddtoWatchlistButton.tsx` - Action button found on instrument cards/search
- `CreateWatchlistModal.tsx` - Dialog for naming new watchlists

**State Management (Zustand):**
- `watchlistStore.ts`:
  - `watchlists`: Array of user watchlists
  - `activeWatchlistId`: Currently viewed watchlist
  - `activeWatchlistData`: Instruments and prices for the active list

## Dependencies

- US-1.1.1 (Instrument Master) - Watchlists reference instruments
- US-0.1.3 (Authentication) - Watchlists are user-specific

## Implementation Notes

- **Performance**: When fetching a watchlist, use MongoDB `$lookup` to join instrument data.
- **Empty State**: Provide a clear call to action if a user has no watchlists.

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
