# Firebase Cloud Messaging (Push Notifications) Setup

## Overview
The app now supports WhatsApp-style push notifications for:
- **Order Updates**: Order filled, cancelled, rejected
- **Price Alerts**: Stock price reaches target
- **Market Updates**: Market open/close notifications

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `Aequitas Trading`
4. Follow the setup wizard

### 2. Add Android App to Firebase

1. In Firebase Console, click "Add app" → Android
2. Enter package name: `com.aequitas.trading`
3. Download `google-services.json`
4. **IMPORTANT**: Replace the template file at:
   ```
   android/app/google-services.json
   ```
   with your downloaded file

### 3. Request Notification Permission (Android 13+)

The app will automatically request notification permission on Android 13+. For older versions, notifications work by default.

### 4. Backend Integration

Your Go backend needs to send push notifications. Here's how:

#### Install Firebase Admin SDK (Go)
```bash
go get firebase.google.com/go/v4
```

#### Send Notification from Backend
```go
package main

import (
    "context"
    "firebase.google.com/go/v4"
    "firebase.google.com/go/v4/messaging"
    "google.golang.org/api/option"
)

func sendOrderFilledNotification(userToken, symbol, orderId string) error {
    ctx := context.Background()
    
    // Initialize Firebase
    opt := option.WithCredentialsFile("path/to/serviceAccountKey.json")
    app, err := firebase.NewApp(ctx, nil, opt)
    if err != nil {
        return err
    }
    
    client, err := app.Messaging(ctx)
    if err != nil {
        return err
    }
    
    // Create notification
    message := &messaging.Message{
        Notification: &messaging.Notification{
            Title: "Order Filled",
            Body:  "Your order for " + symbol + " has been filled",
        },
        Data: map[string]string{
            "type":    "order_filled",
            "orderId": orderId,
            "symbol":  symbol,
        },
        Token: userToken,
    }
    
    // Send notification
    _, err = client.Send(ctx, message)
    return err
}

// Send to topic (all users)
func sendMarketUpdateToAll(status string) error {
    ctx := context.Background()
    opt := option.WithCredentialsFile("path/to/serviceAccountKey.json")
    app, err := firebase.NewApp(ctx, nil, opt)
    if err != nil {
        return err
    }
    
    client, err := app.Messaging(ctx)
    if err != nil {
        return err
    }
    
    message := &messaging.Message{
        Notification: &messaging.Notification{
            Title: "Market Update",
            Body:  "Market is now " + status,
        },
        Data: map[string]string{
            "type":   "market_status",
            "status": status,
        },
        Topic: "all_users",
    }
    
    _, err = client.Send(ctx, message)
    return err
}
```

### 5. Store FCM Token in Backend

When user logs in, the app gets an FCM token. Send this to your backend:

```kotlin
// In AuthViewModel after successful login
val fcmToken = notificationManager.getFcmToken()
// Send fcmToken to backend API
apiService.updateFcmToken(userId, fcmToken)
```

Backend endpoint:
```go
// POST /api/users/:id/fcm-token
func (c *UserController) UpdateFcmToken(ctx *gin.Context) {
    userId := ctx.Param("id")
    var req struct {
        FcmToken string `json:"fcm_token"`
    }
    
    if err := ctx.ShouldBindJSON(&req); err != nil {
        ctx.JSON(400, gin.H{"error": err.Error()})
        return
    }
    
    // Save token to database
    err := c.userService.UpdateFcmToken(userId, req.FcmToken)
    if err != nil {
        ctx.JSON(500, gin.H{"error": "Failed to update token"})
        return
    }
    
    ctx.JSON(200, gin.H{"message": "Token updated"})
}
```

## Notification Types

### 1. Order Filled
```json
{
  "notification": {
    "title": "Order Filled",
    "body": "Your order for RELIANCE has been filled"
  },
  "data": {
    "type": "order_filled",
    "orderId": "ORD123",
    "symbol": "RELIANCE"
  }
}
```

### 2. Price Alert
```json
{
  "notification": {
    "title": "Price Alert",
    "body": "TCS reached ₹3500"
  },
  "data": {
    "type": "price_alert",
    "symbol": "TCS",
    "price": "3500"
  }
}
```

### 3. Market Status
```json
{
  "notification": {
    "title": "Market Update",
    "body": "Market is now OPEN"
  },
  "data": {
    "type": "market_status",
    "status": "OPEN"
  }
}
```

## Testing Notifications

### Test from Firebase Console
1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and text
4. Select your app
5. Send test message

### Test from Backend
Use the code examples above to send notifications from your Go backend.

## Notification Channels

The app creates 4 notification channels:
- **General**: General app notifications
- **Order Updates**: Order status changes
- **Price Alerts**: Price target reached
- **Market Updates**: Market open/close

Users can control each channel separately in Android settings.

## Important Notes

1. **Replace google-services.json**: The current file is a template. You MUST replace it with your actual Firebase config.

2. **Backend Integration Required**: The app can receive notifications, but your backend must send them using Firebase Admin SDK.

3. **Android 13+ Permission**: Users on Android 13+ will be prompted to allow notifications. Handle this gracefully.

4. **Topics**: Users are automatically subscribed to:
   - `user_{userId}` - User-specific notifications
   - `all_users` - Broadcast to all users
   - `market_updates` - Market status updates

## Troubleshooting

**Notifications not appearing?**
- Check if `google-services.json` is correct
- Verify notification permission is granted
- Check Logcat for FCM token
- Ensure backend is sending to correct token

**Token not generated?**
- Ensure Firebase dependencies are added
- Check if Google Play Services is available
- Verify `google-services.json` is in `app/` directory
