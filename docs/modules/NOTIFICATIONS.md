# Module: Notification System

## 1. Overview
The **Notification System** provides real-time feedback to users regarding order updates, market alerts, and system messages. It is designed for **high reliability** (persistence across refreshes) and **low latency** (WebSocket delivery).

**Key Service:** [`NotificationService`](backend/internal/services/notification_service.go)
**Delivery Channels:**
- **In-App Toast:** Transient alerts for immediate feedback.
- **Side Panel:** Persistent history of recent notifications.
- **WebSocket Hub:** Underlying transport for real-time delivery.

---

## 2. Technical Architecture

### 2.1 Dual-Path Delivery
When `SendNotification` is called:
1.  **Persistence (MongoDB)**: The notification is immediately saved to the `notifications` collection. This ensures that if a user is offline or refreshes the page, they don't miss the update.
2.  **Broadcasting (WebSockets)**: The `NotificationService` passes the object to the `WS Hub`, which identifies the specific user's connection and pushes the JSON payload.

### 2.2 Actionable Notifications
Aequitas supports "Interactive" notifications via the `Actions` field in the model.
- **Model**: `models.NotificationAction` (Label, URL/ActionType).
- **Usage**: A "Order Filled" notification can include a button labeled "View Portfolio" that triggers a frontend route change.

---

## 3. Data Management

### 3.1 Lifecycle
- **Unread/Read**: Managed via the `is_read` boolean. The frontend marks notifications as read when the user opens the notification drawer.
- **Clearance**: Users can call `ClearAll` to hard-delete notifications from the DB.
- **Auto-Expiry (TTL)**: To prevent the DB from growing indefinitely, a background `NotificationCleanupService` deletes records older than 24-48 hours.

### 3.2 Fetching History
On every initial page load (or refresh), the frontend `useNotifications` hook calls:
`GET /api/notifications`
This hydrates the `Zustand` store with the last 50 notifications, keeping the UI consistent regardless of session interruptions.

---

## 4. Implementation Reference

### Triggering a Notification (Backend)
```go
err := s.notificationService.SendNotification(
    ctx,
    userID,
    models.NotificationTypeOrder,
    "Order Filled",
    fmt.Sprintf("Your %s order for %d %s was filled", side, qty, symbol),
    map[string]interface{}{"orderId": orderID},
    []models.NotificationAction{{Label: "View Order", Action: "/orders"}}
)
```

### Receiving a Notification (Frontend)
The `useWebSocket` hook listens for messages of type `NOTIFICATION`. When received:
1.  Plays a success/info sound (if configured).
2.  Spawns a Snack/Toast via the `NotificationProvider`.
3.  Injects the message into the `zustand` notification store.

---

## 5. Troubleshooting & Onboarding

### Common Scenarios
- **"Notifications aren't showing up":**
    1. Check if the WebSocket connection is `CLOSED`.
    2. Check the browser console for `WS_MESSAGE_RECEIVED` logs.
    3. Verify the `userID` in the backend log matches the logged-in session.
- **"Notifications disappear on refresh":**
    1. This means the frontend is relying only on WS messages and not fetching the DB history. Check the `useEffect` in the notification hook.
- **"TTL Cleanup not working":**
    1. Verify `NotificationCleanupService.Start()` is called in `main.go`.
