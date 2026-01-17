// Run All Migrations - Short Selling Feature
// Usage: mongosh <connection-string> < run_all_migrations.js

print("╔════════════════════════════════════════════════════════════╗");
print("║   AEQUITAS - SHORT SELLING MIGRATION                       ║");
print("╚════════════════════════════════════════════════════════════╝");
print("");
print("Started at:", new Date());
print("");

// Switch to database
db = db.getSiblingDB('aequitas');

// Migration 1: Instruments
print("┌─────────────────────────────────────────────────────────┐");
print("│ [1/4] Migrating Instruments Collection                  │");
print("└─────────────────────────────────────────────────────────┘");
load('001_add_isShortable.js');
print("");

// Migration 2: Holdings
print("┌─────────────────────────────────────────────────────────┐");
print("│ [2/4] Migrating Holdings Collection                     │");
print("└─────────────────────────────────────────────────────────┘");
load('002_add_holding_fields.js');
print("");

// Migration 3: Trading Accounts
print("┌─────────────────────────────────────────────────────────┐");
print("│ [3/4] Migrating Trading Accounts Collection             │");
print("└─────────────────────────────────────────────────────────┘");
load('003_add_account_fields.js');
print("");

// Migration 4: Orders
print("┌─────────────────────────────────────────────────────────┐");
print("│ [4/4] Migrating Orders Collection                       │");
print("└─────────────────────────────────────────────────────────┘");
load('004_add_order_intent.js');
print("");

// Final Summary
print("╔════════════════════════════════════════════════════════════╗");
print("║   MIGRATION SUMMARY                                        ║");
print("╚════════════════════════════════════════════════════════════╝");
print("");
print("Instruments:");
print("  • Total:", db.instruments.countDocuments());
print("  • Shortable:", db.instruments.countDocuments({ isShortable: true }));
print("");
print("Holdings:");
print("  • Total:", db.holdings.countDocuments());
print("  • LONG positions:", db.holdings.countDocuments({ positionType: "LONG" }));
print("  • SHORT positions:", db.holdings.countDocuments({ positionType: "SHORT" }));
print("");
print("Trading Accounts:");
print("  • Total:", db.trading_accounts.countDocuments());
print("  • With blocked margin:", db.trading_accounts.countDocuments({ blockedMargin: { $gt: 0 } }));
print("");
print("Orders:");
print("  • Total:", db.orders.countDocuments());
print("  • With intent:", db.orders.countDocuments({ intent: { $exists: true } }));
print("");
print("Completed at:", new Date());
print("");
print("✅ All migrations completed successfully!");
print("");
print("Next steps:");
print("  1. Run validation: mongosh <uri> < validate_migration.js");
print("  2. Deploy new backend code");
print("  3. Monitor logs for 24 hours");
