# Aequitas - Retail Stock Trading Platform

A comprehensive stock trading platform built with Go (backend) and React + TypeScript (frontend).

## 🏗️ Architecture

### Backend (Go + MongoDB)
**Controller-Service-Repository (CSR) Pattern**

```
backend/
├── cmd/server/          # Entry point
├── internal/
│   ├── controllers/     # HTTP layer (< 100 lines)
│   ├── services/        # Business logic (< 300 lines)
│   ├── repositories/    # Data layer (< 200 lines)
│   ├── middleware/      # Auth, logging, CORS, error handling
│   ├── models/          # MongoDB schemas
│   └── utils/           # Helpers (< 100 lines)
```

### Frontend (React + TypeScript)
**Feature-First Architecture**

```
frontend/src/
├── features/            # Business features (auth, orders, wallet)
├── shared/              # Cross-feature components
├── ui/                  # Design system primitives
├── lib/                 # API client, storage
└── app/                 # App bootstrap, routing
```

## 🚀 Quick Start

### Prerequisites
- Go 1.21+
- Node.js 20+
- MongoDB 6.0+ (or Docker)

### 1. Start MongoDB
```bash
docker-compose up -d
```

### 2. Start Backend
```bash
cd backend
go mod download
go run cmd/server/main.go
```
Backend runs on `http://localhost:8080`

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## ✅ Phase 0 - Foundation (Completed)

### User Stories Implemented

#### US-0.1.1 - User Registration
- ✅ Email + password registration
- ✅ Password hashing (bcrypt)
- ✅ Email validation
- ✅ Unique user ID generation
- ✅ Account status = ACTIVE

#### US-0.1.2 - Trading Account Creation
- ✅ Automatic trading account creation on registration
- ✅ Default balance = 0
- ✅ Currency = INR
- ✅ One account per user

#### US-0.1.3 - Authentication & Session
- ✅ JWT-based authentication
- ✅ Token expiry (24 hours)
- ✅ Protected routes
- ✅ Auto-logout on token expiry
- ✅ Login/logout functionality
- ✅ Token persistence across page refreshes
- ✅ CORS properly configured for frontend-backend communication

#### US-0.2.1 - Global UI Shell
- ✅ Responsive Header & Sidebar
- ✅ Enterprise-Level Global Search (Autocomplete + Quick Trade)
- ✅ Real-time Market Status Badge & Server Clock
- ✅ Centralized Notification Center

#### US-0.2.2 - Observability & Analytics
- ✅ Unified Telemetry Service (Buffering + Batching)
- ✅ Real-time Performance Tracking (TTI, API Latency)
- ✅ User Interaction Analytics (anonymized search, navigation)
- ✅ Intelligent Correlation (ID per route lifecycle)
- ✅ Resilient Backend Persistence (MongoDB Store)

## ✅ Phase 1 - Market & Instrument Setup (Completed)

### User Stories Implemented

#### US-1.1.1 - Instrument Master Data
- ✅ Instrument model with symbol, name, ISIN, exchange, type, sector
- ✅ CRUD operations for instruments (Admin only for write)
- ✅ Search instruments by symbol, name, or ISIN
- ✅ Filter active instruments
- ✅ ISIN validation (Luhn algorithm)
- ✅ Seed script with top 100 NSE stocks

#### US-1.1.2 - Market Hours & Trading Sessions
- ✅ Market hours model for NSE/BSE
- ✅ Real-time market status (OPEN, CLOSED, PRE_MARKET, POST_MARKET)
- ✅ Market holidays calendar for 2026
- ✅ Trading session enforcement (Status badge)
- ✅ Seed script for NSE/BSE market hours and holidays

## 📊 Observability & Analytics

The platform features a production-grade observability suite that monitors system health and user experience without blocking the main UI thread.

- **Unified Telemetry**: Custom-built `telemetryService` on the frontend with event buffering and batching.
- **Performance Monitoring**: Real-time tracking of Time to Interactive (TTI) and API latency.
- **User Journey Tracing**: Automatic generation of `correlation_id` per route change, linking all subsequent events and API calls.
- **Resilient Persistence**: High-performance batch ingestion API on the backend storing events in MongoDB for future analytics and auditing.
- **Fail-Safe Design**: Telemetry failures never interrupt user interactions; fatal errors trigger immediate flushes.

## 📡 API Endpoints

