package com.aequitas.trading.data.repository

import com.aequitas.trading.data.remote.ApiService
import com.aequitas.trading.domain.model.*
import com.aequitas.trading.utils.NetworkResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for watchlist operations
 */
@Singleton
class WatchlistRepository @Inject constructor(
    private val apiService: ApiService
) {
    
    suspend fun getWatchlists(): Flow<NetworkResult<List<Watchlist>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getWatchlists()
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to fetch watchlists"))
                }
            } else {
                emit(NetworkResult.Error("Failed to fetch watchlists"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun createWatchlist(name: String): Flow<NetworkResult<Watchlist>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.createWatchlist(CreateWatchlistRequest(name))
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to create watchlist"))
                }
            } else {
                emit(NetworkResult.Error("Failed to create watchlist"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun addInstrument(watchlistId: String, instrumentId: String): Flow<NetworkResult<Watchlist>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.addInstrumentToWatchlist(
                watchlistId,
                AddInstrumentRequest(instrumentId)
            )
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to add instrument"))
                }
            } else {
                emit(NetworkResult.Error("Failed to add instrument"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun removeInstrument(watchlistId: String, instrumentId: String): Flow<NetworkResult<Watchlist>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.removeInstrumentFromWatchlist(watchlistId, instrumentId)
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to remove instrument"))
                }
            } else {
                emit(NetworkResult.Error("Failed to remove instrument"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun deleteWatchlist(watchlistId: String): Flow<NetworkResult<Unit>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.deleteWatchlist(watchlistId)
            if (response.isSuccessful) {
                emit(NetworkResult.Success(Unit))
            } else {
                emit(NetworkResult.Error("Failed to delete watchlist"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
}
