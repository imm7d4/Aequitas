# Aequitas Backend

Go backend for Aequitas retail stock trading platform following **Controller-Service-Repository (CSR)** pattern.

## 🏗️ Architecture

```
backend/
├── cmd/server/              # Entry point
├── internal/
│   ├── controllers/         # HTTP layer (<100 lines)
│   ├── services/            # Business logic (<300 lines)
│   ├── repositories/        # Data access (<200 lines)
│   ├── middleware/          # Auth, logging, CORS, error handling
│   ├── models/              # MongoDB schemas
│   └── utils/               # Helpers (<100 lines)
└── scripts/seed/            # Database seeding scripts
```

### Design Principles

- **Controllers**: Thin HTTP layer, basic validation only
- **Services**: Business logic, orchestrate repositories
- **Repositories**: Data access, no business logic
- **No cross-layer violations**: Controllers → Services → Repositories

---

## 🚀 Quick Start

### Prerequisites
- Go 1.21+
- MongoDB 6.0+

### 1. Install Dependencies
```bash
# Set GOPATH to avoid permission issues (Windows)
$env:GOPATH = "$env:USERPROFILE\go"
go mod download
```

### 2. Start MongoDB
```bash
# Using Docker
docker-compose up -d

# Or use local MongoDB installation
```

### 3. Configure Environment
Create `.env` file in `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/aequitas
JWT_SECRET=your-secure-random-secret-key-here
JWT_EXPIRY_HOURS=24
PORT=8080
```

**Important:**
- `JWT_SECRET` must be set (validated on startup)
- Use strong, random secret in production
- File encoding: ASCII or UTF-8 (no BOM)

### 4. Run Server
```bash
go run cmd/server/main.go
```

Server starts on `http://localhost:8080`

Expected output:
```
Configuration loaded successfully
Connected to MongoDB successfully
Server starting on port 8080
```

### 5. Seed Database (Optional)
```bash
cd backend/scripts/seed
go run main.go
```

Seeds:
- 100 NSE instruments
- Market hours (NSE/BSE)
- Market holidays (2026)

---

## 📡 API Endpoints

All endpoints return standardized format:
```json
{
  "statusCode": 200,
  "data": { ... },
  "message": "Success message"
}
```

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "...", "email": "..." },
    "account": { "id": "...", "balance": 0 }
  }
}
```

---

### Instruments

#### List Instruments
```http
GET /api/instruments
Authorization: Bearer <token>
```

#### Search Instruments
```http
GET /api/instruments/search?q=TCS
Authorization: Bearer <token>
```

#### Get Instrument Details
```http
GET /api/instruments/:id
Authorization: Bearer <token>
```

#### Create Instrument (Admin)
```http
POST /api/admin/instruments
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "TCS",
  "name": "Tata Consultancy Services",
  "isin": "INE467B01029",
  "exchange": "NSE",
  "instrumentType": "EQUITY",
  "sector": "IT"
}
```

---

### Market Data

#### Get Market Status
```http
GET /api/market/status/:exchange
Authorization: Bearer <token>
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "exchange": "NSE",
    "status": "OPEN",
    "nextOpen": "2026-01-07T09:15:00Z",
    "nextClose": "2026-01-06T15:30:00Z"
  }
}
```

#### Get Batch Prices
```http
POST /api/market/prices
Authorization: Bearer <token>
Content-Type: application/json

{
  "instrumentIds": ["id1", "id2", "id3"]
}
```

#### Get Candlestick Data
```http
GET /api/market/candles/:instrumentId?interval=1m&limit=100
Authorization: Bearer <token>
```

---

### Orders

#### Place Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "instrumentId": "...",
  "symbol": "TCS",
  "side": "BUY",
  "orderType": "LIMIT",
  "quantity": 10,
  "price": 1050.00,
  "clientOrderId": "unique-id"
}
```

**Stop Orders:**
```json
{
  "instrumentId": "...",
  "symbol": "TCS",
  "side": "SELL",
  "orderType": "TRAILING_STOP",
  "quantity": 10,
  "trailAmount": 5.0,
  "trailType": "ABSOLUTE"
}
```

#### Get Orders
```http
GET /api/orders?status=NEW&page=1&limit=10
Authorization: Bearer <token>
```

#### Get Order Details
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

#### Modify Order
```http
PUT /api/orders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 15,
  "price": 1055.00
}
```

#### Cancel Order
```http
DELETE /api/orders/:id
Authorization: Bearer <token>
```

---

### Telemetry

#### Batch Ingest Events
```http
POST /api/telemetry
Authorization: Bearer <token>
Content-Type: application/json

{
  "events": [
    {
      "type": "page_view",
      "timestamp": "2026-01-06T10:00:00Z",
      "data": { ... }
    }
  ]
}
```

---

## 🗄️ Data Models

