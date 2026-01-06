# Aequitas Frontend

React + TypeScript frontend for Aequitas retail stock trading platform following **Feature-First Architecture**.

## 🏗️ Architecture

```
frontend/src/
├── features/              # Business features
│   ├── auth/             # Authentication
│   ├── trading/          # Orders, instruments, charts
│   ├── market/           # Market data, watchlists
│   └── profile/          # User profile
├── shared/               # Cross-feature components
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom hooks
│   └── types/            # Shared TypeScript types
├── ui/                   # Design system primitives
├── lib/                  # Low-level libraries
│   ├── api/              # API client (Axios)
│   └── storage/          # LocalStorage wrapper
└── app/                  # App bootstrap, routing
```

### Design Principles

- ❌ **Components MUST NOT call APIs**
- ❌ **Components MUST NOT contain business logic**
- ❌ **Hooks MUST NOT render JSX**
- ❌ **Services MUST NOT import React**
- ✅ **Hooks orchestrate services**
- ✅ **Services orchestrate API calls**
- ✅ **Components only render**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:8080/api
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend starts on `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

---

## ✅ Implemented Features

### Phase 0 - Foundation

#### Authentication (US-0.1.1, US-0.1.3)
- **Components:**
  - `LoginPage.tsx` - Login form with validation
  - `RegisterPage.tsx` - Registration form
  - `ProtectedRoute.tsx` - Route guard

- **Services:**
  - `authService.ts` - API calls for login/register
  
- **Hooks:**
  - `useAuth.ts` - Authentication state management
  
- **Store:**
  - `authStore.ts` - Zustand store for auth state

**Features:**
- JWT token-based authentication
- Token persistence across page refreshes
- Auto-redirect on authentication state change
- Loading states to prevent flash of login page
- Secure password validation

#### Global UI Shell (US-0.2.1)
- **Components:**
  - `Header.tsx` - Top navigation with search
  - `Sidebar.tsx` - Side navigation
  - `GlobalSearch.tsx` - Enterprise-level autocomplete search
  - `MarketStatusBadge.tsx` - Real-time market status
  - `NotificationCenter.tsx` - Centralized notifications

**Features:**
- Responsive layout
- Real-time market status updates
- Quick trade from search
- Server clock display

#### Observability (US-0.2.2)
- **Services:**
  - `telemetryService.ts` - Event buffering and batching

**Features:**
- Performance tracking (TTI, API latency)
- User interaction analytics
- Correlation ID per route lifecycle
- Resilient backend persistence

---

### Phase 1 - Market & Instrument

#### Instrument Master Data (US-1.1.1)
- **Components:**
  - `InstrumentList.tsx` - Grid/table view of instruments
  - `InstrumentCard.tsx` - Individual instrument display
  - `InstrumentDetail.tsx` - Detailed instrument page

- **Services:**
  - `instrumentService.ts` - Instrument API calls

- **Hooks:**
  - `useInstruments.ts` - Instrument data management

**Features:**
- Search by symbol, name, ISIN
- Filter by sector, exchange
- Debounced search (300ms)
- Grid and table views

#### Market Hours & Trading Sessions (US-1.1.2)
- **Services:**
  - `marketService.ts` - Market status API

- **Hooks:**
  - `useMarketStatus.ts` - Real-time market status

**Features:**
- Real-time market status (OPEN/CLOSED/PRE_MARKET/POST_MARKET)
- Auto-polling every 60 seconds
- Color-coded status badges

---

### Phase 2 - Watchlist & Market Data

#### Watchlists (US-2.1.1)
- **Components:**
  - `WatchlistPage.tsx` - Watchlist management
  - `WatchlistCard.tsx` - Individual watchlist

- **Services:**
  - `watchlistService.ts` - Watchlist CRUD

**Features:**
- Create/delete watchlists
- Add/remove instruments
- Real-time price updates

#### Market Data Feed (US-2.2.1)
- **Services:**
  - `marketDataService.ts` - Price data fetching

- **Hooks:**
  - `useMarketData.ts` - Real-time price updates

**Features:**
- Batch price fetching
- WebSocket-like polling (3-second intervals)
- Automatic price updates

#### Live Stock Charts (US-2.3.1)
- **Components:**
  - `StockChart.tsx` - Candlestick chart with real-time overlay

- **Libraries:**
  - `lightweight-charts` - High-performance charting

**Features:**
- Interactive candlestick charts
- Real-time price line overlay
- Multiple timeframes (1m, 5m, 15m, 1h, 1d)
- Dynamic tab titles with price updates

---

### Phase 3 - User Profile

#### Identity & Branding (US-3.1.1)
- User profile display
- Personal information management

#### Account Security (US-3.1.2)
- Password change functionality
- Security settings

#### User Preferences (US-3.1.3)
- Trading preferences
- UI customization

#### Account Finances (US-3.1.4)
- Account balance display
- Financial overview

---

### Phase 4 - Order Management

#### Order Placement (US-4.1.1)
- **Components:**
  - `TradePanel.tsx` - Order entry form
  - `OrderConfirmation.tsx` - Confirmation dialog

- **Services:**
  - `orderService.ts` - Order API calls

- **Hooks:**
  - `useOrderPlacement.ts` - Order placement logic

**Features:**
- MARKET orders
- LIMIT orders
- STOP orders
- STOP_LIMIT orders
- TRAILING_STOP orders
- Real-time validation
- Order preview

#### Order Management (US-4.1.2)
- **Components:**
  - `OrderList.tsx` - Order table with filters
  - `OrderTypeBadge.tsx` - Color-coded order type badges

**Features:**
- Modify orders (quantity, price)
- Cancel orders
- Order status tracking
- Expandable row details

#### Order History (US-4.1.3)
- **Components:**
  - `OrdersPage.tsx` - Main orders page with tabs

**Features:**
- Tab navigation (All/Pending/Executed/Cancelled/Rejected)
- Client-side filtering for Pending and Executed tabs
- Pagination
- Search and sort

#### Stop & Contingent Orders (US-4.1.4)
- **Services:**
  - Stop order validation
  - Trailing stop calculations

**Features:**
- STOP orders (trigger at stop price → MARKET)
- STOP_LIMIT orders (trigger at stop price → LIMIT)
- TRAILING_STOP orders (dynamic stop price adjustment)
- Trail by absolute amount or percentage
- Real-time stop price updates

#### Stop Order UI Enhancements (US-4.1.5 Phase 1)
- **Components:**
  - `OrderTypeBadge.tsx` - Distinct badges for each order type

**Features:**
- Stop Price column in order table
- Distance indicators for trailing stops (% from trigger)
- Tab-based navigation
- Visual distinction for stop orders
- Real-time stop price display

---

## 🎨 UI Components

### Design System

**Color Palette:**
- Primary: Material UI default blue
- Success: Green (#2e7d32)
- Error: Red (#d32f2f)
- Warning: Orange (#ed6c02)
- Info: Blue (#0288d1)

**Order Type Colors:**
- MARKET: Grey
- LIMIT: Blue
- STOP: Orange
- STOP_LIMIT: Purple
- TRAILING_STOP: Blue gradient

### Key Components

#### OrderTypeBadge
```tsx
<OrderTypeBadge 
  orderType="TRAILING_STOP" 
  showTooltip={true}
  size="small"
