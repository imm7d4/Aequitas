# US-4.1.5 - Stop Order UI Enhancements

**Epic:** Trading Engine  
**Phase:** Phase 4 - Order Management System  
**Status:** Completed  
**Priority:** High  
**Complexity:** Medium

## User Story

As a **trader**  
I want to **see comprehensive stop order details and real-time updates in an intuitive interface**  
So that I can **monitor my pending stop orders, track trailing stop adjustments, and make informed trading decisions**.

## Business Context

While the backend stop order functionality is complete and working, the current UI provides minimal visibility into stop order details. Traders need:
- **Clear visibility** of stop order configurations without expanding rows
- **Real-time updates** of trailing stop prices as they adjust
- **Visual indicators** showing stop price relative to current market price
- **Dedicated view** for pending stop orders separate from filled orders
- **Quick access** to stop order actions (cancel, modify)

Enhanced UI will improve trader confidence, reduce errors, and provide professional-grade order management experience.

## Current State Analysis

### What Exists
✅ OrderList component with expandable rows  
✅ Stop order details shown in expanded section  
✅ Live market price display for expanded orders  
✅ Basic stop order fields (stopPrice, limitPrice, trailAmount, etc.)  
✅ Status badges (NEW, PENDING, TRIGGERED, FILLED)  

### What's Missing
❌ Stop order details not visible in collapsed view  
❌ No real-time updates for trailing stop prices  
❌ No visual indicators for stop price vs market price  
❌ No dedicated pending orders tab/filter  
❌ Stop orders mixed with regular orders  
❌ No visual distinction for different stop order types  

## Acceptance Criteria

### 1. Enhanced Order List - Prominent Stop Details

**Main Table View (Collapsed):**
- [ ] Show stop price in the main table row (not just in expanded view)
- [ ] Display order type badge with distinct colors:
  - STOP: Orange badge
  - STOP_LIMIT: Purple badge
  - TRAILING_STOP: Blue badge with trailing icon
- [ ] Show current stop price for trailing stops (with live updates)
- [ ] Display distance from current market price (e.g., "-2.5%" or "+₹15")

**Visual Design:**
- [ ] Stop orders have subtle background tint to distinguish from regular orders
- [ ] Trailing stop orders show animated indicator when stop price updates
- [ ] Color-coded based on side: Green tint for BUY, Red tint for SELL

### 2. Real-Time Trailing Stop Updates

**Live Data Updates:**
- [ ] Trailing stop current price updates every 3 seconds (matching backend polling)
- [ ] Visual flash/pulse animation when stop price changes
- [ ] Show "last updated" timestamp for trailing stops
- [ ] Display highest/lowest price reached (for context)

**Update Indicators:**
- [ ] Green up arrow when stop price moves favorably (increases for SELL, decreases for BUY)
- [ ] Pulsing dot indicator showing "live monitoring active"
- [ ] Timestamp showing when last price update occurred

### 3. Stop Order Visualization

**Price Distance Indicator:**
- [ ] Visual bar/gauge showing stop price relative to current market price
- [ ] Color-coded zones:
  - Green zone: Safe (stop far from current price)
  - Yellow zone: Warning (stop within 2% of current price)
  - Red zone: Critical (stop within 0.5% - may trigger soon)
- [ ] Percentage and absolute distance displayed

**Stop Price Chart (Optional Enhancement):**
- [ ] Mini chart showing price movement and stop price line
- [ ] For trailing stops: Show how stop price has adjusted over time
- [ ] Visual indication of trigger threshold

### 4. Pending Orders Tab

**Tab Structure:**
- [ ] Add "Pending Orders" tab alongside existing order views
- [ ] Show only orders with status NEW or PENDING
- [ ] Default sort: Most urgent (closest to trigger) first
- [ ] Filter options:
  - All Pending
  - Stop Orders Only
  - Trailing Stops Only
  - By Instrument

**Pending Orders Features:**
- [ ] Bulk actions: Cancel multiple pending orders
- [ ] Quick modify: Adjust stop price inline without dialog
- [ ] Urgency indicators: Highlight orders close to triggering
- [ ] Group by instrument option

### 5. Enhanced Expandable Row

**Stop Order Configuration Section:**
- [ ] Larger, more prominent display of stop configuration
- [ ] Visual diagram showing:
  - Current market price (large, bold)
  - Stop price (with distance indicator)
  - Limit price (for STOP_LIMIT)
  - Trail amount (for TRAILING_STOP)
- [ ] Historical trail adjustments (last 5 updates)

**Trigger Information:**
- [ ] For triggered orders: Show trigger timestamp and price
- [ ] Show execution details (market order created, fill status)
- [ ] Link to resulting market/limit order