All endpoints follow standardized response format:
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message"
}
```

## 📚 Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Coding Standards](./user-stories/README.md)
- [User Stories](./user-stories/)

## 🔐 Security

- Passwords hashed with bcrypt (cost factor 14)
- JWT tokens with configurable expiry
- Auto-generated secure JWT secret
- CORS enabled for frontend
- Protected routes with authentication middleware

## 🛠️ Tech Stack

### Backend
- Go 1.21+
- MongoDB
- Gorilla Mux (routing)
- JWT (authentication)
- bcrypt (password hashing)

### Frontend
- React 18
- TypeScript (strict mode)
- Material UI
- React Router
- Axios
- Zustand (state management)
- Vite

## ✅ Phase 2 - Watchlist & Market Data (Completed)

### User Stories Implemented

#### US-2.1.1 - Watchlists
- ✅ Create/manage custom watchlists
- ✅ Add/remove instruments
- ✅ Real-time price updates in watchlist

#### US-2.2.1 - Market Data Feed
- ✅ Real-time market data service
- ✅ Live price updates (simulated)
- ✅ Batch price fetching

#### US-2.3.1 - Live Stock Charts
- ✅ Interactive candlestick charts
- ✅ Real-time price line overlay
- ✅ Multiple timeframes
- ✅ Dynamic tab titles with price updates

---

## ✅ Phase 3 - User Profile & Personalization (Completed)

### User Stories Implemented

#### US-3.1.1 - Identity & Branding
- ✅ User profile management
- ✅ Personal branding

#### US-3.1.2 - Account Security
- ✅ Password management
- ✅ Security settings

#### US-3.1.3 - User Preferences
- ✅ Trading preferences
- ✅ UI customization

#### US-3.1.4 - Account Finances
- ✅ Account balance tracking
- ✅ Financial overview

---

## 🚧 Phase 4 - Order Management System (In Progress - 7/8 Complete)

### User Stories Implemented

#### US-4.1.1 - Order Placement ✅
- ✅ MARKET orders
- ✅ LIMIT orders
- ✅ Order validation
- ✅ TradePanel UI

#### US-4.1.2 - Order Management ✅
- ✅ Modify orders
- ✅ Cancel orders
- ✅ Order status tracking

#### US-4.1.3 - Order History ✅
- ✅ Order list with filters
- ✅ Order details
- ✅ Status badges

#### US-4.1.4 - Stop & Contingent Orders ✅
- ✅ Phase 1: Foundation (STOP/STOP_LIMIT/TRAILING_STOP)
- ✅ Phase 2: Trigger Monitoring (Background service)
- ✅ Trailing stop price adjustments
- ✅ Stop order execution

#### US-4.1.5 - Stop Order UI Enhancements ✅
- ✅ Phase 1: Enhanced Order List
  - OrderTypeBadge component
  - Stop Price column
  - Tab navigation (All/Pending/Executed/Cancelled/Rejected)
  - Distance indicators for trailing stops

### Pending
- ❌ US-4.1.5: Advanced Validity (GTC/IOC) & Margin Control

---

## 🎯 Phase 6 - Matching Engine (CRITICAL - Current Focus)

**Status:** Not Started (BLOCKS Phase 5)

### Why Critical?
Currently, orders are placed but **never execute**:
- Orders stuck in NEW/PENDING status forever
- No trades created
- No positions generated
- Portfolio & Holdings feature blocked

### US-6.1 - Order Matching & Execution Engine ❌

**Must Implement:**
- ✅ MARKET order instant execution
- ✅ LIMIT order price matching
- ✅ Trade record creation
- ✅ Order status updates (FILLED)
- ✅ Background limit order monitor
- ✅ Stop order integration

**Implementation Priority:** **HIGHEST** - Required before Phase 5

---

## 📋 Phase 5 - Portfolio Management (Blocked)

**Status:** Blocked by Phase 6

### US-5.1 - Portfolio Overview & Holdings ❌

**Blocked Because:**
- Requires order execution (Phase 6)
- Needs filled orders to create positions
- Can't calculate P&L without trades

**Planned Features:**
- Portfolio summary dashboard
- Holdings list with real-time P&L
- Position details & transaction history
- Quick trade actions from portfolio

---

## 📚 Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [User Stories](./user-stories/)
- [Coding Standards](./user-stories/README.md)

## 🔐 Security

- Passwords hashed with bcrypt (cost factor 14)
- JWT tokens with configurable expiry
- Auto-generated secure JWT secret
- CORS enabled for frontend
- Protected routes with authentication middleware

## 🛠️ Tech Stack

### Backend
- Go 1.21+
- MongoDB
- Gorilla Mux (routing)
- JWT (authentication)
- bcrypt (password hashing)

### Frontend
- React 18
- TypeScript (strict mode)
- Material UI
- React Router
- Axios
- Zustand (state management)
- Vite

## 📋 Current Status & Next Steps

### Completed Phases
- ✅ Phase 0: Foundation (6 user stories)
- ✅ Phase 1: Market & Instrument (2 user stories)
- ✅ Phase 2: Watchlist & Market Data (3 user stories)
- ✅ Phase 3: User Profile (4 user stories)
- 🚧 Phase 4: Order Management (7/8 user stories)

### Current Priority
**🎯 Phase 6: Order Matching & Execution Engine**
- Critical blocker for portfolio features
- Orders need to actually execute and fill
- Required for complete trading workflow

### Next After Phase 6
- Phase 5: Portfolio & Holdings Management
- Phase 4: Complete remaining (Validity & Margin Control)

## 📄 License

Proprietary
