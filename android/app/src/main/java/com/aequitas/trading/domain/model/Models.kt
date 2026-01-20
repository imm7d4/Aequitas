package com.aequitas.trading.domain.model

import com.google.gson.annotations.SerializedName

/**
 * User model
 */
data class User(
    @SerializedName("id") val id: String,
    @SerializedName("email") val email: String,
    @SerializedName("status") val status: String,  // ACTIVE, SUSPENDED
    @SerializedName("createdAt") val createdAt: String
)

/**
 * Account model
 */
data class Account(
    @SerializedName("id") val id: String,
    @SerializedName("userId") val userId: String,
    @SerializedName("balance") val balance: Double,
    @SerializedName("currency") val currency: String,  // INR
    @SerializedName("createdAt") val createdAt: String
)

/**
 * Login request
 */
data class LoginRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)

/**
 * Register request
 */
data class RegisterRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String
)

/**
 * Auth response (login/register)
 */
data class AuthResponse(
    @SerializedName("token") val token: String,
    @SerializedName("user") val user: User,
    @SerializedName("account") val account: Account
)

/**
 * Instrument model
 */
data class Instrument(
    @SerializedName("id") val id: String,
    @SerializedName("symbol") val symbol: String,
    @SerializedName("name") val name: String,
    @SerializedName("isin") val isin: String,
    @SerializedName("exchange") val exchange: String,  // NSE, BSE
    @SerializedName("instrumentType") val instrumentType: String,  // EQUITY
    @SerializedName("sector") val sector: String,
    @SerializedName("isActive") val isActive: Boolean
)

/**
 * Market data model
 */
data class MarketData(
    @SerializedName("instrumentId") val instrumentId: String,
    @SerializedName("lastPrice") val lastPrice: Double,
    @SerializedName("open") val open: Double,
    @SerializedName("high") val high: Double,
    @SerializedName("low") val low: Double,
    @SerializedName("close") val close: Double,
    @SerializedName("volume") val volume: Long,
    @SerializedName("change") val change: Double,
    @SerializedName("changePercent") val changePercent: Double,
    @SerializedName("timestamp") val timestamp: String
)

/**
 * Candlestick data model
 */
data class Candle(
    @SerializedName("time") val time: Long,
    @SerializedName("open") val open: Double,
    @SerializedName("high") val high: Double,
    @SerializedName("low") val low: Double,
    @SerializedName("close") val close: Double,
    @SerializedName("volume") val volume: Long
)

/**
 * Order model
 */
data class Order(
    @SerializedName("id") val id: String,
    @SerializedName("orderId") val orderId: String,
    @SerializedName("userId") val userId: String,
    @SerializedName("accountId") val accountId: String,
    @SerializedName("instrumentId") val instrumentId: String,
    @SerializedName("symbol") val symbol: String,
    @SerializedName("side") val side: String,  // BUY, SELL
    @SerializedName("orderType") val orderType: String,  // MARKET, LIMIT, STOP, STOP_LIMIT, TRAILING_STOP
    @SerializedName("quantity") val quantity: Int,
    @SerializedName("price") val price: Double?,
    @SerializedName("status") val status: String,  // NEW, PENDING, FILLED, CANCELLED, REJECTED
    @SerializedName("stopPrice") val stopPrice: Double?,
    @SerializedName("limitPrice") val limitPrice: Double?,
    @SerializedName("trailAmount") val trailAmount: Double?,
    @SerializedName("trailType") val trailType: String?,  // ABSOLUTE, PERCENTAGE
    @SerializedName("currentStopPrice") val currentStopPrice: Double?,
    @SerializedName("createdAt") val createdAt: String,
    @SerializedName("updatedAt") val updatedAt: String?
)

/**
 * Order placement request
 */
data class OrderRequest(
    @SerializedName("instrumentId") val instrumentId: String,
    @SerializedName("symbol") val symbol: String,
    @SerializedName("side") val side: String,
    @SerializedName("orderType") val orderType: String,
    @SerializedName("quantity") val quantity: Int,
    @SerializedName("price") val price: Double? = null,
    @SerializedName("stopPrice") val stopPrice: Double? = null,
    @SerializedName("limitPrice") val limitPrice: Double? = null,
    @SerializedName("trailAmount") val trailAmount: Double? = null,
    @SerializedName("trailType") val trailType: String? = null,
    @SerializedName("clientOrderId") val clientOrderId: String? = null
)

/**
 * Order modification request
 */
data class ModifyOrderRequest(
    @SerializedName("quantity") val quantity: Int,
    @SerializedName("price") val price: Double?
)

/**
 * Watchlist model
 */
data class Watchlist(
    @SerializedName("id") val id: String,
    @SerializedName("userId") val userId: String,
    @SerializedName("name") val name: String,
    @SerializedName("instrumentIds") val instrumentIds: List<String>,
    @SerializedName("createdAt") val createdAt: String
)

/**
 * Create watchlist request
 */
data class CreateWatchlistRequest(
    @SerializedName("name") val name: String
)

/**
 * Add instrument to watchlist request
 */
data class AddInstrumentRequest(
    @SerializedName("instrumentId") val instrumentId: String
)

/**
 * Position model
 */
data class Position(
    @SerializedName("id") val id: String,
    @SerializedName("userId") val userId: String,
    @SerializedName("accountId") val accountId: String,
    @SerializedName("instrumentId") val instrumentId: String,
    @SerializedName("symbol") val symbol: String,
    @SerializedName("quantity") val quantity: Int,
    @SerializedName("averagePrice") val averagePrice: Double,
    @SerializedName("currentPrice") val currentPrice: Double,
    @SerializedName("pnl") val pnl: Double,
    @SerializedName("pnlPercent") val pnlPercent: Double
)

/**
 * Market status model
 */
data class MarketStatus(
    @SerializedName("exchange") val exchange: String,
    @SerializedName("status") val status: String,  // OPEN, CLOSED, PRE_MARKET, POST_MARKET
    @SerializedName("nextOpen") val nextOpen: String?,
    @SerializedName("nextClose") val nextClose: String?
)

/**
 * Batch prices request
 */
data class BatchPricesRequest(
    @SerializedName("instrumentIds") val instrumentIds: List<String>
)

// Enums for type safety
enum class OrderSide {
    BUY, SELL
}

enum class OrderType {
    MARKET, LIMIT, STOP, STOP_LIMIT, TRAILING_STOP
}

enum class OrderStatus {
    NEW, PENDING, FILLED, CANCELLED, REJECTED
}

enum class TrailType {
    ABSOLUTE, PERCENTAGE
}

enum class MarketStatusType {
    OPEN, CLOSED, PRE_MARKET, POST_MARKET
}
