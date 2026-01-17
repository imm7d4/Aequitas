# Aequitas User Stories

This directory contains all user stories for the Aequitas retail stock trading platform, organized by phase and epic for audit and feature tracking purposes.

## Structure

```
user-stories/
├── README.md (this file)
├── phase-0-foundation/
│   ├── US-0.1.1-user-registration.md
│   ├── US-0.1.2-trading-account-creation.md
│   ├── US-0.1.3-authentication-session.md
│   ├── US-0.2.1-global-ui-shell.md
│   ├── US-0.2.2-observability-analytics.md
│   ├── US-0.2.3-logo-branding.md
│   └── US-0.3.1-landing-page.md
├── phase-1-market-instrument/
│   ├── US-1.1.1-instrument-master-data.md
│   └── US-1.1.2-market-hours-trading-sessions.md
├── phase-2-watchlist-market-data/
│   ├── US-2.1.1-watchlists.md
│   ├── US-2.2.1-market-data-feed.md
│   └── US-2.3.1-live-stock-charts.md
├── phase-3-user-profile/
│   ├── US-3.1.1-identity-branding.md
│   ├── US-3.1.2-account-security.md
│   ├── US-3.1.3-user-preferences.md
│   └── US-3.1.4-account-finances.md
├── phase-4-order-management/
│   ├── US-4.1.1-order-placement.md
│   ├── US-4.1.2-order-management.md
│   ├── US-4.1.3-order-history.md
│   ├── US-4.1.4-edge-cases.md
│   ├── US-4.1.4-implementation-examples.md
│   ├── US-4.1.4-stop-contingent-orders.md
│   ├── US-4.1.5-stop-order-ui-enhancements.md
│   └── US-4.1.5-validity-margin-control.md
├── phase-5-portfolio-management/
│   └── US-5.1-portfolio-holdings.md
└── phase-6-matching-engine/
    └── US-6.1-order-matching-execution.md
```

## User Story Template

Each user story follows this format:

```markdown
# US-X.Y.Z - [Story Title]

**Epic:** [Epic Name]
**Phase:** [Phase Number and Name]
**Status:** [Not Started | In Progress | Completed | Blocked]

## User Story

As a [user type]
I want to [action]
So that [benefit]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Requirements

### Backend
- Model/Schema requirements
- API endpoints
- Business logic rules
- Validation rules

### Frontend
- UI components needed
- User interactions
- State management
- API integration

## Dependencies

- List of other user stories this depends on
- External dependencies

## Implementation Notes

- Technical considerations
- Edge cases to handle
- Performance considerations

## Testing Requirements

- Unit tests
- Integration tests
- E2E scenarios

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| YYYY-MM-DD | Name | Initial creation |
```

## Phase Overview

### Phase 0 - Foundation ✅
**Status:** Complete (7/7 complete)  
Core user and account management, authentication, and global UI shell.

**User Stories:**
- ✅ US-0.1.1: User Registration
- ✅ US-0.1.2: Trading Account Creation
- ✅ US-0.1.3: Authentication & Session Management
- ✅ US-0.2.1: Global UI Shell
- ✅ US-0.2.2: Observability & Analytics
- ✅ US-0.2.3: Logo & Branding
- ✅ US-0.3.1: Landing Page (Modern, Animated)

---

### Phase 1 - Market & Instrument Setup ✅
**Status:** Complete  
Define tradable instruments and market structure.

**User Stories:**
- US-1.1.1: Instrument Master Data
- US-1.1.2: Market Hours & Trading Sessions

---

### Phase 2 - Watchlist & Market Data ✅
**Status:** Complete (3/3 stories)  
Customizable watchlists and real-time (simulated) price updates.

**User Stories:**
- US-2.1.1: Watchlists
- US-2.1.2: Dedicated Watchlist Page (Core)
- US-2.1.3: Advanced Watchlist Features
- US-2.2.1: Market Data Feed
- US-2.3.1: Live Stock Charts

---

### Phase 3 - User Profile & Personalization ✅
**Status:** Complete  
Personal identity management, account security, and trading preferences.

**User Stories:**
- US-3.1.1: Identity & Branding
- US-3.1.2: Account Security
- US-3.1.3: User Preferences
- US-3.1.4: Account Finances

---

### Phase 4 - Order Management System (OMS) ✅
**Status:** Complete (8/8 complete)  
Order placement, modification, cancellation, and advanced order types.

**User Stories:**
- ✅ US-4.1.1: Order Placement (MARKET/LIMIT)
- ✅ US-4.1.2: Order Management (Modify/Cancel)
- ✅ US-4.1.3: Order History
- ✅ US-4.1.4: Stop & Contingent Orders (STOP/STOP_LIMIT/TRAILING_STOP)
  - ✅ Phase 1: Foundation & UI
  - ✅ Phase 2: Trigger Monitoring
