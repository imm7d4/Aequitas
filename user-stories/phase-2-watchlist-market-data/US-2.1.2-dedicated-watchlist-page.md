# US-2.1.2 - Dedicated Watchlist Page (Core)

**Epic:** Watchlist & Market Data  
**Phase:** Phase 2 - Watchlist & Market Data  
**Status:** Completed  
**Priority:** High  
**Complexity:** Medium

## User Story

As a **trader**  
I want to **access my watchlists from a dedicated page**  
So that I can **efficiently manage and monitor my favorite instruments without cluttering the Dashboard**.

---

## Acceptance Criteria

### 1. Dedicated Watchlist Page

**Route & Navigation:**
- [ ] New page accessible at `/watchlists` route
- [ ] Sidebar "Watchlists" menu item navigates to the page
- [ ] Sidebar highlights "Watchlists" when on the page
- [ ] Page has proper title: "My Watchlists"
- [ ] Page has descriptive subtitle

**Core Components:**
- [ ] `WatchlistManager` component displays at the top (tabs)
- [ ] `WatchlistTable` component displays below tabs
- [ ] Real-time price updates work
- [ ] All existing watchlist features work (create, delete, set default, add/remove)

---

### 2. Dashboard Simplification

**Watchlist Preview:**
- [ ] Dashboard shows compact preview of default watchlist
- [ ] Preview displays **top 5 instruments** only
- [ ] Preview shows: Symbol, LTP, Change %
- [ ] "View All →" button navigates to `/watchlists`
- [ ] Clicking instrument navigates to detail page
- [ ] Real-time price updates work in preview

---

### 3. Search & Sort

**Toolbar:**
- [ ] Search bar to filter instruments by symbol or name
- [ ] Sort dropdown: Symbol, Price, Change %, Volume
- [ ] "Quick Add" button to add instruments

**Search:**
- [ ] Search filters in real-time
- [ ] Case-insensitive
- [ ] Shows "No results found" when empty

**Sorting:**
- [ ] Sort persists when switching watchlists
- [ ] Default sort: Symbol (A-Z)
- [ ] Sort indicator shows direction (↑/↓)

---

### 4. Empty States

**No Watchlists:**
- [ ] Friendly message with CTA to create first watchlist

**Empty Watchlist:**
- [ ] Message with CTA to add instruments

---

### 5. Loading & Error States

- [ ] Skeleton loaders for tabs and table
- [ ] Error messages with retry button
- [ ] Toast notifications for operations

---

## Technical Requirements

### Frontend Components

**New:**
- `WatchlistPage.tsx` - Main page
- `WatchlistToolbar.tsx` - Search, sort, quick add
- `WatchlistPreview.tsx` - Dashboard preview

**Modified:**
- `Dashboard.tsx` - Replace full watchlist with preview
- `router.tsx` - Add `/watchlists` route

### No Backend Changes Required

---

## Implementation

### Phase 1: Core Migration (2-3 hours)
1. Create `WatchlistPage.tsx`
2. Add route to `router.tsx`
3. Create `WatchlistPreview.tsx`
4. Update Dashboard

### Phase 2: Search & Sort (2-3 hours)
1. Create `WatchlistToolbar.tsx`
2. Implement search
3. Implement sort
4. Add quick add button

### Phase 3: Polish (2-3 hours)
1. Empty states
2. Loading states
3. Error handling
4. Responsive design
5. Testing

**Total: 6-9 hours**

---

## Dependencies

- ✅ US-2.1.1: Watchlists
- ✅ US-2.2.1: Market Data Feed

**Enables:**
- US-2.1.3: Advanced Watchlist Features

---

## Success Metrics

- [ ] `/watchlists` route accessible
- [ ] Dashboard loads faster
- [ ] Search works in < 2 seconds
- [ ] Sort is instant (< 100ms)
- [ ] Real-time updates work on both pages

---

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-11 | AI Assistant | Split from US-2.1.2, focused on core features |
