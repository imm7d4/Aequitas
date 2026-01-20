package com.aequitas.trading.presentation.watchlist

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aequitas.trading.data.repository.InstrumentRepository
import com.aequitas.trading.data.repository.MarketDataRepository
import com.aequitas.trading.data.repository.WatchlistRepository
import com.aequitas.trading.domain.model.Instrument
import com.aequitas.trading.domain.model.MarketData
import com.aequitas.trading.domain.model.Watchlist
import com.aequitas.trading.utils.Constants
import com.aequitas.trading.utils.NetworkResult
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Watchlist screen
 */
@HiltViewModel
class WatchlistViewModel @Inject constructor(
    private val watchlistRepository: WatchlistRepository,
    private val marketDataRepository: MarketDataRepository,
    private val instrumentRepository: InstrumentRepository
) : ViewModel() {
    
    private val _watchlists = MutableStateFlow<NetworkResult<List<Watchlist>>>(NetworkResult.Loading())
    val watchlists: StateFlow<NetworkResult<List<Watchlist>>> = _watchlists.asStateFlow()
    
    private val _prices = MutableStateFlow<Map<String, MarketData>>(emptyMap())
    val prices: StateFlow<Map<String, MarketData>> = _prices.asStateFlow()
    
    private val _instruments = MutableStateFlow<Map<String, Instrument>>(emptyMap())
    val instruments: StateFlow<Map<String, Instrument>> = _instruments.asStateFlow()
    
    private var priceUpdateJob: Job? = null
    
    init {
        loadWatchlists()
        startPriceUpdates()
    }
    
    fun loadWatchlists() {
        viewModelScope.launch {
            watchlistRepository.getWatchlists().collect { result ->
                _watchlists.value = result
                
                // Load instruments and prices for watchlists
                if (result is NetworkResult.Success) {
                    val allInstrumentIds = result.data.flatMap { it.instrumentIds }.distinct()
                    if (allInstrumentIds.isNotEmpty()) {
                        loadInstruments(allInstrumentIds)
                        loadPrices(allInstrumentIds)
                    }
                }
            }
        }
    }
    
    private fun loadInstruments(instrumentIds: List<String>) {
        viewModelScope.launch {
            // Fetch instruments by IDs (in a real app, you'd have a batch endpoint)
            instrumentIds.forEach { id ->
                instrumentRepository.getInstrumentById(id).collect { result ->
                    if (result is NetworkResult.Success) {
                        _instruments.value = _instruments.value + (id to result.data)
                    }
                }
            }
        }
    }
    
    private fun loadPrices(instrumentIds: List<String>) {
        viewModelScope.launch {
            marketDataRepository.getBatchPrices(instrumentIds).collect { result ->
                if (result is NetworkResult.Success) {
                    val priceMap = result.data.associateBy { it.instrumentId }
                    _prices.value = priceMap
                }
            }
        }
    }
    
    private fun startPriceUpdates() {
        priceUpdateJob?.cancel()
        priceUpdateJob = viewModelScope.launch {
            while (true) {
                delay(Constants.PRICE_UPDATE_INTERVAL)
                val currentWatchlists = _watchlists.value
                if (currentWatchlists is NetworkResult.Success) {
                    val allInstrumentIds = currentWatchlists.data.flatMap { it.instrumentIds }.distinct()
                    if (allInstrumentIds.isNotEmpty()) {
                        loadPrices(allInstrumentIds)
                    }
                }
            }
        }
    }
    
    fun createWatchlist(name: String) {
        viewModelScope.launch {
            watchlistRepository.createWatchlist(name).collect { result ->
                if (result is NetworkResult.Success) {
                    loadWatchlists()
                }
            }
        }
    }
    
    fun deleteWatchlist(watchlistId: String) {
        viewModelScope.launch {
            watchlistRepository.deleteWatchlist(watchlistId).collect { result ->
                if (result is NetworkResult.Success) {
                    loadWatchlists()
                }
            }
        }
    }
    
    fun removeInstrument(watchlistId: String, instrumentId: String) {
        viewModelScope.launch {
            watchlistRepository.removeInstrument(watchlistId, instrumentId).collect { result ->
                if (result is NetworkResult.Success) {
                    loadWatchlists()
                }
            }
        }
    }
    
    override fun onCleared() {
        super.onCleared()
        priceUpdateJob?.cancel()
    }
}
