// Fresh Start Deployment - Short Selling Feature
// Usage: mongosh <connection-string> < fresh_start.js
// 
// This script:
// 1. Backs up core data (users, trading_accounts, market config)
// 2. Drops all transactional collections
// 3. Resets trading accounts (blockedMargin = 0, realizedPL = 0)
// 4. Restores core data
// 5. Creates indexes

db = db.getSiblingDB('aequitas');

print("╔════════════════════════════════════════════════════════════╗");
print("║   FRESH START DEPLOYMENT - SHORT SELLING                   ║");
print("╚════════════════════════════════════════════════════════════╝");
print("");
print("Started at:", new Date());
print("");

// Step 1: Backup core data
print("┌─────────────────────────────────────────────────────────┐");
print("│ Step 1: Backing up core data                            │");
print("└─────────────────────────────────────────────────────────┘");

const users = db.users.find().toArray();
const tradingAccounts = db.trading_accounts.find().toArray();
const marketHours = db.market_hours.find().toArray();
const marketHolidays = db.market_holidays.find().toArray();

print("  ✓ Backed up", users.length, "users");
print("  ✓ Backed up", tradingAccounts.length, "trading accounts");
print("  ✓ Backed up", marketHours.length, "market hours");
print("  ✓ Backed up", marketHolidays.length, "market holidays");
print("");

// Step 2: Drop transactional collections
print("┌─────────────────────────────────────────────────────────┐");
print("│ Step 2: Dropping transactional collections              │");
print("└─────────────────────────────────────────────────────────┘");

const collectionsToDrop = [
    'holdings',
    'orders',
    'trades',
    'portfolio_snapshots',
    'notifications',
    'instruments',
    'market_data',
    'candles'
];

collectionsToDrop.forEach(function (collName) {
    try {
        db[collName].drop();
        print("  ✓ Dropped", collName);
    } catch (e) {
        print("  ⚠️  Could not drop", collName, "(may not exist)");
    }
});
print("");

// Step 3: Reset trading accounts
print("┌─────────────────────────────────────────────────────────┐");
print("│ Step 3: Resetting trading accounts                      │");
print("└─────────────────────────────────────────────────────────┘");

// Reset blockedMargin and realizedPL for all accounts
tradingAccounts.forEach(function (account) {
    account.blockedMargin = 0;
    account.realizedPL = 0;
    account.updatedAt = new Date();
});

// Drop and recreate trading_accounts
db.trading_accounts.drop();
if (tradingAccounts.length > 0) {
    db.trading_accounts.insertMany(tradingAccounts);
    print("  ✓ Reset", tradingAccounts.length, "trading accounts");
    print("    • blockedMargin = 0");
    print("    • realizedPL = 0");
}
print("");

// Step 4: Restore core data
print("┌─────────────────────────────────────────────────────────┐");
print("│ Step 4: Restoring core data                             │");
print("└─────────────────────────────────────────────────────────┘");

// Users - no changes needed
db.users.drop();
if (users.length > 0) {
    db.users.insertMany(users);
    print("  ✓ Restored", users.length, "users");
}

// Market hours - no changes needed
db.market_hours.drop();
if (marketHours.length > 0) {
    db.market_hours.insertMany(marketHours);
    print("  ✓ Restored", marketHours.length, "market hours");
}

// Market holidays - no changes needed
db.market_holidays.drop();
if (marketHolidays.length > 0) {
    db.market_holidays.insertMany(marketHolidays);
    print("  ✓ Restored", marketHolidays.length, "market holidays");
}
print("");

// Step 5: Create indexes
print("┌─────────────────────────────────────────────────────────┐");
print("│ Step 5: Creating indexes                                │");
print("└─────────────────────────────────────────────────────────┘");

// Users
db.users.createIndex({ email: 1 }, { unique: true });
print("  ✓ users.email (unique)");

// Trading Accounts
db.trading_accounts.createIndex({ user_id: 1 }, { unique: true });
print("  ✓ trading_accounts.user_id (unique)");

// Holdings (will be created when first trade happens)
db.holdings.createIndex({ user_id: 1, instrument_id: 1 }, { unique: true });
print("  ✓ holdings.user_id + instrument_id (unique)");

// Orders
db.orders.createIndex({ user_id: 1, created_at: -1 });
db.orders.createIndex({ status: 1 });
print("  ✓ orders.user_id + created_at");
print("  ✓ orders.status");

// Instruments
db.instruments.createIndex({ symbol: 1 }, { unique: true });
print("  ✓ instruments.symbol (unique)");

print("");

// Step 6: Summary
print("╔════════════════════════════════════════════════════════════╗");
print("║   DEPLOYMENT SUMMARY                                       ║");
print("╚════════════════════════════════════════════════════════════╝");
print("");
print("✅ Core data preserved:");
print("  • Users:", db.users.countDocuments());
print("  • Trading Accounts:", db.trading_accounts.countDocuments());
print("  • Market Hours:", db.market_hours.countDocuments());
print("  • Market Holidays:", db.market_holidays.countDocuments());
print("");
print("✅ Transactional data cleared:");
print("  • Holdings: 0 (will be created on first trade)");
print("  • Orders: 0");
print("  • Trades: 0");
print("  • Instruments: 0 (will be seeded)");
print("  • Market Data: 0 (will be generated)");
print("  • Candles: 0 (will be generated)");
print("");
print("Completed at:", new Date());
print("");
print("╔════════════════════════════════════════════════════════════╗");
print("║   NEXT STEPS                                               ║");
print("╚════════════════════════════════════════════════════════════╝");
print("");
print("1. Deploy new backend code:");
print("   cd /opt/aequitas/backend");
print("   git pull origin main");
print("   go build -o aequitas-server cmd/server/main.go");
print("   systemctl restart aequitas-backend");
print("");
print("2. Seed instruments:");
print("   go run scripts/seed_instruments.go");
print("");
print("3. Verify:");
print("   curl http://localhost:8080/api/health");
print("   curl http://localhost:8080/api/instruments");
print("");
print("4. Users can start trading!");
print("");
print("✅ Fresh start deployment complete!");
