package com.aequitas.trading.presentation.instruments

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aequitas.trading.data.repository.MarketDataRepository
import com.aequitas.trading.domain.model.Candle
import com.aequitas.trading.utils.Constants
import com.aequitas.trading.utils.NetworkResult
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Chart functionality
 */
@HiltViewModel
class ChartViewModel @Inject constructor(
    private val marketDataRepository: MarketDataRepository
) : ViewModel() {
    
    private val _candles = MutableStateFlow<NetworkResult<List<Candle>>>(NetworkResult.Loading())
    val candles: StateFlow<NetworkResult<List<Candle>>> = _candles.asStateFlow()
    
    private val _selectedInterval = MutableStateFlow(Constants.INTERVAL_1D)
    val selectedInterval: StateFlow<String> = _selectedInterval.asStateFlow()
    
    fun loadCandles(instrumentId: String, interval: String = Constants.INTERVAL_1D) {
        _selectedInterval.value = interval
        viewModelScope.launch {
            marketDataRepository.getCandlestickData(instrumentId, interval).collect { result ->
                _candles.value = result
            }
        }
    }
    
    fun changeInterval(instrumentId: String, interval: String) {
        loadCandles(instrumentId, interval)
    }
}
