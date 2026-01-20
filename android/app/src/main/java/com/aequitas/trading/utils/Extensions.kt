package com.aequitas.trading.utils

import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Extension functions for common operations
 */

// Number formatting
fun Double.toCurrency(): String {
    val format = NumberFormat.getCurrencyInstance(Locale("en", "IN"))
    format.maximumFractionDigits = 2
    return format.format(this)
}

fun Double.toPercentage(): String {
    return String.format("%.2f%%", this)
}

fun Double.formatPrice(): String {
    return String.format("%.2f", this)
}

// Date formatting
fun String.toFormattedDate(pattern: String = "dd MMM yyyy, hh:mm a"): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val outputFormat = SimpleDateFormat(pattern, Locale.getDefault())
        val date = inputFormat.parse(this)
        date?.let { outputFormat.format(it) } ?: this
    } catch (e: Exception) {
        this
    }
}

fun Long.toFormattedDate(pattern: String = "dd MMM yyyy, hh:mm a"): String {
    val date = Date(this)
    val format = SimpleDateFormat(pattern, Locale.getDefault())
    return format.format(date)
}

// String validation
fun String.isValidEmail(): Boolean {
    val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\$"
    return this.matches(emailRegex.toRegex())
}

fun String.isValidPassword(): Boolean {
    return this.length >= 6
}

// Price change helpers
fun Double.getPriceChangeColor(): androidx.compose.ui.graphics.Color {
    return when {
        this > 0 -> com.aequitas.trading.presentation.theme.PriceUp
        this < 0 -> com.aequitas.trading.presentation.theme.PriceDown
        else -> com.aequitas.trading.presentation.theme.PriceNeutral
    }
}

fun Double.getPriceChangeIcon(): String {
    return when {
        this > 0 -> "↑"
        this < 0 -> "↓"
        else -> "→"
    }
}
