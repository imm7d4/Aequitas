package com.aequitas.trading.presentation.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.aequitas.trading.domain.model.Candle
import com.patrykandpatrick.vico.compose.axis.horizontal.rememberBottomAxis
import com.patrykandpatrick.vico.compose.axis.vertical.rememberStartAxis
import com.patrykandpatrick.vico.compose.chart.Chart
import com.patrykandpatrick.vico.compose.chart.column.columnChart
import com.patrykandpatrick.vico.compose.chart.line.lineChart
import com.patrykandpatrick.vico.compose.style.ProvideChartStyle
import com.patrykandpatrick.vico.core.entry.ChartEntryModelProducer
import com.patrykandpatrick.vico.core.entry.FloatEntry

/**
 * Stock Chart Component using Vico
 * Displays candlestick-style chart with real-time updates
 * Mirrors StockChart.tsx from React frontend
 */
@Composable
fun StockChart(
    candles: List<Candle>,
    currentPrice: Double?,
    modifier: Modifier = Modifier
) {
    if (candles.isEmpty()) {
        Box(
            modifier = modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "No chart data available",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        return
    }
    
    // Convert candles to chart entries
    val chartEntryModel = remember(candles) {
        val entries = candles.mapIndexed { index, candle ->
            FloatEntry(index.toFloat(), candle.close.toFloat())
        }
        ChartEntryModelProducer(entries)
    }
    
    Column(modifier = modifier) {
        // Chart Header
        if (currentPrice != null) {
            val lastCandle = candles.lastOrNull()
            val change = if (lastCandle != null) {
                currentPrice - lastCandle.open
            } else 0.0
            val changePercent = if (lastCandle != null && lastCandle.open > 0) {
                (change / lastCandle.open) * 100
            } else 0.0
            
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "₹%.2f".format(currentPrice),
                        style = MaterialTheme.typography.headlineSmall,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "%+.2f (%.2f%%)".format(change, changePercent),
                        style = MaterialTheme.typography.bodyMedium,
                        color = if (change >= 0) {
                            com.aequitas.trading.presentation.theme.PriceUp
                        } else {
                            com.aequitas.trading.presentation.theme.PriceDown
                        }
                    )
                }
            }
        }
        
        // Simple Line Chart (Vico doesn't have built-in candlestick, so we use line chart)
        ProvideChartStyle {
            Chart(
                chart = lineChart(),
                model = chartEntryModel.getModel(),
                startAxis = rememberStartAxis(),
                bottomAxis = rememberBottomAxis(),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(300.dp)
                    .padding(horizontal = 16.dp)
            )
        }
        
        // Chart Info
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            val lastCandle = candles.lastOrNull()
            if (lastCandle != null) {
                ChartInfoItem("O", lastCandle.open)
                ChartInfoItem("H", lastCandle.high)
                ChartInfoItem("L", lastCandle.low)
                ChartInfoItem("C", lastCandle.close)
                ChartInfoItem("V", lastCandle.volume.toDouble(), isVolume = true)
            }
        }
    }
}

@Composable
fun ChartInfoItem(label: String, value: Double, isVolume: Boolean = false) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = if (isVolume) {
                "%.0f".format(value)
            } else {
                "%.2f".format(value)
            },
            style = MaterialTheme.typography.bodyMedium
        )
    }
}

/**
 * Simplified candlestick chart using custom drawing
 * This is a basic implementation - for production, consider using a dedicated charting library
 */
@Composable
fun SimpleCandlestickChart(
    candles: List<Candle>,
    modifier: Modifier = Modifier
) {
    if (candles.isEmpty()) {
        Box(
            modifier = modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            CircularProgressIndicator()
        }
        return
    }
    
    // For now, use the line chart above
    // A full candlestick implementation would require custom Canvas drawing
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Candlestick chart - ${candles.size} candles",
            style = MaterialTheme.typography.bodyMedium
        )
    }
}
