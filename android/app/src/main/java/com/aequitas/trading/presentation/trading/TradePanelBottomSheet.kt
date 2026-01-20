package com.aequitas.trading.presentation.trading

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.aequitas.trading.presentation.theme.PriceDown
import com.aequitas.trading.presentation.theme.PriceUp
import com.aequitas.trading.utils.Constants
import com.aequitas.trading.utils.NetworkResult
import com.aequitas.trading.utils.formatPrice

/**
 * Trade Panel Bottom Sheet
 * Order placement UI for all order types
 * Mirrors TradePanel.tsx from React frontend
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TradePanelBottomSheet(
    instrumentId: String,
    symbol: String,
    currentPrice: Double,
    onDismiss: () -> Unit,
    onOrderPlaced: () -> Unit,
    viewModel: TradePanelViewModel = hiltViewModel()
) {
    val orderSide by viewModel.orderSide.collectAsState()
    val orderType by viewModel.orderType.collectAsState()
    val quantity by viewModel.quantity.collectAsState()
    val price by viewModel.price.collectAsState()
    val stopPrice by viewModel.stopPrice.collectAsState()
    val trailAmount by viewModel.trailAmount.collectAsState()
    val orderPlacementState by viewModel.orderPlacementState.collectAsState()
    
    // Handle order placement success
    LaunchedEffect(orderPlacementState) {
        if (orderPlacementState is NetworkResult.Success) {
            onOrderPlaced()
            viewModel.resetForm()
            onDismiss()
        }
    }
    
    ModalBottomSheet(
        onDismissRequest = {
            viewModel.resetForm()
            onDismiss()
        }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
                .padding(bottom = 32.dp)
        ) {
            // Header
            Text(
                text = "Place Order - $symbol",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Current Price: ₹${currentPrice.formatPrice()}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Buy/Sell Toggle
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = { viewModel.setOrderSide(Constants.ORDER_SIDE_BUY) },
                    modifier = Modifier.weight(1f),
                    colors = if (orderSide == Constants.ORDER_SIDE_BUY) {
                        ButtonDefaults.buttonColors(containerColor = PriceUp)
                    } else {
                        ButtonDefaults.outlinedButtonColors()
                    }
                ) {
                    Text("BUY")
                }
                Button(
                    onClick = { viewModel.setOrderSide(Constants.ORDER_SIDE_SELL) },
                    modifier = Modifier.weight(1f),
                    colors = if (orderSide == Constants.ORDER_SIDE_SELL) {
                        ButtonDefaults.buttonColors(containerColor = PriceDown)
                    } else {
                        ButtonDefaults.outlinedButtonColors()
                    }
                ) {
                    Text("SELL")
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Order Type Dropdown
            var expanded by remember { mutableStateOf(false) }
            val orderTypes = listOf(
                Constants.ORDER_TYPE_MARKET to "Market",
                Constants.ORDER_TYPE_LIMIT to "Limit",
                Constants.ORDER_TYPE_STOP to "Stop",
                Constants.ORDER_TYPE_STOP_LIMIT to "Stop Limit",
                Constants.ORDER_TYPE_TRAILING_STOP to "Trailing Stop"
            )
            
            ExposedDropdownMenuBox(
                expanded = expanded,
                onExpandedChange = { expanded = !expanded }
            ) {
                OutlinedTextField(
                    value = orderTypes.find { it.first == orderType }?.second ?: "Market",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Order Type") },
                    trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false }
                ) {
                    orderTypes.forEach { (type, label) ->
                        DropdownMenuItem(
                            text = { Text(label) },
                            onClick = {
                                viewModel.setOrderType(type)
                                expanded = false
                            }
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Quantity
            OutlinedTextField(
                value = quantity,
                onValueChange = { viewModel.setQuantity(it) },
                label = { Text("Quantity") },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                modifier = Modifier.fillMaxWidth()
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Price (for LIMIT and STOP_LIMIT orders)
            if (orderType == Constants.ORDER_TYPE_LIMIT || orderType == Constants.ORDER_TYPE_STOP_LIMIT) {
                OutlinedTextField(
                    value = price,
                    onValueChange = { viewModel.setPrice(it) },
                    label = { Text(if (orderType == Constants.ORDER_TYPE_STOP_LIMIT) "Limit Price" else "Price") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(12.dp))
            }
            
            // Stop Price (for STOP and STOP_LIMIT orders)
            if (orderType == Constants.ORDER_TYPE_STOP || orderType == Constants.ORDER_TYPE_STOP_LIMIT) {
                OutlinedTextField(
                    value = stopPrice,
                    onValueChange = { viewModel.setStopPrice(it) },
                    label = { Text("Stop Price") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(12.dp))
            }
            
            // Trail Amount (for TRAILING_STOP orders)
            if (orderType == Constants.ORDER_TYPE_TRAILING_STOP) {
                OutlinedTextField(
                    value = trailAmount,
                    onValueChange = { viewModel.setTrailAmount(it) },
                    label = { Text("Trail Amount (₹)") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.fillMaxWidth(),
                    supportingText = { Text("Absolute amount to trail") }
                )
                Spacer(modifier = Modifier.height(12.dp))
            }
            
            // Order Summary
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        text = "Order Summary",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.SemiBold
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    val qty = quantity.toIntOrNull() ?: 0
                    val estimatedPrice = when (orderType) {
                        Constants.ORDER_TYPE_MARKET -> currentPrice
                        Constants.ORDER_TYPE_LIMIT -> price.toDoubleOrNull() ?: currentPrice
                        else -> currentPrice
                    }
                    val estimatedValue = qty * estimatedPrice
                    
                    SummaryRow("Quantity", qty.toString())
                    SummaryRow("Estimated Price", "₹${estimatedPrice.formatPrice()}")
                    Divider(modifier = Modifier.padding(vertical = 4.dp))
                    SummaryRow(
                        "Estimated Value",
                        "₹${estimatedValue.formatPrice()}",
                        bold = true
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Error Message
            if (orderPlacementState is NetworkResult.Error) {
                Text(
                    text = (orderPlacementState as NetworkResult.Error).message ?: "Order placement failed",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodyMedium
                )
                Spacer(modifier = Modifier.height(12.dp))
            }
            
            // Place Order Button
            Button(
                onClick = { viewModel.placeOrder(instrumentId, symbol) },
                modifier = Modifier.fillMaxWidth(),
                enabled = orderPlacementState !is NetworkResult.Loading,
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (orderSide == Constants.ORDER_SIDE_BUY) PriceUp else PriceDown
                )
            ) {
                if (orderPlacementState is NetworkResult.Loading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text("Place ${orderSide.uppercase()} Order")
                }
            }
        }
    }
}

@Composable
fun SummaryRow(label: String, value: String, bold: Boolean = false) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal
        )
        Text(
            text = value,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = if (bold) FontWeight.Bold else FontWeight.Normal
        )
    }
}
