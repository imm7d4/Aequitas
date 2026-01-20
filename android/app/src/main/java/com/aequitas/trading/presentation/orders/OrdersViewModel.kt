package com.aequitas.trading.presentation.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aequitas.trading.data.repository.OrderRepository
import com.aequitas.trading.domain.model.Order
import com.aequitas.trading.domain.model.PaginatedResponse
import com.aequitas.trading.utils.NetworkResult
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Orders screen
 */
@HiltViewModel
class OrdersViewModel @Inject constructor(
    private val orderRepository: OrderRepository
) : ViewModel() {
    
    private val _orders = MutableStateFlow<NetworkResult<PaginatedResponse<Order>>>(NetworkResult.Loading())
    val orders: StateFlow<NetworkResult<PaginatedResponse<Order>>> = _orders.asStateFlow()
    
    private val _selectedTab = MutableStateFlow(0)
    val selectedTab: StateFlow<Int> = _selectedTab.asStateFlow()
    
    init {
        loadOrders()
    }
    
    fun loadOrders(status: String? = null) {
        viewModelScope.launch {
            orderRepository.getOrders(status = status).collect { result ->
                _orders.value = result
            }
        }
    }
    
    fun setSelectedTab(index: Int) {
        _selectedTab.value = index
        when (index) {
            0 -> loadOrders(null)  // All
            1 -> loadOrders("PENDING")
            2 -> loadOrders("FILLED")
            3 -> loadOrders("CANCELLED")
            4 -> loadOrders("REJECTED")
        }
    }
    
    fun cancelOrder(orderId: String) {
        viewModelScope.launch {
            orderRepository.cancelOrder(orderId).collect { result ->
                if (result is NetworkResult.Success) {
                    // Reload orders after cancellation
                    loadOrders()
                }
            }
        }
    }
}
