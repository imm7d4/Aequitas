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
 * Market Status Badge component
 * Mirrors MarketStatusBadge.tsx from React frontend
 */
@Composable
fun MarketStatusBadge(
    status: String,
    modifier: Modifier = Modifier
) {
    val (backgroundColor, textColor, displayText) = when (status) {
        "OPEN" -> Triple(MarketOpen, Color.White, "OPEN")
        "CLOSED" -> Triple(MarketClosed, Color.White, "CLOSED")
        "PRE_MARKET" -> Triple(MarketPreMarket, Color.White, "PRE-MARKET")
        "POST_MARKET" -> Triple(MarketPostMarket, Color.White, "POST-MARKET")
        else -> Triple(MaterialTheme.colorScheme.surfaceVariant, MaterialTheme.colorScheme.onSurfaceVariant, status)
    }
    
    Text(
        text = displayText,
        modifier = modifier
            .background(backgroundColor, RoundedCornerShape(12.dp))
            .padding(horizontal = 12.dp, vertical = 6.dp),
        color = textColor,
        fontSize = 12.sp,
        fontWeight = FontWeight.Bold
    )
}
