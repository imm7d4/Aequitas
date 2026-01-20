package com.aequitas.trading.presentation.instruments

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.aequitas.trading.utils.NetworkResult
import com.aequitas.trading.utils.formatPrice
import com.aequitas.trading.utils.getPriceChangeColor
import com.aequitas.trading.utils.toPercentage

/**
 * Instrument Detail Screen
 * Shows detailed information about a single instrument
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InstrumentDetailScreen(
    instrumentId: String,
    onNavigateBack: () -> Unit,
    onTrade: (String) -> Unit,
    viewModel: InstrumentViewModel = hiltViewModel(),
    chartViewModel: ChartViewModel = hiltViewModel()
) {
    val selectedInstrument by viewModel.selectedInstrument.collectAsState()
    val prices by viewModel.prices.collectAsState()
    val candles by chartViewModel.candles.collectAsState()
    val selectedInterval by chartViewModel.selectedInterval.collectAsState()
    
    var showTradePanel by remember { mutableStateOf(false) }
    
    LaunchedEffect(instrumentId) {
        viewModel.loadInstrumentDetail(instrumentId)
        chartViewModel.loadCandles(instrumentId)
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Instrument Details") },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (selectedInstrument) {
                is NetworkResult.Loading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                is NetworkResult.Error -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = (selectedInstrument as NetworkResult.Error).message ?: "Error loading instrument",
                            color = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = { viewModel.loadInstrumentDetail(instrumentId) }) {
                            Text("Retry")
                        }
                    }
                }
                is NetworkResult.Success -> {
                    val instrument = (selectedInstrument as NetworkResult.Success).data
                    val price = prices[instrument.id]
                    
                    androidx.compose.foundation.lazy.LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Header Card
                        item {
                            Card(
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(
                                    modifier = Modifier.padding(16.dp)
                                ) {
                                    Text(
                                        text = instrument.symbol,
                                        style = MaterialTheme.typography.headlineMedium,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = instrument.name,
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    
                                    Spacer(modifier = Modifier.height(16.dp))
                                    
                                    if (price != null) {
                                        Text(
                                            text = "₹${price.lastPrice.formatPrice()}",
                                            style = MaterialTheme.typography.displaySmall,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Text(
                                            text = "${if (price.change >= 0) "+" else ""}${price.change.formatPrice()} (${price.changePercent.toPercentage()})",
                                            style = MaterialTheme.typography.titleMedium,
                                            color = price.change.getPriceChangeColor()
                                        )
                                    }
                                }
                            }
                        }
                        
                        // Chart Card
                        item {
                            Card(
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column {
                                    // Interval selector
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(16.dp),
                                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                                    ) {
                                        val intervals = listOf(
                                            com.aequitas.trading.utils.Constants.INTERVAL_1M to "1m",
                                            com.aequitas.trading.utils.Constants.INTERVAL_5M to "5m",
                                            com.aequitas.trading.utils.Constants.INTERVAL_1H to "1h",
                                            com.aequitas.trading.utils.Constants.INTERVAL_1D to "1d"
                                        )
                                        intervals.forEach { (interval, label) ->
                                            FilterChip(
                                                selected = selectedInterval == interval,
                                                onClick = { chartViewModel.changeInterval(instrumentId, interval) },
                                                label = { Text(label) }
                                            )
                                        }
                                    }
                                    
                                    // Chart
                                    when (candles) {
                                        is NetworkResult.Success -> {
                                            com.aequitas.trading.presentation.components.StockChart(
                                                candles = (candles as NetworkResult.Success).data,
                                                currentPrice = price?.lastPrice,
                                                modifier = Modifier.fillMaxWidth()
                                            )
                                        }
                                        is NetworkResult.Loading -> {
                                            Box(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .height(300.dp),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                CircularProgressIndicator()
                                            }
                                        }
                                        is NetworkResult.Error -> {
                                            Box(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .height(300.dp),
                                                contentAlignment = Alignment.Center
                                            ) {
                                                Text(
                                                    text = "Chart unavailable",
                                                    color = MaterialTheme.colorScheme.error
                                                )
                                            }
                                        }
                                        null -> {}
                                    }
                                }
                            }
                        }
                        
                        // Details Card
                        item {
                            Card(
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(
                                    modifier = Modifier.padding(16.dp)
                                ) {
                                    Text(
                                        text = "Details",
                                        style = MaterialTheme.typography.titleLarge,
                                        fontWeight = FontWeight.Bold
                                    )
                                    
                                    Spacer(modifier = Modifier.height(16.dp))
                                    
                                    DetailRow("ISIN", instrument.isin)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    DetailRow("Exchange", instrument.exchange)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    DetailRow("Sector", instrument.sector)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    DetailRow("Type", instrument.instrumentType)
                                    
                                    if (price != null) {
                                        Spacer(modifier = Modifier.height(16.dp))
                                        Divider()
                                        Spacer(modifier = Modifier.height(16.dp))
                                        
                                        Text(
                                            text = "Today's Range",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.SemiBold
                                        )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        DetailRow("Open", "₹${price.open.formatPrice()}")
                                        Spacer(modifier = Modifier.height(8.dp))
                                        DetailRow("High", "₹${price.high.formatPrice()}")
                                        Spacer(modifier = Modifier.height(8.dp))
                                        DetailRow("Low", "₹${price.low.formatPrice()}")
                                        Spacer(modifier = Modifier.height(8.dp))
                                        DetailRow("Volume", price.volume.toString())
                                    }
                                }
                            }
                        }
                        
                        // Action Buttons
                        item {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                Button(
                                    onClick = { showTradePanel = true },
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(Icons.Default.ShoppingCart, contentDescription = null)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Trade")
                                }
                                
                                OutlinedButton(
                                    onClick = { /* Add to watchlist */ },
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Icon(Icons.Default.Star, contentDescription = null)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text("Watchlist")
                                }
                            }
                        }
                    }
                }
                null -> {
                    // Initial state
                }
            }
        }
    }
    
    // Trade Panel Bottom Sheet
    if (showTradePanel && selectedInstrument is NetworkResult.Success) {
        val instrument = (selectedInstrument as NetworkResult.Success).data
        val price = prices[instrument.id]
        
        com.aequitas.trading.presentation.trading.TradePanelBottomSheet(
            instrumentId = instrument.id,
            symbol = instrument.symbol,
            currentPrice = price?.lastPrice ?: 0.0,
            onDismiss = { showTradePanel = false },
            onOrderPlaced = {
                showTradePanel = false
                // Optionally navigate to orders screen
            }
        )
    }
}

@Composable
fun DetailRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Medium
        )
    }
}
