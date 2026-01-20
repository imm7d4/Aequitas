package com.aequitas.trading.data.repository

import com.aequitas.trading.data.remote.ApiService
import com.aequitas.trading.domain.model.*
import com.aequitas.trading.utils.NetworkResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for market data operations
 */
@Singleton
class MarketDataRepository @Inject constructor(
    private val apiService: ApiService
) {
    
    suspend fun getBatchPrices(instrumentIds: List<String>): Flow<NetworkResult<List<MarketData>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getBatchPrices(BatchPricesRequest(instrumentIds))
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to fetch prices"))
                }
            } else {
                emit(NetworkResult.Error("Failed to fetch prices"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun getMarketStatus(exchange: String): Flow<NetworkResult<MarketStatus>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getMarketStatus(exchange)
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to fetch market status"))
                }
            } else {
                emit(NetworkResult.Error("Failed to fetch market status"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun getCandlestickData(
        instrumentId: String,
        interval: String,
        limit: Int = 100
    ): Flow<NetworkResult<List<Candle>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getCandlestickData(instrumentId, interval, limit)
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to fetch candle data"))
                }
            } else {
                emit(NetworkResult.Error("Failed to fetch candle data"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
}
