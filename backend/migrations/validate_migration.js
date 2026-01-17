// Validation Script - Verify Short Selling Migration
// Usage: mongosh <connection-string> < validate_migration.js

db = db.getSiblingDB('aequitas');

print("╔════════════════════════════════════════════════════════════╗");
print("║   POST-MIGRATION VALIDATION                                ║");
print("╚════════════════════════════════════════════════════════════╝");
print("");

let errorCount = 0;

// Check 1: Instruments
print("┌─────────────────────────────────────────────────────────┐");
print("│ Validating Instruments Collection                       │");
print("└─────────────────────────────────────────────────────────┘");

const instrumentsWithoutFlag = db.instruments.countDocuments({ isShortable: { $exists: false } });
if (instrumentsWithoutFlag === 0) {
    print("✅ All instruments have isShortable field");
} else {
    print("❌ ERROR:", instrumentsWithoutFlag, "instruments missing isShortable field");
    errorCount++;
}
print("");

// Check 2: Holdings
print("┌─────────────────────────────────────────────────────────┐");
print("│ Validating Holdings Collection                          │");
print("└─────────────────────────────────────────────────────────┘");

const holdingsWithoutType = db.holdings.countDocuments({ positionType: { $exists: false } });
const emptyPositionType = db.holdings.countDocuments({ positionType: "" });
const holdingsWithoutMargin = db.holdings.countDocuments({ blockedMargin: { $exists: false } });

if (holdingsWithoutType === 0) {
    print("✅ All holdings have positionType field");
} else {
    print("❌ ERROR:", holdingsWithoutType, "holdings missing positionType");
    errorCount++;
}

if (emptyPositionType === 0) {
    print("✅ No holdings with empty positionType");
} else {
    print("❌ ERROR:", emptyPositionType, "holdings have empty positionType");
    errorCount++;
}

if (holdingsWithoutMargin === 0) {
    print("✅ All holdings have blockedMargin field");
} else {
    print("❌ ERROR:", holdingsWithoutMargin, "holdings missing blockedMargin");
    errorCount++;
}
print("");

// Check 3: Trading Accounts
print("┌─────────────────────────────────────────────────────────┐");
print("│ Validating Trading Accounts Collection                  │");
print("└─────────────────────────────────────────────────────────┘");

const accountsWithoutMargin = db.trading_accounts.countDocuments({ blockedMargin: { $exists: false } });

if (accountsWithoutMargin === 0) {
    print("✅ All accounts have blockedMargin field");
} else {
    print("❌ ERROR:", accountsWithoutMargin, "accounts missing blockedMargin");
    errorCount++;
}
print("");

// Check 4: Orders
print("┌─────────────────────────────────────────────────────────┐");
print("│ Validating Orders Collection                            │");
print("└─────────────────────────────────────────────────────────┘");

const ordersWithoutIntent = db.orders.countDocuments({ intent: { $exists: false } });
const emptyIntent = db.orders.countDocuments({ intent: "" });

if (ordersWithoutIntent === 0) {
    print("✅ All orders have intent field");
} else {
    print("❌ ERROR:", ordersWithoutIntent, "orders missing intent");
    errorCount++;
}

if (emptyIntent === 0) {
    print("✅ No orders with empty intent");
} else {
    print("❌ ERROR:", emptyIntent, "orders have empty intent");
    errorCount++;
}
print("");

// Check 5: Margin Sync
print("┌─────────────────────────────────────────────────────────┐");
print("│ Validating Margin Sync                                  │");
print("└─────────────────────────────────────────────────────────┘");

let mismatchCount = 0;
db.trading_accounts.find({ blockedMargin: { $gt: 0 } }).forEach(function (account) {
    const holdingsSum = db.holdings.aggregate([
        { $match: { user_id: account.user_id } },
        { $group: { _id: null, total: { $sum: "$blocked_margin" } } }
    ]).toArray()[0]?.total || 0;

    const diff = Math.abs(holdingsSum - account.blockedMargin);
    if (diff > 0.01) {
        print("⚠️  User", account.user_id.toString(),
            "- Account: ₹" + account.blockedMargin.toFixed(2),
            "Holdings: ₹" + holdingsSum.toFixed(2));
        mismatchCount++;
    }
});

if (mismatchCount === 0) {
    print("✅ All account margins synced with holdings");
} else {
    print("❌ ERROR:", mismatchCount, "accounts have margin sync mismatches");
    errorCount++;
}
print("");

// Final Summary
print("╔════════════════════════════════════════════════════════════╗");
print("║   VALIDATION SUMMARY                                       ║");
print("╚════════════════════════════════════════════════════════════╝");
print("");

if (errorCount === 0) {
    print("✅ ✅ ✅  ALL VALIDATIONS PASSED  ✅ ✅ ✅");
    print("");
    print("Database is ready for short selling!");
} else {
    print("❌ ❌ ❌  VALIDATION FAILED  ❌ ❌ ❌");
    print("");
    print("Found", errorCount, "error(s)");
    print("");
    print("⚠️  DO NOT DEPLOY - Fix errors first!");
}
print("");
