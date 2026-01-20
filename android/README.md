# Aequitas Android App

Android mobile application for Aequitas stock trading platform built with Kotlin and Jetpack Compose.

## 🏗️ Architecture

- **Language**: Kotlin
- **UI**: Jetpack Compose (Material 3)
- **Architecture**: MVVM (Model-View-ViewModel)
- **Dependency Injection**: Hilt
- **Networking**: Retrofit + OkHttp
- **Local Storage**: DataStore (Preferences)
- **Async**: Kotlin Coroutines + Flow

## 📋 Requirements

- Android Studio Hedgehog (2023.1.1) or later
- Android SDK 34
- Minimum SDK 26 (Android 8.0)
- JDK 17

## 🚀 Setup Instructions

### 1. Open in Android Studio

1. Launch Android Studio
2. Click **File → Open**
3. Navigate to `c:\Users\Dharmesh\Downloads\ae\Aequitas\android\`
4. Click **OK**

### 2. Gradle Sync

Android Studio will automatically start syncing Gradle. If not:
1. Click **File → Sync Project with Gradle Files**
2. Wait for sync to complete (may take a few minutes on first run)

### 3. Configure Backend URL

The app is configured to connect to your Go backend:

**For Emulator** (default):
- URL: `http://10.0.2.2:8080/api`
- This is already configured in `app/build.gradle.kts`

**For Physical Device**:
1. Find your computer's local IP address:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```
2. Open `app/build.gradle.kts`
3. Change line 25:
   ```kotlin
   buildConfigField("String", "API_BASE_URL", "\"http://YOUR_IP:8080/api\"")
   ```

### 4. Start Backend

Ensure your Go backend is running:
```bash
cd backend
go run cmd/server/main.go
```

### 5. Run the App

1. Connect a physical device or start an emulator
2. Click the **Run** button (green play icon) or press **Shift+F10**
3. Select your device/emulator
4. Wait for build and installation

## ✅ Current Implementation Status

### ✅ Completed (Phase 1)
- [x] Project structure and Gradle configuration
- [x] Material 3 theme with dark/light mode
- [x] Complete data models matching backend API
- [x] Retrofit API service with all endpoints
- [x] OkHttp with auth interceptor (JWT)
- [x] DataStore for token persistence
- [x] Hilt dependency injection
- [x] Navigation system
- [x] Authentication module (Login/Register)
- [x] Main app shell with bottom navigation

### 🚧 To Be Implemented (Phases 2-11)
- [ ] Dashboard with market overview
- [ ] Watchlist management with real-time prices
- [ ] Order placement (MARKET, LIMIT, STOP, etc.)
- [ ] Order history and management
- [ ] Portfolio and holdings
- [ ] Stock charts (candlestick)
- [ ] Global search
- [ ] Market status badge
- [ ] Profile management
- [ ] WebSocket for real-time data

## 📱 Features

### Authentication
- Email/password login
- User registration
- JWT token management
- Auto-login on app restart
- Secure logout

### Navigation
- Bottom navigation bar
- 5 main sections: Dashboard, Watchlist, Orders, Portfolio, Profile
- Smooth transitions

## 🧪 Testing

### Manual Testing Checklist

1. **Build Verification**
   - [ ] Project builds without errors
   - [ ] No Gradle sync issues

2. **Authentication**
   - [ ] Register new user
   - [ ] Login with credentials
   - [ ] Token persists after app restart
   - [ ] Logout works correctly

3. **Navigation**
   - [ ] Bottom navigation switches screens
   - [ ] Back button works correctly

## 🐛 Troubleshooting

### Gradle Sync Failed
```bash
# Clear Gradle cache
./gradlew clean
# In Android Studio: File → Invalidate Caches → Invalidate and Restart
```

### Cannot Connect to Backend
- Ensure backend is running on port 8080
- For emulator, use `10.0.2.2` instead of `localhost`
- For physical device, use your computer's local IP
- Check firewall settings

### Build Errors
- Ensure JDK 17 is installed
- Check Android SDK is up to date
- Verify all dependencies in `app/build.gradle.kts`

## 📂 Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/aequitas/trading/
│   │   │   ├── data/
│   │   │   │   ├── local/          # DataStore, Room
│   │   │   │   ├── remote/         # Retrofit, API
│   │   │   │   └── repository/     # Data repositories
│   │   │   ├── di/                 # Hilt modules
│   │   │   ├── domain/model/       # Data models
│   │   │   ├── presentation/       # UI (Compose)
│   │   │   │   ├── auth/           # Login, Register
│   │   │   │   ├── dashboard/      # Dashboard screen
│   │   │   │   ├── main/           # Main screen
│   │   │   │   ├── navigation/     # Navigation
│   │   │   │   ├── orders/         # Orders screen
│   │   │   │   ├── portfolio/      # Portfolio screen
│   │   │   │   ├── profile/        # Profile screen
│   │   │   │   ├── theme/          # Theme, colors
│   │   │   │   └── watchlist/      # Watchlist screen
│   │   │   ├── utils/              # Extensions, constants
│   │   │   ├── AequitasApplication.kt
│   │   │   └── MainActivity.kt
│   │   ├── res/                    # Resources
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── build.gradle.kts
└── settings.gradle.kts
```

## 🔧 Next Steps

To complete the app, implement:

1. **Repositories & ViewModels** for each feature
2. **UI Screens** with real data integration
3. **WebSocket service** for real-time market data
4. **Chart components** using Vico library
5. **Search functionality**
6. **Order placement UI**
7. **Error handling** and loading states

## 📄 License

Proprietary - Aequitas Trading Platform
