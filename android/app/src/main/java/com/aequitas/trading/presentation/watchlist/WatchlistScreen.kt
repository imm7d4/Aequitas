package com.aequitas.trading.presentation.watchlist

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.aequitas.trading.presentation.theme.PriceDown
import com.aequitas.trading.presentation.theme.PriceUp
import com.aequitas.trading.utils.NetworkResult
import com.aequitas.trading.utils.formatPrice
import com.aequitas.trading.utils.getPriceChangeColor
import com.aequitas.trading.utils.toPercentage

/**
 * Watchlist Screen with real-time prices
 * Mirrors WatchlistPage.tsx from React frontend
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WatchlistScreen(
    viewModel: WatchlistViewModel = hiltViewModel()
) {
    val watchlists by viewModel.watchlists.collectAsState()
    val prices by viewModel.prices.collectAsState()
    val instruments by viewModel.instruments.collectAsState()
    
    var showCreateDialog by remember { mutableStateOf(false) }
    
    Scaffold(
        floatingActionButton = {
            FloatingActionButton(onClick = { showCreateDialog = true }) {
                Icon(Icons.Default.Add, contentDescription = "Create Watchlist")
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (watchlists) {
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
                            text = (watchlists as NetworkResult.Error).message ?: "Error loading watchlists",
                            color = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = { viewModel.loadWatchlists() }) {
                            Text("Retry")
                        }
                    }
                }
                is NetworkResult.Success -> {
                    val watchlistData = (watchlists as NetworkResult.Success).data
                    
                    if (watchlistData.isEmpty()) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(
                                text = "No Watchlists",
                                style = MaterialTheme.typography.headlineSmall
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Create your first watchlist to track instruments",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(16.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(watchlistData) { watchlist ->
                                WatchlistCard(
                                    watchlist = watchlist,
                                    prices = prices,
                                    instruments = instruments,
                                    onDelete = { viewModel.deleteWatchlist(watchlist.id) },
                                    onRemoveInstrument = { instrumentId ->
                                        viewModel.removeInstrument(watchlist.id, instrumentId)
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Create Watchlist Dialog
    if (showCreateDialog) {
        CreateWatchlistDialog(
            onDismiss = { showCreateDialog = false },
            onCreate = { name ->
                viewModel.createWatchlist(name)
                showCreateDialog = false
            }
        )
    }
}

@Composable
fun WatchlistCard(
    watchlist: com.aequitas.trading.domain.model.Watchlist,
    prices: Map<String, com.aequitas.trading.domain.model.MarketData>,
    instruments: Map<String, com.aequitas.trading.domain.model.Instrument>,
    onDelete: () -> Unit,
    onRemoveInstrument: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = watchlist.name,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
                Row {
                    IconButton(onClick = { expanded = !expanded }) {
                        Icon(
                            imageVector = if (expanded) Icons.Default.Delete else Icons.Default.Add,
                            contentDescription = if (expanded) "Collapse" else "Expand"
                        )
                    }
                    IconButton(onClick = onDelete) {
                        Icon(
                            Icons.Default.Delete,
                            contentDescription = "Delete Watchlist",
                            tint = MaterialTheme.colorScheme.error
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Instruments
            if (watchlist.instrumentIds.isEmpty()) {
                Text(
                    text = "No instruments added",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                watchlist.instrumentIds.forEach { instrumentId ->
                    val instrument = instruments[instrumentId]
                    val price = prices[instrumentId]
                    
                    InstrumentRow(
                        symbol = instrument?.symbol ?: "...",
                        name = instrument?.name ?: "Loading...",
                        price = price?.lastPrice,
                        change = price?.change,
                        changePercent = price?.changePercent,
                        onRemove = { onRemoveInstrument(instrumentId) }
                    )
                    
                    if (instrumentId != watchlist.instrumentIds.last()) {
                        Divider(modifier = Modifier.padding(vertical = 8.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun InstrumentRow(
    symbol: String,
    name: String,
    price: Double?,
    change: Double?,
    changePercent: Double?,
    onRemove: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = symbol,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Text(
                text = name,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        Column(horizontalAlignment = Alignment.End) {
            Text(
                text = price?.let { "₹${it.formatPrice()}" } ?: "...",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            if (change != null && changePercent != null) {
                Text(
                    text = "${if (change >= 0) "+" else ""}${change.formatPrice()} (${changePercent.toPercentage()})",
                    style = MaterialTheme.typography.bodySmall,
                    color = change.getPriceChangeColor()
                )
            }
        }
        
        IconButton(onClick = onRemove) {
            Icon(
                Icons.Default.Delete,
                contentDescription = "Remove",
                tint = MaterialTheme.colorScheme.error
            )
        }
    }
}

@Composable
fun CreateWatchlistDialog(
    onDismiss: () -> Unit,
    onCreate: (String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Create Watchlist") },
        text = {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Watchlist Name") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )
        },
        confirmButton = {
            TextButton(
                onClick = { if (name.isNotBlank()) onCreate(name) },
                enabled = name.isNotBlank()
            ) {
                Text("Create")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
