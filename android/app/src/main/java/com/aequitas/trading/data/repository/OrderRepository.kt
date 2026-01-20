package com.aequitas.trading.data.repository

import com.aequitas.trading.data.remote.ApiService
import com.aequitas.trading.domain.model.*
import com.aequitas.trading.utils.NetworkResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for order operations
 */
@Singleton
class OrderRepository @Inject constructor(
    private val apiService: ApiService
) {
    
    suspend fun placeOrder(request: OrderRequest): Flow<NetworkResult<Order>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.placeOrder(request)
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to place order"))
                }
            } else {
                emit(NetworkResult.Error("Failed to place order"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun getOrders(
        status: String? = null,
        page: Int = 1,
        limit: Int = 20
    ): Flow<NetworkResult<PaginatedResponse<Order>>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getOrders(status, page, limit)
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to fetch orders"))
                }
            } else {
                emit(NetworkResult.Error("Failed to fetch orders"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun getOrderById(id: String): Flow<NetworkResult<Order>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.getOrderById(id)
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Order not found"))
                }
            } else {
                emit(NetworkResult.Error("Order not found"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun modifyOrder(id: String, quantity: Int, price: Double?): Flow<NetworkResult<Order>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.modifyOrder(id, ModifyOrderRequest(quantity, price))
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Failed to modify order"))
                }
            } else {
                emit(NetworkResult.Error("Failed to modify order"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun cancelOrder(id: String): Flow<NetworkResult<Unit>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.cancelOrder(id)
            if (response.isSuccessful) {
                emit(NetworkResult.Success(Unit))
            } else {
                emit(NetworkResult.Error("Failed to cancel order"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
}
