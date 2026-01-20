package com.aequitas.trading.data.repository

import com.aequitas.trading.data.remote.ApiService
import com.aequitas.trading.domain.model.Position
import com.aequitas.trading.utils.NetworkResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for portfolio operations
 */
@Singleton
class PortfolioRepository @Inject constructor(
    private val apiService: ApiService
) {
    
    suspend fun getPositions(): Flow<NetworkResult<List<Position>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getPositions()
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to fetch positions"))
                }
            } else {
                emit(NetworkResult.Error("Failed to fetch positions"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun getHoldings(): Flow<NetworkResult<List<Position>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getHoldings()
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to fetch holdings"))
                }
            } else {
                emit(NetworkResult.Error("Failed to fetch holdings"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
}
