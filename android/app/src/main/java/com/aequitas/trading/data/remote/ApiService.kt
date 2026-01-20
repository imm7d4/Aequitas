package com.aequitas.trading.data.remote

import com.aequitas.trading.domain.model.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Retrofit API Service defining all backend endpoints
 * Mirrors the backend API structure from backend/README.md
 */
interface ApiService {
    
    // ==================== Authentication ====================
    
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<ApiResponse<AuthResponse>>
    
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<ApiResponse<AuthResponse>>
    
    // ==================== Instruments ====================
    
    @GET("instruments")
    suspend fun getInstruments(): Response<ApiResponse<List<Instrument>>>
    
    @GET("instruments/search")
    suspend fun searchInstruments(@Query("q") query: String): Response<ApiResponse<List<Instrument>>>
    
    @GET("instruments/{id}")
    suspend fun getInstrumentById(@Path("id") id: String): Response<ApiResponse<Instrument>>
    
    // ==================== Market Data ====================
    
    @GET("market/status/{exchange}")
    suspend fun getMarketStatus(@Path("exchange") exchange: String): Response<ApiResponse<MarketStatus>>
    
    @POST("market/prices")
    suspend fun getBatchPrices(@Body request: BatchPricesRequest): Response<ApiResponse<List<MarketData>>>
    
    @GET("market/candles/{instrumentId}")
    suspend fun getCandlestickData(
        @Path("instrumentId") instrumentId: String,
        @Query("interval") interval: String,
        @Query("limit") limit: Int = 100
    ): Response<ApiResponse<List<Candle>>>
    
    // ==================== Orders ====================
    
    @POST("orders")
    suspend fun placeOrder(@Body request: OrderRequest): Response<ApiResponse<Order>>
    
    @GET("orders")
    suspend fun getOrders(
        @Query("status") status: String? = null,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<ApiResponse<PaginatedResponse<Order>>>
    
    @GET("orders/{id}")
    suspend fun getOrderById(@Path("id") id: String): Response<ApiResponse<Order>>
    
    @PUT("orders/{id}")
    suspend fun modifyOrder(
        @Path("id") id: String,
        @Body request: ModifyOrderRequest
    ): Response<ApiResponse<Order>>
    
    @DELETE("orders/{id}")
    suspend fun cancelOrder(@Path("id") id: String): Response<ApiResponse<Unit>>
    
    // ==================== Watchlist ====================
    
    @GET("watchlists")
    suspend fun getWatchlists(): Response<ApiResponse<List<Watchlist>>>
    
    @POST("watchlists")
    suspend fun createWatchlist(@Body request: CreateWatchlistRequest): Response<ApiResponse<Watchlist>>
    
    @POST("watchlists/{id}/instruments")
    suspend fun addInstrumentToWatchlist(
        @Path("id") watchlistId: String,
        @Body request: AddInstrumentRequest
    ): Response<ApiResponse<Watchlist>>
    
    @DELETE("watchlists/{watchlistId}/instruments/{instrumentId}")
    suspend fun removeInstrumentFromWatchlist(
        @Path("watchlistId") watchlistId: String,
        @Path("instrumentId") instrumentId: String
    ): Response<ApiResponse<Watchlist>>
    
    @DELETE("watchlists/{id}")
    suspend fun deleteWatchlist(@Path("id") id: String): Response<ApiResponse<Unit>>
    
    // ==================== Portfolio ====================
    
    @GET("portfolio/positions")
    suspend fun getPositions(): Response<ApiResponse<List<Position>>>
    
    @GET("portfolio/holdings")
    suspend fun getHoldings(): Response<ApiResponse<List<Position>>>
    
    // ==================== Profile ====================
    
    @GET("profile")
    suspend fun getProfile(): Response<ApiResponse<User>>
    
    @PUT("profile")
    suspend fun updateProfile(@Body user: User): Response<ApiResponse<User>>
    
    @PUT("profile/password")
    suspend fun changePassword(
        @Body request: Map<String, String>
    ): Response<ApiResponse<Unit>>
}