- ✅ US-4.1.5: Stop Order UI Enhancements
  - ✅ Phase 1: Enhanced Order List, Tabs, Stop Price Column
- ✅ US-4.1.5: Advanced Validity (GTC/IOC) & Margin Control
- 📝 US-4.1.4: Edge Cases & Implementation Examples

---

### Phase 5 - Portfolio Management ✅
**Status:** Complete (1/1 complete)  
Position tracking, P&L calculation, and portfolio analytics.

**User Stories:**
- ✅ US-5.1: Portfolio Overview & Holdings Management

**Implemented Features:**
- Portfolio summary dashboard with real-time metrics
- Holdings list with live P&L tracking
- Position details & transaction history
- Equity curve analytics
- Real-time price updates and P&L calculation

---

### Phase 6 - Matching Engine (CORE) �
**Status:** Critical Priority  
Order matching and trade execution - **MUST DO BEFORE PHASE 5**

**User Stories:**
- ❌ US-6.1: Order Matching & Execution Engine

**Why Critical:**
- Orders currently never execute (stuck in NEW status)
- No trades = No positions = Portfolio feature blocked
- Required for complete trading workflow

**Features:**
- MARKET order instant execution
- LIMIT order price matching
- Trade record creation
- Order status updates (FILLED)
- Background limit order monitor

---

### Phase 7 - Settlement & Positions 📅
**Status:** Not Started  
Post-trade settlement and position management.

---

### Phase 8 - Order Book & Market Data 📅
**Status:** Not Started  
Market transparency and data feeds.

---

### Phase 9 - Short Positions 🚧
**Status:** In Progress (1/2 complete)  
Advanced position management for short selling and risk control.

**User Stories:**
- ✅ US-9.1: Short Selling Support (Backend/Frontend)
- 📋 US-9.2: Auto-Liquidation System

---

### Phase 10 - Reporting & Analytics �
**Status:** In Progress (0/1 complete)  
Detailed trade analysis, performance metrics, and historical reporting.

**User Stories:**
- 📋 US-10.1: Universal Trade Diagnostics

---

## Status Tracking

| Phase | Total Stories | Completed | In Progress | Not Started |
|-------|--------------|-----------|-------------|-------------|
| 0 - Foundation | 7 | 7 | 0 | 0 |
| 1 - Market & Instrument | 2 | 2 | 0 | 0 |
| 2 - Watchlist & Market Data | 5 | 5 | 0 | 0 |
| 3 - User Profile | 4 | 4 | 0 | 0 |
| 4 - Order Management | 8 | 8 | 0 | 0 |
| 5 - Portfolio Management | 1 | 1 | 0 | 0 |
| 6 - Matching Engine | 1 | 1 | 0 | 0 |
| 7 - Notifications | 1 | 1 | 0 | 0 |
| 8 - Advanced Features | 3 | 2 | 0 | 1 |
| 9 - Reporting & P&L | 0 | 0 | 0 | 0 |
| 10 - Audit & Admin | 0 | 0 | 0 | 0 |

---

## Recent Updates

**2026-01-15:**
- ✅ **MAJOR MILESTONE:** Verified ALL Phase 0-7 user stories complete (29/29)!
- ✅ Verified and marked complete: US-4.1.5 (Stop Order UI Enhancements)
- ✅ Verified and marked complete: US-8.1 (Position Display)
- ✅ Verified and marked complete: US-8.3 (Technical Indicators)
- � **Complete Platform:** Authentication, Market Data, Orders, Portfolio, Matching, Notifications
- 📊 **Phase 8:** 2/3 complete (Position Display, Technical Indicators)

**2026-01-11:**
- 📝 Created US-0.3.1: Landing Page (Modern, Animated)

**2026-01-06:**
- ✅ Completed US-4.1.4 Phase 2: Stop Order Trigger Monitoring
- ✅ Completed US-4.1.5 Phase 1: Stop Order UI Enhancements (OrderTypeBadge, Stop Price Column, Tab Navigation)
- 📝 Created US-5.1: Portfolio Overview & Holdings Management
- 📝 Created US-6.1: Order Matching & Execution Engine

**2026-01-05:**
- ✅ Completed US-4.1.4 Phase 1: Stop Order Foundation (STOP/STOP_LIMIT/TRAILING_STOP)

**2026-01-03:**
- ✅ Completed US-4.1.1, US-4.1.2, US-4.1.3: Basic Order Management

---

## Legend

- ✅ Complete
- 🚧 In Progress
- ❌ Not Started
- 📋 Planning
- 📅 Future
- 📝 Documentation
