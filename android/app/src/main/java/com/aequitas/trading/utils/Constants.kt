package com.aequitas.trading.utils

object Constants {
    // API Configuration
    const val BASE_URL = "http://10.0.2.2:8080/api/"  // Emulator localhost
    const val CONNECT_TIMEOUT = 30L  // seconds
    const val READ_TIMEOUT = 30L     // seconds
    const val WRITE_TIMEOUT = 30L    // seconds
    
    // WebSocket
    const val WS_URL = "ws://10.0.2.2:8080/ws"
    const val WS_RECONNECT_INTERVAL = 5000L  // milliseconds
    
    // DataStore Keys
    const val PREFERENCES_NAME = "aequitas_preferences"
    const val KEY_AUTH_TOKEN = "auth_token"
    const val KEY_USER_ID = "user_id"
    const val KEY_USER_EMAIL = "user_email"
    
    // Database
    const val DATABASE_NAME = "aequitas_db"
    const val DATABASE_VERSION = 1
    
    // Pagination
    const val DEFAULT_PAGE_SIZE = 20
    const val INITIAL_PAGE = 1
    
    // Market Data
    const val PRICE_UPDATE_INTERVAL = 3000L  // milliseconds
    const val MARKET_STATUS_UPDATE_INTERVAL = 60000L  // 1 minute
    
    // Chart Intervals
    const val INTERVAL_1M = "1m"
    const val INTERVAL_5M = "5m"
    const val INTERVAL_15M = "15m"
    const val INTERVAL_1H = "1h"
    const val INTERVAL_1D = "1d"
    
    // Order Types
    const val ORDER_TYPE_MARKET = "MARKET"
    const val ORDER_TYPE_LIMIT = "LIMIT"
    const val ORDER_TYPE_STOP = "STOP"
    const val ORDER_TYPE_STOP_LIMIT = "STOP_LIMIT"
    const val ORDER_TYPE_TRAILING_STOP = "TRAILING_STOP"
    
    // Order Sides
    const val ORDER_SIDE_BUY = "BUY"
    const val ORDER_SIDE_SELL = "SELL"
    
    // Order Status
    const val ORDER_STATUS_NEW = "NEW"
    const val ORDER_STATUS_PENDING = "PENDING"
    const val ORDER_STATUS_FILLED = "FILLED"
    const val ORDER_STATUS_CANCELLED = "CANCELLED"
    const val ORDER_STATUS_REJECTED = "REJECTED"
    
    // Market Status
    const val MARKET_STATUS_OPEN = "OPEN"
    const val MARKET_STATUS_CLOSED = "CLOSED"
    const val MARKET_STATUS_PRE_MARKET = "PRE_MARKET"
    const val MARKET_STATUS_POST_MARKET = "POST_MARKET"
    
    // Exchanges
    const val EXCHANGE_NSE = "NSE"
    const val EXCHANGE_BSE = "BSE"
}
