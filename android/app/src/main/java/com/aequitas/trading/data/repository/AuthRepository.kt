package com.aequitas.trading.data.repository

import com.aequitas.trading.data.local.PreferencesManager
import com.aequitas.trading.data.remote.ApiService
import com.aequitas.trading.domain.model.AuthResponse
import com.aequitas.trading.domain.model.LoginRequest
import com.aequitas.trading.domain.model.RegisterRequest
import com.aequitas.trading.utils.NetworkResult
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Repository for authentication operations
 */
@Singleton
class AuthRepository @Inject constructor(
    private val apiService: ApiService,
    private val preferencesManager: PreferencesManager
) {
    
    suspend fun login(email: String, password: String): Flow<NetworkResult<AuthResponse>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.login(LoginRequest(email, password))
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    // Save token and user data
                    preferencesManager.saveAuthToken(apiResponse.data.token)
                    preferencesManager.saveUserId(apiResponse.data.user.id)
                    preferencesManager.saveUserEmail(apiResponse.data.user.email)
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Login failed"))
                }
            } else {
                emit(NetworkResult.Error("Invalid credentials"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun register(email: String, password: String): Flow<NetworkResult<AuthResponse>> = flow {
        emit(NetworkResult.Loading())
        try {
            val response = apiService.register(RegisterRequest(email, password))
            if (response.isSuccessful && response.body() != null) {
                val apiResponse = response.body()!!
                if (apiResponse.data != null) {
                    // Save token and user data
                    preferencesManager.saveAuthToken(apiResponse.data.token)
                    preferencesManager.saveUserId(apiResponse.data.user.id)
                    preferencesManager.saveUserEmail(apiResponse.data.user.email)
                    emit(NetworkResult.Success(apiResponse.data))
                } else {
                    emit(NetworkResult.Error(apiResponse.message ?: "Registration failed"))
                }
            } else {
                emit(NetworkResult.Error("Registration failed"))
            }
        } catch (e: Exception) {
            emit(NetworkResult.Error(e.message ?: "Network error"))
        }
    }
    
    suspend fun logout() {
        preferencesManager.clearAll()
    }
    
    fun isLoggedIn(): Flow<Boolean> = flow {
        preferencesManager.authToken.collect { token ->
            emit(!token.isNullOrEmpty())
        }
    }
}
