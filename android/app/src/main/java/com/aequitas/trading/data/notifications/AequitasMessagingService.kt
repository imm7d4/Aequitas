package com.aequitas.trading.data.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import com.aequitas.trading.MainActivity
import com.aequitas.trading.R
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

/**
 * Firebase Cloud Messaging Service
 * Handles incoming push notifications
 */
@AndroidEntryPoint
class AequitasMessagingService : FirebaseMessagingService() {
    
    @Inject
    lateinit var notificationManager: NotificationManagerWrapper
    
    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        // Handle notification payload
        remoteMessage.notification?.let { notification ->
            val title = notification.title ?: "Aequitas"
            val body = notification.body ?: ""
            val type = remoteMessage.data["type"] ?: "general"
            
            sendNotification(title, body, type)
        }
        
        // Handle data payload
        if (remoteMessage.data.isNotEmpty()) {
            handleDataPayload(remoteMessage.data)
        }
    }
    
    override fun onNewToken(token: String) {
        super.onNewToken(token)
        
        // Send token to your backend server
        sendTokenToServer(token)
    }
    
    private fun handleDataPayload(data: Map<String, String>) {
        val type = data["type"]
        val message = data["message"]
        
        when (type) {
            "order_filled" -> {
                val orderId = data["orderId"]
                val symbol = data["symbol"]
                sendNotification(
                    "Order Filled",
                    "Your order for $symbol has been filled",
                    "order"
                )
            }
            "price_alert" -> {
                val symbol = data["symbol"]
                val price = data["price"]
                sendNotification(
                    "Price Alert",
                    "$symbol reached ₹$price",
                    "price_alert"
                )
            }
            "market_status" -> {
                val status = data["status"]
                sendNotification(
                    "Market Update",
                    "Market is now $status",
                    "market"
                )
            }
            else -> {
                message?.let {
                    sendNotification("Aequitas", it, "general")
                }
            }
        }
    }
    
    private fun sendNotification(title: String, message: String, type: String) {
        val intent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("notification_type", type)
        }
        
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )
        
        val channelId = when (type) {
            "order" -> CHANNEL_ID_ORDERS
            "price_alert" -> CHANNEL_ID_PRICE_ALERTS
            "market" -> CHANNEL_ID_MARKET
            else -> CHANNEL_ID_GENERAL
        }
        
        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        
        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle(title)
            .setContentText(message)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
        
        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        // Create notification channel for Android O+
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                getChannelName(type),
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = getChannelDescription(type)
            }
            notificationManager.createNotificationChannel(channel)
        }
        
        notificationManager.notify(System.currentTimeMillis().toInt(), notificationBuilder.build())
    }
    
    private fun getChannelName(type: String): String = when (type) {
        "order" -> "Order Updates"
        "price_alert" -> "Price Alerts"
        "market" -> "Market Updates"
        else -> "General Notifications"
    }
    
    private fun getChannelDescription(type: String): String = when (type) {
        "order" -> "Notifications about your order status"
        "price_alert" -> "Price alerts for your watchlist"
        "market" -> "Market opening/closing notifications"
        else -> "General app notifications"
    }
    
    private fun sendTokenToServer(token: String) {
        // TODO: Send FCM token to your backend
        // This allows your backend to send push notifications to this device
        android.util.Log.d("FCM", "New token: $token")
    }
    
    companion object {
        private const val CHANNEL_ID_GENERAL = "aequitas_general"
        private const val CHANNEL_ID_ORDERS = "aequitas_orders"
        private const val CHANNEL_ID_PRICE_ALERTS = "aequitas_price_alerts"
        private const val CHANNEL_ID_MARKET = "aequitas_market"
    }
}

/**
 * Wrapper for NotificationManager to make it injectable
 */
class NotificationManagerWrapper(private val context: Context) {
    fun getNotificationManager(): NotificationManager {
        return context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    }
}