### 6. Order Type Badges & Icons

**Visual Hierarchy:**
- [ ] MARKET: Gray badge, no icon
- [ ] LIMIT: Blue badge, limit icon
- [ ] STOP: Orange badge, stop sign icon
- [ ] STOP_LIMIT: Purple badge, combined icon
- [ ] TRAILING_STOP: Gradient blue badge, trending icon with trail indicator

**Interactive Badges:**
- [ ] Hover shows tooltip with order type explanation
- [ ] Click badge to filter by that order type

### 7. Action Buttons Enhancement

**Contextual Actions:**
- [ ] For PENDING stop orders:
  - "Modify Stop Price" - Quick edit without full dialog
  - "Cancel" - Immediate cancellation with confirmation
  - "View Details" - Expand row
- [ ] For TRIGGERED orders:
  - "View Execution" - Jump to resulting order
  - "View Trigger Details" - Show trigger event info

**Bulk Actions:**
- [ ] Select multiple pending orders
- [ ] "Cancel All Selected"
- [ ] "Modify All Selected" (adjust all stop prices by %)

## Technical Requirements

### Frontend Components

#### 1. Enhanced OrderList Component

**New Props:**
```typescript
interface OrderListProps {
  orders: OrderResponse[];
  onCancel: (id: string) => void;
  onModify: (id: string, updates: Partial<OrderResponse>) => void;
  isLoading?: boolean;
  showStopDetails?: boolean; // Show stop details in main row
  highlightPending?: boolean; // Highlight pending orders
  autoRefresh?: boolean; // Enable real-time updates
}
```

**New State:**
```typescript
const [liveUpdates, setLiveUpdates] = useState<Map<string, number>>(new Map());
const [lastUpdateTime, setLastUpdateTime] = useState<Map<string, Date>>(new Map());
```

#### 2. New Components to Create

**StopPriceIndicator.tsx:**
```typescript
interface StopPriceIndicatorProps {
  currentPrice: number;
  stopPrice: number;
  side: 'BUY' | 'SELL';
  orderType: string;
}
```
- Visual bar showing distance from current price
- Color-coded zones (safe/warning/critical)
- Percentage and absolute distance

**TrailingStopMonitor.tsx:**
```typescript
interface TrailingStopMonitorProps {
  order: OrderResponse;
  currentPrice: number;
  onUpdate?: (newStopPrice: number) => void;
}
```
- Real-time display of current stop price
- Shows highest/lowest price reached
- Update animation when stop price changes
- Last updated timestamp

**PendingOrdersTab.tsx:**
```typescript
interface PendingOrdersTabProps {
  orders: OrderResponse[];
  onCancel: (id: string) => void;
  onModify: (id: string, updates: Partial<OrderResponse>) => void;
  onBulkCancel: (ids: string[]) => void;
}
```
- Dedicated view for pending orders
- Filtering and sorting options
- Bulk action support

**OrderTypeBadge.tsx:**
```typescript
interface OrderTypeBadgeProps {
  orderType: OrderType;
  status: string;
  onClick?: () => void;
  showTooltip?: boolean;
}
```
- Consistent badge styling
- Interactive with tooltips
- Click to filter

#### 3. Custom Hooks

**useTrailingStopUpdates.ts:**
```typescript
export const useTrailingStopUpdates = (orders: OrderResponse[]) => {
  // Poll backend for trailing stop orders
  // Return updated stop prices
  // Detect changes and trigger animations
}
```

**usePendingOrders.ts:**
```typescript
export const usePendingOrders = () => {
  // Fetch pending stop orders from /api/orders/pending-stops
  // Auto-refresh every 3 seconds
  // Return pending orders with real-time updates
}
```

### API Integration

**Existing Endpoints (Already Implemented):**
- ✅ `GET /api/orders/pending-stops` - Fetch pending stop orders
- ✅ `DELETE /api/orders/:id` - Cancel order
- ✅ `PUT /api/orders/:id` - Modify order

**No New Backend Changes Required** - All necessary APIs exist

### Real-Time Updates Strategy

**Polling Approach (Phase 1):**
1. For orders with `orderType = TRAILING_STOP` and `status = PENDING`:
   - Poll `GET /api/orders/pending-stops` every 3 seconds
   - Compare `currentStopPrice` with previous value
   - If changed, trigger update animation
   - Update last update timestamp

**WebSocket Approach (Future Enhancement):**
- Real-time push updates for trailing stop adjustments
- Sub-second latency for trigger events
- Deferred to Phase 5+

## UI/UX Design Specifications

