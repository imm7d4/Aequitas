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

## 📡 API Endpoints

All endpoints follow standardized response format:
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message"
}
```

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Instruments
- `GET /api/instruments` - List active instruments (protected)
- `GET /api/instruments/search?q=query` - Search instruments (protected)
- `GET /api/instruments/{id}` - Get instrument details (protected)
- `POST /api/admin/instruments` - Create instrument (admin)
- `PUT /api/admin/instruments/{id}` - Update instrument (admin)

### Market
- `GET /api/market/status/{exchange}` - Get real-time market status (protected)
- `POST /api/admin/market/hours` - Configure market hours (admin)
- `POST /api/admin/market/holidays` - Add market holiday (admin)

## 🧪 Testing

### Manual Testing

1. **Register a new user**
   - Navigate to `http://localhost:5173/register`
   - Enter email and password (min 8 characters)
   - Click "Register"

2. **Login**
   - Navigate to `http://localhost:5173/login`
   - Enter credentials
   - Click "Login"

3. **Access Dashboard**
   - After login, you'll be redirected to `/dashboard`
   - Trading account info displayed

4. **Logout**
   - Click "Logout" button
   - Redirected to login page

5. **Token Persistence**
   - Login
   - Refresh page
   - Expected: Still logged in, dashboard loads

## 🔧 Troubleshooting

### Backend Issues

**Go Module Cache Permission Error**
```bash
# If you see "Access is denied" for module cache
$env:GOPATH = "$env:USERPROFILE\go"
go mod tidy
```

**JWT Secret Not Loading**
- Ensure `.env` file is in the `backend/` directory
- Check file encoding (should be ASCII or UTF-8 without BOM)
- Verify `JWT_SECRET` is set in `.env`

**Port Already in Use**
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Frontend Issues

**CORS Errors**
- Ensure backend server is running
- Check CORS middleware is applied first in `main.go`
- Verify frontend is accessing `http://localhost:8080`

**Token Not Persisting**
- Clear browser localStorage
- Check browser console for errors
- Ensure `initialize()` is called in `App.tsx`


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

## 📋 Next Steps

Phase 2 - Watchlist & Market Data (Next)

## 📄 License

Proprietary
