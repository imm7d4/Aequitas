# US-7.1 - Real-Time Notification System

**Epic:** EPIC 0.7 - Notifications
**Phase:** Phase 7 - Notifications
**Status:** In Progress

## User Story

As a **trader**,
I want to **receive granular, real-time notifications about order execution, risk alerts, and market movements**,
So that I can **immediately react to fills, rejections, and margin warnings**.

## Acceptance Criteria

- [ ] **Real-Time Delivery**:
    - [ ] Notifications are delivered instantly via WebSocket when an event occurs (e.g., Order Filled, Price Alert).
    - [ ] If the user is offline, notifications are stored and delivered upon next login.

- [ ] **Notification Triggers & Types**:
    - [ ] **Order Events** (High Priority):
        - [ ] **Filled**: "Buy order for 10 TCS filled at 1055.86" (Green/Success).
        - [ ] **Rejected**: "Order rejected: Insufficient funds" (Red/Error).
        - [ ] **Cancelled**: "IOC order cancelled" (Gray/Info).
    - [ ] **Market Alerts**:
        - [ ] **Price Alert**: "TCS crossed above 1100.00" (Yellow/Warning).
    - [ ] **Account Events**:
        - [ ] **Margin Call**: "Account margin below 50%" (Red/CRITICAL).
        - [ ] **Deposit/Withdrawal**: "Deposit of ₹5000 successful" (Green/Success).
        - [ ] **Actions**: Notifications include quick actions (e.g., Margin Call -> [Add Funds]).
    - [ ] **System**:
        - [ ] **Maintenance**: "System maintenance in 10 mins" (Blue/Info).

- [ ] **Actionable Notifications**:
    - [ ] Notifications support quick actions like "View Order", "Retry Order", "Add Funds".
    - [ ] Clicking an action deep-links to the specific screen.

- [ ] **Time-Sensitive Expiry (TTL)**:
    - [ ] Notifications have an optional expiry time.
    - [ ] Expired notifications (e.g., old price alerts) are automatically hidden/removed.
    - [ ] System Info expires when the event ends.

- [ ] **Global Header UI**:
    - [ ] **Bell Icon**: Shows a red badge with the count of unread notifications.
    - [ ] **Dropdown Menu**: Clicking the bell opens a dropdown showing the last 10 notifications.
    - [ ] **"Mark all as read"** button in the dropdown.
    - [ ] **Empty State**: "No new notifications" message when empty.


- [ ] **Persistence**:
    - [ ] Notifications are saved to the database.
    - [ ] Read status is persisted (clicking a notification marks it as read).

## Technical Requirements

### Backend (Go + MongoDB)
- **Models**: `Notification` struct with `UserID`, `Type`, `Title`, `Message`, `IsRead`, `Actions`, `ExpiresAt`.
- **Repository**: Filter out expired notifications on fetch.
- **WebSocket Manager**: Handle concurrent connections and broadcast messages to specific users.
- **API**:
    - `GET /api/notifications`: Fetch history.
    - `PUT /api/notifications/read`: Mark as read.

### Frontend (React + Zustand)
- **Store**: `useNotificationStore` for state management.
- **WebSocket Hook**: `useWebSocket` for managing the connection.
- **Components**: `NotificationDropdown`, `NotificationItem`.

## Non-Functional Requirements (Critical)

- [ ] **Scalability**:
    - [ ] System supports **10k concurrent WebSocket users**.
    - [ ] Architecture is **horizontally scalable** (stateless design + pub/sub ready).
- [ ] **Reliability**:
    - [ ] **Idempotent Delivery**: Duplicate events are handled gracefully; users don't see duplicate notifications.
    - [ ] **Data Integrity**: No notification loss during server restart (persisted to DB before delivery).
- [ ] **Security**:
    - [ ] WebSocket connections MUST be authenticated via **JWT**.


## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-07 | AI Assistant | Initial Draft |
