package com.aequitas.trading.presentation.portfolio

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aequitas.trading.data.repository.PortfolioRepository
import com.aequitas.trading.domain.model.Position
import com.aequitas.trading.utils.NetworkResult
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

/**
 * ViewModel for Portfolio screen
 */
@HiltViewModel
class PortfolioViewModel @Inject constructor(
    private val portfolioRepository: PortfolioRepository
) : ViewModel() {
    
    private val _holdings = MutableStateFlow<NetworkResult<List<Position>>>(NetworkResult.Loading())
    val holdings: StateFlow<NetworkResult<List<Position>>> = _holdings.asStateFlow()
    
    init {
        loadHoldings()
    }
    
    fun loadHoldings() {
        viewModelScope.launch {
            portfolioRepository.getHoldings().collect { result ->
                _holdings.value = result
            }
        }
    }
}
