package com.aequitas.trading.presentation.instruments

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.aequitas.trading.domain.model.Instrument
import com.aequitas.trading.utils.NetworkResult
import com.aequitas.trading.utils.formatPrice
import com.aequitas.trading.utils.getPriceChangeColor
import com.aequitas.trading.utils.toPercentage

/**
 * Instrument List Screen
 * Browse and search all instruments
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun InstrumentListScreen(
    onInstrumentClick: (String) -> Unit,
    viewModel: InstrumentViewModel = hiltViewModel()
) {
    val instruments by viewModel.instruments.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val searchResults by viewModel.searchResults.collectAsState()
    val prices by viewModel.prices.collectAsState()
    
    var showSearch by remember { mutableStateOf(false) }
    
    Scaffold(
        topBar = {
            if (showSearch) {
                SearchBar(
                    query = searchQuery,
                    onQueryChange = { viewModel.searchInstruments(it) },
                    onClose = {
                        showSearch = false
                        viewModel.clearSearch()
                    }
                )
            } else {
                TopAppBar(
                    title = { Text("Instruments") },
                    actions = {
                        IconButton(onClick = { showSearch = true }) {
                            Icon(Icons.Default.Search, contentDescription = "Search")
                        }
                    }
                )
            }
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Show search results if searching, otherwise show all instruments
            val displayList = if (searchQuery.isNotBlank()) searchResults else {
                when (instruments) {
                    is NetworkResult.Success -> (instruments as NetworkResult.Success).data
                    else -> emptyList()
                }
            }
            
            when {
                instruments is NetworkResult.Loading && searchQuery.isBlank() -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
                instruments is NetworkResult.Error && searchQuery.isBlank() -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = (instruments as NetworkResult.Error).message ?: "Error loading instruments",
                            color = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(onClick = { viewModel.loadInstruments() }) {
                            Text("Retry")
                        }
                    }
                }
                displayList.isEmpty() && searchQuery.isNotBlank() -> {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = "No results found for \"$searchQuery\"",
                            style = MaterialTheme.typography.bodyLarge
                        )
                    }
                }
                else -> {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(displayList) { instrument ->
                            InstrumentListItem(
                                instrument = instrument,
                                price = prices[instrument.id],
                                onClick = { onInstrumentClick(instrument.id) }
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    onClose: () -> Unit
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        placeholder = { Text("Search instruments...") },
        leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
        trailingIcon = {
            if (query.isNotEmpty()) {
                TextButton(onClick = onClose) {
                    Text("Cancel")
                }
            }
        },
        singleLine = true
    )
}

@Composable
fun InstrumentListItem(
    instrument: Instrument,
    price: com.aequitas.trading.domain.model.MarketData?,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = instrument.symbol,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = instrument.name,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Chip(text = instrument.exchange)
                    Chip(text = instrument.sector)
                }
            }
            
            if (price != null) {
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = "₹${price.lastPrice.formatPrice()}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${if (price.change >= 0) "+" else ""}${price.change.formatPrice()} (${price.changePercent.toPercentage()})",
                        style = MaterialTheme.typography.bodySmall,
                        color = price.change.getPriceChangeColor()
                    )
                }
            }
        }
    }
}

@Composable
fun Chip(text: String) {
    Surface(
        color = MaterialTheme.colorScheme.secondaryContainer,
        shape = MaterialTheme.shapes.small
    ) {
        Text(
            text = text,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSecondaryContainer
        )
    }
}
