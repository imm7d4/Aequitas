# Aequitas Frontend

React + TypeScript frontend for Aequitas retail stock trading platform.

## Architecture

This frontend follows **Feature-First Architecture**:

- **Features**: Self-contained business features (auth, orders, wallet, etc.)
- **Shared**: Cross-feature reusable components
- **UI**: Design system primitives
- **Lib**: Low-level libraries (API client, storage)

### Rules

- ❌ Components MUST NOT call APIs
- ❌ Components MUST NOT contain business logic
- ❌ Services MUST NOT import React
- ✅ Single axios instance in `lib/api/apiClient.ts`
- ✅ Hooks orchestrate services
- ✅ Components only render

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

Frontend will start on `http://localhost:5173`

## Features

### Authentication (Phase 0) ✅

- **User Registration** (US-0.1.1)
  - Email and password validation
  - Form validation with error handling
  
- **Login** (US-0.1.3)
  - JWT token-based authentication
  - Secure credential validation
  
- **Protected Routes**
  - Route guards for authenticated pages
  - Automatic redirect to login when unauthenticated
  - Loading state to prevent flash of login page
  
- **JWT Token Management**
  - Token stored in localStorage
  - Auto-attached to API requests via Axios interceptor
  - Token persistence across page refreshes
  - Proper initialization with loading states
  
- **State Management**
  - Zustand for global auth state
  - Centralized authentication logic
  - Type-safe state updates

### Market & Instruments (Phase 1) ✅

- **Instrument Master Data** (US-1.1.1)
  - Full instrument list with search and filtering
  - Debounced search by symbol, name, or ISIN
  - Detailed instrument cards with sector and exchange info
  
- **Market Status Monitoring** (US-1.1.2)
  - Real-time market status badge (OPEN, CLOSED, PRE_MARKET, POST_MARKET)
  - Automatic polling every 60 seconds
  - Visual status indicators (color-coded chips)
  
- **State Management (Zustand)**
  - `instrumentStore`: Manages instrument list and search results
  - `marketStore`: Manages real-time market status
  
- **Custom Hooks**
  - `useInstruments`: Orchestrates fetching and searching instruments
  - `useMarketStatus`: Handles market status polling and data retrieval

### Architecture Highlights

**Token Persistence Implementation:**
- Initial `isLoading: true` prevents premature redirects
- `initialize()` called on app mount to restore session
- `ProtectedRoute` waits for auth check before rendering
- Error handling for corrupted localStorage data

## Tech Stack

- React 18
- TypeScript (strict mode)
- Material UI
- React Router
- Axios
- Zustand (state management)
- Vite

## Environment Variables

See `.env` file for configuration.
