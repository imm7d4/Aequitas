package com.aequitas.trading.presentation.main

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.aequitas.trading.presentation.dashboard.DashboardScreen
import com.aequitas.trading.presentation.navigation.Screen
import com.aequitas.trading.presentation.orders.OrdersScreen
import com.aequitas.trading.presentation.portfolio.PortfolioScreen
import com.aequitas.trading.presentation.profile.ProfileScreen
import com.aequitas.trading.presentation.watchlist.WatchlistScreen

/**
 * Main Screen with Bottom Navigation
 * Mirrors the Header.tsx and Sidebar.tsx from React frontend
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    onLogout: () -> Unit
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination
    
    val bottomNavItems = listOf(
        BottomNavItem("Dashboard", Screen.Dashboard.route, Icons.Default.Home),
        BottomNavItem("Instruments", Screen.InstrumentList.route, Icons.Default.Search),
        BottomNavItem("Watchlist", Screen.Watchlist.route, Icons.Default.Star),
        BottomNavItem("Orders", Screen.Orders.route, Icons.Default.ShoppingCart),
        BottomNavItem("Portfolio", Screen.Portfolio.route, Icons.Default.AccountBalance)
    )
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Aequitas") },
                actions = {
                    // Market status badge could go here
                    IconButton(onClick = { /* Search */ }) {
                        Icon(Icons.Default.Search, contentDescription = "Search")
                    }
                    IconButton(onClick = { /* Notifications */ }) {
                        Icon(Icons.Default.Notifications, contentDescription = "Notifications")
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar {
                bottomNavItems.forEach { item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(item.label) },
                        selected = currentDestination?.hierarchy?.any { it.route == item.route } == true,
                        onClick = {
                            navController.navigate(item.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = Screen.Dashboard.route,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable(Screen.Dashboard.route) {
                DashboardScreen()
            }
            composable(Screen.InstrumentList.route) {
                com.aequitas.trading.presentation.instruments.InstrumentListScreen(
                    onInstrumentClick = { instrumentId ->
                        navController.navigate(Screen.InstrumentDetail.createRoute(instrumentId))
                    }
                )
            }
            composable(
                route = Screen.InstrumentDetail.route,
                arguments = listOf(navArgument("instrumentId") { type = NavType.StringType })
            ) { backStackEntry ->
                val instrumentId = backStackEntry.arguments?.getString("instrumentId") ?: return@composable
                com.aequitas.trading.presentation.instruments.InstrumentDetailScreen(
                    instrumentId = instrumentId,
                    onNavigateBack = { navController.popBackStack() },
                    onTrade = { /* TODO: Open trade panel */ }
                )
            }
            composable(Screen.Watchlist.route) {
                WatchlistScreen()
            }
            composable(Screen.Orders.route) {
                OrdersScreen()
            }
            composable(Screen.Portfolio.route) {
                PortfolioScreen()
            }
            composable(Screen.Profile.route) {
                ProfileScreen(onLogout = onLogout)
            }
        }
    }
}

data class BottomNavItem(
    val label: String,
    val route: String,
    val icon: ImageVector
)
