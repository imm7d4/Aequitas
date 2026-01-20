package com.aequitas.trading.presentation.navigation

/**
 * Navigation routes for the app
 */
sealed class Screen(val route: String) {
    object Login : Screen("login")
    object Register : Screen("register")
    object Main : Screen("main")
    object Dashboard : Screen("dashboard")
    object Watchlist : Screen("watchlist")
    object Orders : Screen("orders")
    object Portfolio : Screen("portfolio")
    object Profile : Screen("profile")
    object InstrumentList : Screen("instruments")
    object InstrumentDetail : Screen("instrument/{instrumentId}") {
        fun createRoute(instrumentId: String) = "instrument/$instrumentId"
    }
}