### User
```go
type User struct {
    ID        primitive.ObjectID `bson:"_id,omitempty"`
    Email     string             `bson:"email"`
    Password  string             `bson:"password"` // bcrypt hashed
    Status    string             `bson:"status"`   // ACTIVE, SUSPENDED
    CreatedAt time.Time          `bson:"createdAt"`
}
```

### Account
```go
type Account struct {
    ID        primitive.ObjectID `bson:"_id,omitempty"`
    UserID    primitive.ObjectID `bson:"userId"`
    Balance   float64            `bson:"balance"`
    Currency  string             `bson:"currency"` // INR
    CreatedAt time.Time          `bson:"createdAt"`
}
```

### Instrument
```go
type Instrument struct {
    ID             primitive.ObjectID `bson:"_id,omitempty"`
    Symbol         string             `bson:"symbol"`
    Name           string             `bson:"name"`
    ISIN           string             `bson:"isin"`
    Exchange       string             `bson:"exchange"`
    InstrumentType string             `bson:"instrumentType"` // EQUITY
    Sector         string             `bson:"sector"`
    IsActive       bool               `bson:"isActive"`
}
```

### Order
```go
type Order struct {
    ID           primitive.ObjectID `bson:"_id,omitempty"`
    OrderID      string             `bson:"orderId"`
    UserID       primitive.ObjectID `bson:"userId"`
    AccountID    primitive.ObjectID `bson:"accountId"`
    InstrumentID primitive.ObjectID `bson:"instrumentId"`
    Symbol       string             `bson:"symbol"`
    Side         string             `bson:"side"`         // BUY, SELL
    OrderType    string             `bson:"orderType"`    // MARKET, LIMIT, STOP, etc.
    Quantity     int                `bson:"quantity"`
    Price        *float64           `bson:"price,omitempty"`
    Status       string             `bson:"status"`       // NEW, PENDING, FILLED, CANCELLED
    
    // Stop Order Fields
    StopPrice        *float64 `bson:"stopPrice,omitempty"`
    LimitPrice       *float64 `bson:"limitPrice,omitempty"`
    TrailAmount      *float64 `bson:"trailAmount,omitempty"`
    TrailType        string   `bson:"trailType,omitempty"`     // ABSOLUTE, PERCENTAGE
    CurrentStopPrice *float64 `bson:"currentStopPrice,omitempty"`
    HighestPrice     *float64 `bson:"highestPrice,omitempty"`
    LowestPrice      *float64 `bson:"lowestPrice,omitempty"`
    
    CreatedAt time.Time `bson:"createdAt"`
}
```

### MarketData
```go
type MarketData struct {
    ID           primitive.ObjectID `bson:"_id,omitempty"`
    InstrumentID primitive.ObjectID `bson:"instrumentId"`
    LastPrice    float64            `bson:"lastPrice"`
    Open         float64            `bson:"open"`
    High         float64            `bson:"high"`
    Low          float64            `bson:"low"`
    Close        float64            `bson:"close"`
    Volume       int64              `bson:"volume"`
    Timestamp    time.Time          `bson:"timestamp"`
}
```

---

## 🔧 Services

### AuthService
- User registration with bcrypt hashing
- JWT token generation
- Login validation

### OrderService
- Order placement (MARKET, LIMIT, STOP, STOP_LIMIT, TRAILING_STOP)
- Order modification
- Order cancellation
- Order status management

### StopOrderService
- Stop order trigger monitoring (background service)
- Trailing stop price adjustments
- Stop order execution

### MarketDataService
- Batch price fetching
- Candlestick data generation
- Real-time price simulation

### InstrumentService
- Instrument CRUD operations
- Search and filtering
- ISIN validation

---

## 🔐 Security

- **Password Hashing**: bcrypt (cost factor 14)
- **JWT Authentication**: HS256 algorithm
- **Token Expiry**: Configurable (default 24 hours)
- **CORS**: Configured for frontend origin
- **Protected Routes**: Authentication middleware on all protected endpoints

---

## 🧪 Testing

### Manual API Testing

Use tools like Postman or curl:

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Instruments (with token)
curl http://localhost:8080/api/instruments \
  -H "Authorization: Bearer <your-token>"
```

---

## 🔧 Troubleshooting

### Go Module Cache Permission Error
```bash
$env:GOPATH = "$env:USERPROFILE\go"
go mod tidy
```

### JWT Secret Not Loading
- Ensure `.env` file exists in `backend/` directory
- Check file encoding (ASCII or UTF-8, no BOM)
- Verify `JWT_SECRET` is set

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify network connectivity

---

## 📚 Additional Resources

- [Go Documentation](https://golang.org/doc/)
- [MongoDB Go Driver](https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo)
- [JWT Go](https://github.com/golang-jwt/jwt)