### Color Palette

**Order Type Colors:**
- MARKET: `grey[600]`
- LIMIT: `blue[600]`
- STOP: `orange[600]`
- STOP_LIMIT: `purple[600]`
- TRAILING_STOP: Gradient `blue[400]` to `blue[700]`

**Status Colors:**
- NEW/PENDING: `warning.main` (orange)
- TRIGGERED: `info.main` (blue)
- FILLED: `success.main` (green)
- REJECTED: `error.main` (red)
- CANCELLED: `grey[500]`

**Distance Indicator Zones:**
- Safe (>5% away): `success.light`
- Warning (2-5% away): `warning.light`
- Critical (<2% away): `error.light`

### Typography

**Stop Price Display:**
- Font: `fontFamily: 'monospace'`
- Weight: `fontWeight: 700`
- Size: `variant: 'h6'` for main display, `'body2'` for secondary

**Distance Indicators:**
- Font: `fontFamily: 'Inter'`
- Weight: `fontWeight: 600`
- Size: `fontSize: '0.875rem'`

### Animations

**Trailing Stop Update:**
```typescript
const pulseAnimation = keyframes`
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
`;
```

**Live Indicator:**
```typescript
const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;
```

## Implementation Plan

### Phase 1: Enhanced Order List (2-3 hours)
1. Add stop price column to main table
2. Create OrderTypeBadge component
3. Add visual distinction for stop orders (background tint)
4. Show distance from market price

### Phase 2: Real-Time Updates (2-3 hours)
1. Create useTrailingStopUpdates hook
2. Implement polling logic (3-second interval)
3. Add update animations
4. Display last updated timestamp

### Phase 3: Visual Indicators (2-3 hours)
1. Create StopPriceIndicator component
2. Implement color-coded zones
3. Add distance calculations
4. Create TrailingStopMonitor component

### Phase 4: Pending Orders Tab (3-4 hours)
1. Create PendingOrdersTab component
2. Add tab navigation
3. Implement filtering and sorting
4. Add bulk actions

### Phase 5: Polish & Testing (2-3 hours)
1. Refine animations
2. Add tooltips and help text
3. Test with various order types
4. Performance optimization

**Total Estimated Time: 11-16 hours**

## Success Metrics

- [ ] Stop order details visible without expanding rows (100% of stop orders)
- [ ] Trailing stop prices update within 5 seconds of backend change
- [ ] Users can identify pending stop orders at a glance (measured by time to find)
- [ ] Pending orders tab shows only relevant orders (0% regular orders shown)
- [ ] Visual indicators accurately reflect urgency (tested with various price scenarios)
- [ ] No performance degradation with 50+ orders displayed

## Dependencies

### Required
- ✅ OrderList component exists
- ✅ useMarketData hook for live prices
- ✅ Backend API endpoints for pending orders
- ✅ Stop order fields in OrderResponse interface

### Optional
- Enhanced with WebSocket support (future)
- Integration with notifications (future)

## Non-Goals (Out of Scope)

- ❌ WebSocket real-time updates (using polling for now)
- ❌ Historical chart of trailing stop adjustments (future enhancement)
- ❌ Email/SMS notifications on trigger (separate user story)
- ❌ Advanced analytics (trigger accuracy, slippage analysis)
- ❌ Mobile-specific UI (focus on desktop first)

## Testing Strategy

### Manual Testing Scenarios

1. **Stop Order Display:**
   - Place STOP, STOP_LIMIT, and TRAILING_STOP orders
   - Verify all details visible in main table
   - Check color coding and badges

2. **Real-Time Updates:**
   - Place SELL TRAILING_STOP
   - Watch price rise
   - Verify stop price updates in UI
   - Check update animation triggers

3. **Visual Indicators:**
   - Place stop order close to market price
   - Verify warning/critical zone indicators
   - Check distance calculations

4. **Pending Orders Tab:**
   - Navigate to Pending Orders tab
   - Verify only pending orders shown
   - Test filtering and sorting
   - Test bulk cancel

5. **Performance:**
   - Load 50+ orders
   - Verify smooth scrolling
   - Check update performance with multiple trailing stops

## Future Enhancements

1. **WebSocket Integration** - Real-time push updates
2. **Historical Trail Chart** - Visualize stop price adjustments over time
3. **Smart Alerts** - Notify when stop order close to triggering
4. **Advanced Filters** - Filter by distance from trigger, time to trigger
5. **Batch Modify** - Adjust multiple stop prices by percentage
6. **Stop Order Templates** - Save common stop configurations

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-06 | AI Assistant | Initial creation based on requirements gathering |
