package com.aequitas.trading.presentation.trading

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aequitas.trading.data.repository.OrderRepository
import com.aequitas.trading.domain.model.Order
import com.aequitas.trading.domain.model.OrderRequest
import com.aequitas.trading.utils.Constants
import com.aequitas.trading.utils.NetworkResult
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Trade Panel (Order Placement)
 */
@HiltViewModel
class TradePanelViewModel @Inject constructor(
    private val orderRepository: OrderRepository
) : ViewModel() {
    
    private val _orderPlacementState = MutableStateFlow<NetworkResult<Order>?>(null)
    val orderPlacementState: StateFlow<NetworkResult<Order>?> = _orderPlacementState.asStateFlow()
    
    private val _orderSide = MutableStateFlow(Constants.ORDER_SIDE_BUY)
    val orderSide: StateFlow<String> = _orderSide.asStateFlow()
    
    private val _orderType = MutableStateFlow(Constants.ORDER_TYPE_MARKET)
    val orderType: StateFlow<String> = _orderType.asStateFlow()
    
    private val _quantity = MutableStateFlow("")
    val quantity: StateFlow<String> = _quantity.asStateFlow()
    
    private val _price = MutableStateFlow("")
    val price: StateFlow<String> = _price.asStateFlow()
    
    private val _stopPrice = MutableStateFlow("")
    val stopPrice: StateFlow<String> = _stopPrice.asStateFlow()
    
    private val _trailAmount = MutableStateFlow("")
    val trailAmount: StateFlow<String> = _trailAmount.asStateFlow()
    
    fun setOrderSide(side: String) {
        _orderSide.value = side
    }
    
    fun setOrderType(type: String) {
        _orderType.value = type
        // Clear fields based on order type
        when (type) {
            Constants.ORDER_TYPE_MARKET -> {
                _price.value = ""
                _stopPrice.value = ""
                _trailAmount.value = ""
            }
            Constants.ORDER_TYPE_LIMIT -> {
                _stopPrice.value = ""
                _trailAmount.value = ""
            }
            Constants.ORDER_TYPE_STOP -> {
                _price.value = ""
                _trailAmount.value = ""
            }
            Constants.ORDER_TYPE_STOP_LIMIT -> {
                _trailAmount.value = ""
            }
            Constants.ORDER_TYPE_TRAILING_STOP -> {
                _price.value = ""
                _stopPrice.value = ""
            }
        }
    }
    
    fun setQuantity(qty: String) {
        _quantity.value = qty
    }
    
    fun setPrice(p: String) {
        _price.value = p
    }
    
    fun setStopPrice(sp: String) {
        _stopPrice.value = sp
    }
    
    fun setTrailAmount(ta: String) {
        _trailAmount.value = ta
    }
    
    fun placeOrder(instrumentId: String, symbol: String) {
        val qty = _quantity.value.toIntOrNull()
        if (qty == null || qty <= 0) {
            _orderPlacementState.value = NetworkResult.Error("Invalid quantity")
            return
        }
        
        val request = OrderRequest(
            instrumentId = instrumentId,
            symbol = symbol,
            side = _orderSide.value,
            orderType = _orderType.value,
            quantity = qty,
            price = _price.value.toDoubleOrNull(),
            stopPrice = _stopPrice.value.toDoubleOrNull(),
            limitPrice = if (_orderType.value == Constants.ORDER_TYPE_STOP_LIMIT) {
                _price.value.toDoubleOrNull()
            } else null,
            trailAmount = _trailAmount.value.toDoubleOrNull(),
            trailType = if (_orderType.value == Constants.ORDER_TYPE_TRAILING_STOP) {
                "ABSOLUTE"
            } else null
        )
        
        // Validate based on order type
        when (_orderType.value) {
            Constants.ORDER_TYPE_LIMIT -> {
                if (request.price == null || request.price <= 0) {
                    _orderPlacementState.value = NetworkResult.Error("Invalid price")
                    return
                }
            }
            Constants.ORDER_TYPE_STOP -> {
                if (request.stopPrice == null || request.stopPrice <= 0) {
                    _orderPlacementState.value = NetworkResult.Error("Invalid stop price")
                    return
                }
            }
            Constants.ORDER_TYPE_STOP_LIMIT -> {
                if (request.stopPrice == null || request.limitPrice == null) {
                    _orderPlacementState.value = NetworkResult.Error("Invalid stop/limit price")
                    return
                }
            }
            Constants.ORDER_TYPE_TRAILING_STOP -> {
                if (request.trailAmount == null || request.trailAmount <= 0) {
                    _orderPlacementState.value = NetworkResult.Error("Invalid trail amount")
                    return
                }
            }
        }
        
        viewModelScope.launch {
            orderRepository.placeOrder(request).collect { result ->
                _orderPlacementState.value = result
            }
        }
    }
    
    fun clearState() {
        _orderPlacementState.value = null
    }
    
    fun resetForm() {
        _quantity.value = ""
        _price.value = ""
        _stopPrice.value = ""
        _trailAmount.value = ""
        _orderSide.value = Constants.ORDER_SIDE_BUY
        _orderType.value = Constants.ORDER_TYPE_MARKET
        _orderPlacementState.value = null
    }
}
