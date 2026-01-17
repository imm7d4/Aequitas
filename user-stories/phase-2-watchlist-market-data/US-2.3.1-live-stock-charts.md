# US-2.3.1 - Live Stock Price Charts

**Epic:** Market Data Visualization  
**Phase:** Phase 2 - Watchlist & Market Data  
**Status:** In Progress

## User Story

As a **trader**  
I want to **view real-time candlestick charts for stocks**  
So that **I can analyze price movements and make informed trading decisions**

## Acceptance Criteria

- [x] User can view live candlestick charts on instrument detail page
- [x] Charts update in real-time without page refresh
- [x] User can select different time intervals (1m, 5m, 15m, 1h, 1d)
- [x] Charts display OHLC (Open, High, Low, Close) data
- [x] Volume bars are displayed below the price chart
- [x] Historical data loads on initial chart view
- [x] Charts are responsive and work on different screen sizes
- [x] WebSocket connection auto-reconnects on disconnect
- [x] Charts handle missing data gracefully

## Technical Requirements

### Backend

**Models:**
- `Candle` model with fields:
  - `instrument_id` (ObjectId)
  - `interval` (string: "1m", "5m", "15m", "1h", "1d")
  - `time` (timestamp)
  - `open`, `high`, `low`, `close` (float64)
  - `volume` (int64)

**WebSocket Server:**
- WebSocket endpoint: `ws://localhost:8080/ws`
- Message types:
  - `subscribe`: Client subscribes to instrument
  - `unsubscribe`: Client unsubscribes from instrument
  - `candle`: Server broadcasts candle updates
- Connection pooling and cleanup
- Broadcast candle updates to subscribed clients only

**Candle Builder Service:**
- In-memory candle aggregation for all timeframes
- Update candles on each price tick from pricing engine
- Persist completed candles to MongoDB
- Support multiple intervals: 1m, 5m, 15m, 1h, 1d

**API Endpoints:**
- `GET /api/candles/:instrumentId?interval=1m&from=timestamp&to=timestamp`
  - Returns historical candles for chart initialization
  - Query parameters: interval, from (timestamp), to (timestamp)
  - Response: Array of Candle objects

**Repository:**
- `SaveCandle(candle *Candle)` - Persist completed candles
- `GetCandles(instrumentID, interval, from, to)` - Fetch historical candles
- MongoDB indexes: `{instrument_id: 1, interval: 1, time: -1}`

### Frontend

**Dependencies:**
- `lightweight-charts` - TradingView charting library
- Install: `npm install lightweight-charts`

**Components:**
- `StockChart.tsx` - Main chart component
  - Props: `instrumentId`, `defaultInterval`
  - Displays candlestick chart with volume
  - Time interval selector buttons
  - Loading and error states

**Services:**
- `websocketService.ts` - WebSocket client manager
  - Connect/disconnect methods
  - Subscribe/unsubscribe to instruments
  - Auto-reconnect on disconnect
  - Message routing to callbacks

- `candleService.ts` - REST API client
  - `getHistoricalCandles(instrumentId, interval, from, to)`
  - Returns Promise<Candle[]>

**Hooks:**
- `useStockChart(instrumentId, interval)` - Chart data management
  - Load historical candles on mount
  - Subscribe to WebSocket for live updates
  - Update chart data on new candles
  - Handle interval changes

**State Management:**
- Local component state for chart data
- WebSocket connection managed globally
- Candle data cached per instrument/interval

## Dependencies

- **US-2.2.1** - Market Data Feed (completed)
  - Pricing engine must be running
  - Market data must be available

- **External:**
  - MongoDB for candle storage
  - WebSocket support in browser
  - TradingView Lightweight Charts library

## Implementation Notes

### Architecture Decisions

1. **Server-side candle building**
   - Single candle builder for all users (not per-user)
   - Reduces memory and CPU usage
   - Ensures consistent candles across all clients

2. **WebSocket over polling**
   - Real-time updates without LTP polling
   - Lower server load
   - Better user experience

3. **Backend time authority**
   - Server controls candle timestamps
   - Prevents client time drift issues
   - Ensures data consistency

4. **Selective persistence**
   - Only completed candles saved to MongoDB
   - Current candle kept in memory
   - Reduces database writes

### Edge Cases

- **WebSocket disconnect**: Auto-reconnect with exponential backoff
- **Missing candles**: Fill gaps with null or interpolate
- **Market closed**: Show last available candle
- **No historical data**: Display empty chart with message
- **Rapid interval changes**: Debounce and cancel pending requests

### Performance Considerations

- **WebSocket pooling**: Limit connections per user (1 connection, multiple subscriptions)
- **Candle caching**: Keep last 100 candles in memory per instrument/interval
- **Batch updates**: If multiple candles update simultaneously, batch broadcast
- **Compression**: Use WebSocket compression for large datasets
- **Rate limiting**: Prevent WebSocket spam (max 10 messages/second per client)

### Data Flow

```
Pricing Engine (3s tick)
    ↓
Candle Builder (in-memory)
    ↓
WebSocket Broadcast → Frontend Chart (real-time update)
    ↓
MongoDB (completed candles only)
```

## Testing Requirements

### Unit Tests

**Backend:**
- [ ] Candle builder correctly aggregates ticks into candles
- [ ] WebSocket message routing works correctly
- [ ] Candle repository saves and retrieves candles
- [ ] Multiple timeframes calculated correctly

**Frontend:**
- [ ] WebSocket service connects and subscribes
- [ ] Chart component renders with historical data
- [ ] Chart updates on new candle data
- [ ] Interval selector changes timeframe

### Integration Tests

- [ ] End-to-end: Price tick → Candle update → WebSocket → Chart update
- [ ] WebSocket reconnection after disconnect
- [ ] Historical candles load correctly via REST API
- [ ] Multiple clients receive same candle updates

### E2E Scenarios

1. **Happy Path:**
   - User opens instrument detail page
   - Chart loads with historical data
   - Chart updates in real-time as prices change
   - User changes interval, chart reloads with new timeframe

2. **Error Handling:**
   - WebSocket disconnects → Auto-reconnects → Chart resumes updates
   - No historical data → Chart shows empty state with message
   - API error → Error message displayed, retry option

3. **Performance:**
   - Chart handles 100+ candles smoothly
   - Multiple instruments can have charts open simultaneously
   - Interval changes are smooth without flickering

## Future Enhancements

- Technical indicators (MA, RSI, MACD, Bollinger Bands)
- Drawing tools (trendlines, support/resistance levels)
- Chart patterns detection (head & shoulders, triangles)
- Multiple chart layouts (compare instruments)
- Price alerts on chart levels
- Export chart as image or CSV
- Fullscreen mode
- Dark/light theme toggle

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-03 | AI Assistant | Initial creation |
| 2026-01-03 | AI Assistant | Implementation started |
