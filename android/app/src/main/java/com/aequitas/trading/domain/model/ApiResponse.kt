package com.aequitas.trading.domain.model

import com.google.gson.annotations.SerializedName

/**
 * Standardized API Response wrapper
 * Matches backend format: { statusCode, data, message }
 */
data class ApiResponse<T>(
    @SerializedName("statusCode") val statusCode: Int,
    @SerializedName("data") val data: T?,
    @SerializedName("message") val message: String?
)

/**
 * Paginated response wrapper
 */
data class PaginatedResponse<T>(
    @SerializedName("items") val items: List<T>,
    @SerializedName("total") val total: Int,
    @SerializedName("page") val page: Int,
    @SerializedName("limit") val limit: Int,
    @SerializedName("totalPages") val totalPages: Int
)
