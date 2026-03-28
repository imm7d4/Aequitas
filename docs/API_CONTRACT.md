# Aequitas API Contract (Exhaustive)

This document provides a technical reference for **every single** API endpoint in the Aequitas platform.

---

## 🏗️ General Information

- **Base URL**: `http://<host>:<port>/api`
- **WebSocket URL**: `ws://<host>:<port>/ws?token=<jwt_token>`
- **Response Format**: All responses use a standard JSON envelope:
```json
{
  "statusCode": number,
  "data": object | array | null,
  "message": "string"
}
```

---

## 🔐 1. Public / Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | `GET` | System health check. Returns "OK". |
| `/auth/register` | `POST` | Step 1: Initiate registration (sends OTP). |
| `/auth/register/complete` | `POST` | Step 2: Verify OTP and create account. |
| `/auth/login` | `POST` | Authenticate and receive JWT. |
| `/auth/forgot-password` | `POST` | Initiate password reset (sends OTP). |
| `/auth/reset-password` | `POST` | Complete password reset using OTP. |

---

## 🔍 2. Instruments (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/instruments` | `GET` | List all available instruments. |
| `/instruments/search` | `GET` | Search instruments by symbol or name (?q=). |
| `/instruments/{id}` | `GET` | Get detailed metadata for a specific instrument. |

---

## 📈 3. Market Data (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/market/status/{exchange}` | `GET` | Get real-time status (OPEN/CLOSED) for NSE/BSE. |
| `/market/prices` | `GET` | Get batch real-time prices (?ids=id1,id2). |
| `/market/candles/{id}` | `GET` | Get historical candlesticks (?interval,from,to,limit). |

---

## 📋 4. Watchlists (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/watchlists` | `GET` | List all user watchlists. |
| `/watchlists` | `POST` | Create a new empty watchlist. |
| `/watchlists/{id}` | `PUT` | Rename an existing watchlist. |
| `/watchlists/{id}` | `DELETE` | Delete a watchlist. |
| `/watchlists/{id}/default` | `POST` | Set a watchlist as the user's primary default. |
| `/watchlists/{id}/instruments/{instrumentId}` | `POST` | Add an instrument to a watchlist. |
| `/watchlists/{id}/instruments/{instrumentId}` | `DELETE` | Remove an instrument from a watchlist. |

---

## 👤 5. User Profile & Preferences (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/profile` | `GET` | Get current user profile details. |
| `/user/profile` | `PUT` | Update profile (Name, Bio, Avatar, Phone). |
| `/user/password` | `PUT` | Change account password. |
| `/user/preferences` | `PUT` | Update app preferences (Theme, UI settings). |
| `/user/email/initiate` | `POST` | Start email change (sends OTP to new email). |
| `/user/email/complete` | `POST` | Verify OTP and finish email change. |
| `/user/onboarding-status` | `PATCH` | Update the onboarding tutorial status. |

---

## 💰 6. Account & Transactions (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/account/balance` | `GET` | Get current cash balance and blocked margin. |
| `/account/fund` | `POST` | Quick fund (Add money without OTP - Simulation). |
| `/account/deposit/initiate` | `POST` | Secure deposit start (sends SMS OTP). |
| `/account/deposit/complete` | `POST` | Verify SMS OTP and add funds. |
| `/account/transactions` | `GET` | List all ledger transactions (Deposits, Fees). |

---

## 📦 7. Orders & Trading (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/orders` | `POST` | Place a new order (Market/Limit/Stop/Trailing). |
| `/orders` | `GET` | Get order history with filters (?status,instrumentId). |
| `/orders/pending-stops` | `GET` | Specialized view for active Stop/Trailing orders. |
| `/orders/{id}` | `PUT` | Modify price or quantity of a PENDING order. |
| `/orders/{id}` | `DELETE` | Cancel a PENDING order. |
| `/trades` | `GET` | List all executed trades. |
| `/trades/order/{orderId}` | `GET` | Get specific trade fills for a single order. |

---

## 📊 8. Portfolio (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/portfolio/holdings` | `GET` | List all open positions and buy-prices. |
| `/portfolio/summary` | `GET` | Get consolidated snapshot (Net worth, P&L). |
| `/portfolio/snapshot` | `POST` | Manually capture a historical snapshot point. |
| `/portfolio/history` | `GET` | Get historical portfolio equity curve. |

---

## 🔔 9. Notifications & Alerts (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/notifications` | `GET` | Get recent notification history. |
| `/notifications` | `DELETE` | Clear all notifications. |
| `/notifications/read-all` | `PUT` | Mark all notifications as read. |
| `/notifications/{id}/read` | `PUT` | Mark a specific notification as read. |
| `/alerts` | `GET` | List active price alerts. |
| `/alerts` | `POST` | Create a new price crossing alert. |
| `/alerts/{id}` | `DELETE` | Cancel a price alert. |

---

## 🛠️ 10. System & Admin

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/telemetry` | `POST` | Ingest batch UI performance/error events. |
| `/diagnostics` | `GET` | Trading performance metrics (Avg fill, variance). |
| `/dashboard/summary` | `GET` | Aggregate data for the main landing dashboard. |
| `/admin/instruments` | `POST` | [ADMIN] Manually add a new instrument. |
| `/admin/instruments/{id}` | `PUT` | [ADMIN] Update instrument metadata. |
| `/admin/market/hours` | `POST` | [ADMIN] Set trading session timing for exchange. |
| `/admin/market/hours/{exchange}` | `GET` | [ADMIN] View weekly session calendar. |
| `/admin/market/hours/{exchange}/bulk` | `PUT` | [ADMIN] Update weekly calendar in bulk. |
| `/admin/market/holidays` | `POST` | [ADMIN] Define a trading holiday. |
| `/admin/market/holidays` | `GET` | [ADMIN] List upcoming holidays manually. |
| `/admin/market/holidays/{exchange}` | `GET` | [ADMIN] List holidays for specific exchange. |
| `/admin/market/holidays/{id}` | `DELETE` | [ADMIN] Remove a holiday entry. |

---

## 🔌 11. WebSocket (`/ws`)

### Subscriptions
- **Topic**: `subscribe` | **Payload**: `{"type": "subscribe", "symbol": "id"}`
- **Topic**: `unsubscribe` | **Payload**: `{"type": "unsubscribe", "symbol": "id"}`

### Inbound Events (Server -> Client)
- **`candle`**: Real-time OHLC price updates.
- **`notification`**: Order execution alerts and account status.
- **`error`**: WebSocket protocol errors.

---
© 2026 Aequitas API Documentation. 100% Coverage.
