package com.aequitas.trading.data.repository

import com.aequitas.trading.data.remote.ApiService
import com.aequitas.trading.domain.model.Instrument
import com.aequitas.trading.utils.NetworkResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for instrument operations
 */
@Singleton
class InstrumentRepository @Inject constructor(
    private val apiService: ApiService
) {
    
    suspend fun getInstruments(): Flow<NetworkResult<List<Instrument>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getInstruments()
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to fetch instruments"))
                }
            } else {
                emit(NetworkResult.Error("Failed to fetch instruments"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun searchInstruments(query: String): Flow<NetworkResult<List<Instrument>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.searchInstruments(query)
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "No results found"))
                }
            } else {
                emit(NetworkResult.Error("Search failed"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun getInstrumentById(id: String): Flow<NetworkResult<Instrument>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getInstrumentById(id)
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Instrument not found"))
                }
            } else {
                emit(NetworkResult.Error("Instrument not found"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
}
