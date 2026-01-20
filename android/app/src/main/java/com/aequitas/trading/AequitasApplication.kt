package com.aequitas.trading

import android.app.Application
import dagger.hilt.android.HiltAndroidApp

/**
 * Application class for Aequitas Trading Platform
 * Annotated with @HiltAndroidApp to enable Hilt dependency injection
 */
@HiltAndroidApp
class AequitasApplication : Application() {
    
    override fun onCreate() {
        super.onCreate()
        // Global initialization can be done here if needed
    }
}
