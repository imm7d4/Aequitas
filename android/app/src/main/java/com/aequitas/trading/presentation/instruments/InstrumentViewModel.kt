package com.aequitas.trading.presentation.instruments

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aequitas.trading.data.repository.InstrumentRepository
import com.aequitas.trading.data.repository.MarketDataRepository
import com.aequitas.trading.domain.model.Instrument
import com.aequitas.trading.domain.model.MarketData
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
 * ViewModel for Instruments screen
 */
@HiltViewModel
class InstrumentViewModel @Inject constructor(
    private val instrumentRepository: InstrumentRepository,
    private val marketDataRepository: MarketDataRepository
) : ViewModel() {
    
    private val _instruments = MutableStateFlow<NetworkResult<List<Instrument>>>(NetworkResult.Loading())
    val instruments: StateFlow<NetworkResult<List<Instrument>>> = _instruments.asStateFlow()
    
    private val _searchResults = MutableStateFlow<List<Instrument>>(emptyList())
    val searchResults: StateFlow<List<Instrument>> = _searchResults.asStateFlow()
    
    private val _prices = MutableStateFlow<Map<String, MarketData>>(emptyMap())
    val prices: StateFlow<Map<String, MarketData>> = _prices.asStateFlow()
    
    private val _selectedInstrument = MutableStateFlow<NetworkResult<Instrument>?>(null)
    val selectedInstrument: StateFlow<NetworkResult<Instrument>?> = _selectedInstrument.asStateFlow()
    
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()
    
    private var searchJob: Job? = null
    
    init {
        loadInstruments()
    }
    
    fun loadInstruments() {
        viewModelScope.launch {
            instrumentRepository.getInstruments().collect { result ->
                _instruments.value = result
                
                // Load prices for all instruments
                if (result is NetworkResult.Success) {
                    val instrumentIds = result.data.map { it.id }
                    loadPrices(instrumentIds)
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
    
    fun searchInstruments(query: String) {
        _searchQuery.value = query
        
        // Cancel previous search job
        searchJob?.cancel()
        
        if (query.isBlank()) {
            _searchResults.value = emptyList()
            return
        }
        
        // Debounce search (300ms)
        searchJob = viewModelScope.launch {
            delay(300)
            instrumentRepository.searchInstruments(query).collect { result ->
                if (result is NetworkResult.Success) {
                    _searchResults.value = result.data
                    
                    // Load prices for search results
                    val instrumentIds = result.data.map { it.id }
                    if (instrumentIds.isNotEmpty()) {
                        loadPrices(instrumentIds)
                    }
                }
            }
        }
    }
    
    fun loadInstrumentDetail(instrumentId: String) {
        viewModelScope.launch {
            _selectedInstrument.value = NetworkResult.Loading()
            instrumentRepository.getInstrumentById(instrumentId).collect { result ->
                _selectedInstrument.value = result
                
                // Load price for this instrument
                if (result is NetworkResult.Success) {
                    loadPrices(listOf(instrumentId))
                }
            }
        }
    }
    
    fun clearSearch() {
        _searchQuery.value = ""
        _searchResults.value = emptyList()
    }
}