/>
```

#### MarketStatusBadge
```tsx
<MarketStatusBadge exchange="NSE" />
```

#### TradePanel
```tsx
<TradePanel 
  instrumentId="..."
  symbol="TCS"
  currentPrice={1055.86}
/>
```

---

## 🔧 Services

### authService
```typescript
export const authService = {
  login: (email: string, password: string) => Promise<LoginResponse>,
  register: (email: string, password: string) => Promise<RegisterResponse>,
  logout: () => void,
};
```

### orderService
```typescript
export const orderService = {
  placeOrder: (request: OrderRequest) => Promise<OrderResponse>,
  getOrders: (filters?: OrderFilters) => Promise<PaginatedOrdersResponse>,
  getOrderDetails: (id: string) => Promise<OrderResponse>,
  modifyOrder: (id: string, quantity: number, price?: number) => Promise<OrderResponse>,
  cancelOrder: (id: string) => Promise<void>,
};
```

### marketDataService
```typescript
export const marketDataService = {
  getBatchPrices: (instrumentIds: string[]) => Promise<MarketData[]>,
  getCandlestickData: (instrumentId: string, interval: string) => Promise<Candle[]>,
  subscribeToPrice: (instrumentId: string, callback: (price: number) => void) => void,
};
```

---

## 🪝 Custom Hooks

### useAuth
```typescript
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

### useMarketData
```typescript
const { prices, isLoading, error } = useMarketData(instrumentIds);
```

### useOrderPlacement
```typescript
const { placeOrder, isPlacing, error } = useOrderPlacement();
```

### useDocumentTitle
```typescript
useDocumentTitle('TCS', 1055.86, 0.5); // Sets tab title: "TCS ↑ ₹1,055.86"
```

---

## 🗂️ State Management

### Zustand Stores

#### authStore
```typescript
interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}
```

#### instrumentStore
```typescript
interface InstrumentStore {
  instruments: Instrument[];
  searchResults: Instrument[];
  isLoading: boolean;
  fetchInstruments: () => Promise<void>;
  searchInstruments: (query: string) => Promise<void>;
}
```

---

## 🔐 Security

- **JWT Token Storage**: localStorage
- **Token Auto-Attach**: Axios interceptor
- **Protected Routes**: Authentication guard
- **XSS Prevention**: React's built-in escaping
- **CORS**: Configured on backend

---

## 🎯 Performance Optimizations

- **Debounced Search**: 300ms delay
- **Lazy Loading**: Code splitting with React.lazy
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: For large lists (future)
- **Batch API Calls**: Market data fetching

---

## 🧪 Testing

### Manual Testing

1. **Authentication Flow:**
   - Register → Login → Dashboard → Logout

2. **Order Placement:**
   - Navigate to instrument
   - Open TradePanel
   - Place MARKET/LIMIT/STOP order
   - Verify order appears in OrderList

3. **Real-Time Updates:**
   - Open instrument detail
   - Observe price updates
   - Check chart updates

---

## 🔧 Troubleshooting

### CORS Errors
- Ensure backend is running
- Check `VITE_API_URL` in `.env`
- Verify backend CORS middleware

### Token Not Persisting
- Clear localStorage
- Check browser console for errors
- Verify `initialize()` is called in `App.tsx`

### Chart Not Loading
- Check `lightweight-charts` installation
- Verify candlestick data format
- Check browser console for errors

---

## 📚 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety (strict mode)
- **Material UI** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **Zustand** - State management
- **Vite** - Build tool
- **lightweight-charts** - Charting library

---

## 📋 File Size Limits

| File Type | Max Lines |
|-----------|-----------|
| Component | 50-150 |
| Container | 150-300 |
| Hook | 200 |
| Service | 100 |

---

## 🚀 Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview  # Preview production build
```

### Environment Variables

**Development (`.env`):**
```env
VITE_API_URL=http://localhost:8080/api
```

**Production:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material UI](https://mui.com/)
- [Zustand](https://github.com/pmndrs/zustand)
