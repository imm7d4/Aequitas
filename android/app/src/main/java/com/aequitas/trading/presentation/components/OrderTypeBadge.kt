package com.aequitas.trading.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aequitas.trading.presentation.theme.*

/**
 * Order Type Badge component
 * Mirrors OrderTypeBadge.tsx from React frontend
 */
@Composable
fun OrderTypeBadge(
    orderType: String,
    modifier: Modifier = Modifier
) {
    val (backgroundColor, textColor) = when (orderType) {
        "MARKET" -> Pair(OrderMarket, Color.White)
        "LIMIT" -> Pair(OrderLimit, Color.White)
        "STOP" -> Pair(OrderStop, Color.White)
        "STOP_LIMIT" -> Pair(OrderStopLimit, Color.White)
        "TRAILING_STOP" -> Pair(OrderTrailingStop, Color.White)
        else -> Pair(MaterialTheme.colorScheme.surfaceVariant, MaterialTheme.colorScheme.onSurfaceVariant)
    }
    
    Text(
        text = orderType.replace("_", " "),
        modifier = modifier
            .background(backgroundColor, RoundedCornerShape(4.dp))
            .padding(horizontal = 8.dp, vertical = 4.dp),
        color = textColor,
        fontSize = 12.sp,
        fontWeight = FontWeight.Medium
    )
}
