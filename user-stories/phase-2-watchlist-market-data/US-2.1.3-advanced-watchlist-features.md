# US-2.1.3 - Advanced Watchlist Features

**Epic:** Watchlist & Market Data  
**Phase:** Phase 2 - Watchlist & Market Data  
**Status:** Completed  
**Priority:** Medium  
**Complexity:** High

## User Story

As a **professional trader**  
I want **advanced watchlist features like inline actions, column customization, and grouping**  
So that I can **work efficiently without leaving the watchlist and customize my view**.

---

## Acceptance Criteria

### 1. Inline Actions (Row Hover)

**Quick Actions:**
- [x] Hover reveals: Buy, Sell, Chart, Delete buttons
- [x] Actions don't affect table layout
- [x] Clicking opens appropriate dialog/page

**Keyboard Shortcuts:**
- [x] Arrow keys to select row
- [x] **B** → Buy, **S** → Sell, **C** → Chart
- [x] **Enter** → Navigate to detail
- [x] Visual indicator for selected row

---

### 2. Real-Time Price Highlighting

**Price Change Animation:**
- [x] Green flash when price increases
- [x] Red flash when price decreases
- [x] Fade after ~700ms
- [x] Cell-level update only (no full row re-render)

**Change % Highlighting:**
- [x] Green with ↑ for positive
- [x] Red with ↓ for negative
- [x] Gray with — for zero

---

### 3. Column Customization

**Customizable Columns:**
- [x] "⚙ Columns" button in toolbar
- [x] Toggle: Symbol, Name, LTP, Volume (Change % integrated with Price)
- [ ] Drag-and-drop to reorder (basic reordering implemented)
- [x] Persist to localStorage
- [x] "Reset to Default" button

---

### 4. Context Menu (Right-Click)

**Right-Click Actions:**
- [x] Buy, Sell, Open Chart, Add Alert, Remove from Watchlist
- [x] Works on full page
- [x] No confirmation for remove (direct action)
- [x] Menu closes on ESC or click outside

---

### 5. Pin / Star Instruments

**Pinning:**
- [x] ⭐ Star icon (always visible in Symbol column)
- [x] Pinned section at top (always above sort)
- [x] Filled star (★) for pinned, outline (☆) for unpinned
- [x] Persist across sessions (global per user email)
- [x] Global pin state (not per-watchlist)
- [x] Unlimited pins (no max limit)

**Visual:**
- [x] Pinned section with header: "⭐ Pinned (N)"
- [x] Separator line
- [x] Subtle background color

---

### 6. Grouping

**Group By:**
- [x] Sector, Exchange, Instrument Type
- [x] Expand/collapse groups
- [x] Group headers show: count, avg change %, total volume
- [x] Persist state to localStorage
- [ ] "Expand All" / "Collapse All" buttons (individual toggle only)

**UX:**
- [x] Distinct header styling
- [x] No indentation (flat within groups)
- [x] Sorting works within groups
- [x] Search works across groups

---

## Technical Requirements

### Frontend Components

**New:**
- `InlineActions.tsx` - Row hover actions
- `ColumnSettings.tsx` - Column customization dialog
- `ContextMenu.tsx` - Right-click menu
- `GroupHeader.tsx` - Group header component

**Modified:**
- `WatchlistTable.tsx` - Add all new features
- `WatchlistToolbar.tsx` - Add grouping selector

### State Management

**Local State:**
```tsx
const [selectedRow, setSelectedRow] = useState<string | null>(null);
const [visibleColumns, setVisibleColumns] = useState<string[]>([...]);
const [columnOrder, setColumnOrder] = useState<string[]>([...]);
const [groupBy, setGroupBy] = useState<'sector' | 'exchange' | 'type' | null>(null);
const [pinnedInstruments, setPinnedInstruments] = useState<string[]>([]);
```

**Persistence:**
- localStorage for: columns, column order, group state, pins

---

## Implementation

### Phase 1: Inline Actions & Keyboard (3-4 hours)
1. Add hover actions
2. Implement keyboard shortcuts
3. Integrate with TradePanel

### Phase 2: Price Highlighting (2-3 hours)
1. Cell-level update logic
2. CSS animations
3. Performance optimization

### Phase 3: Column Customization (3-4 hours)
1. Column settings dialog
2. Toggle and reorder
3. Persist preferences

### Phase 4: Context Menu & Pin (3-4 hours)
1. Context menu component
2. Pin/star functionality
3. Pinned section

### Phase 5: Grouping (4-5 hours)
1. Group-by logic
2. Group headers
3. Expand/collapse

### Phase 6: Polish (2-3 hours)
1. Responsive design
2. Animations
3. Testing

**Total: 17-23 hours**

---

## Dependencies

**Required:**
- ✅ US-2.1.2: Dedicated Watchlist Page (Core)

---

## Success Metrics

- [ ] Inline actions work smoothly
- [ ] Price highlighting has no performance impact
- [ ] Column customization persists correctly
- [ ] Grouping works with search/sort
- [ ] Pinned instruments always stay at top

---

## Future Enhancements

- Card/Grid view
- Bulk actions
- CSV export
- Watchlist analytics
- Heatmap view

---

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-11 | AI Assistant | Split from US-2.1.2, focused on advanced features |
