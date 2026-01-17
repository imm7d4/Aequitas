// Migration 003: Add blockedMargin to trading accounts and sync from holdings
// Run: mongosh <connection-string> < 003_add_account_fields.js

db = db.getSiblingDB('aequitas');

print("=== Migration 003: Add Account Fields & Sync Margin ===");
print("Started at:", new Date());

// Step 1: Add blockedMargin field
const result1 = db.trading_accounts.updateMany(
    { blockedMargin: { $exists: false } },
    { $set: { blockedMargin: 0 } }
);

print("Step 1: Added blockedMargin to", result1.modifiedCount, "accounts");

// Step 2: Add realizedPL field (if not exists)
const result2 = db.trading_accounts.updateMany(
    { realizedPL: { $exists: false } },
    { $set: { realizedPL: 0 } }
);

print("Step 2: Added realizedPL to", result2.modifiedCount, "accounts");

// Step 3: CRITICAL - Sync blockedMargin from holdings
print("\nStep 3: Syncing blockedMargin from holdings...");

const pipeline = [
    {
        $group: {
            _id: "$user_id",
            totalBlockedMargin: { $sum: "$blocked_margin" }
        }
    }
];

const userMargins = db.holdings.aggregate(pipeline).toArray();
let syncedCount = 0;

userMargins.forEach(function (doc) {
    if (doc.totalBlockedMargin > 0) {
        db.trading_accounts.updateOne(
            { user_id: doc._id },
            { $set: { blockedMargin: doc.totalBlockedMargin } }
        );
        print("  Synced user", doc._id.toString(), "→ ₹" + doc.totalBlockedMargin.toFixed(2));
        syncedCount++;
    }
});

print("Synced blockedMargin for", syncedCount, "users");

// Verification
const totalAccounts = db.trading_accounts.countDocuments();
const accountsWithMargin = db.trading_accounts.countDocuments({ blockedMargin: { $gt: 0 } });
const missingBlockedMargin = db.trading_accounts.countDocuments({ blockedMargin: { $exists: false } });

print("\n=== Verification ===");
print("Total accounts:", totalAccounts);
print("Accounts with blocked margin:", accountsWithMargin);
print("Missing blockedMargin field:", missingBlockedMargin, "(should be 0)");

// Detailed sync verification
print("\n=== Margin Sync Verification ===");
let mismatchCount = 0;

db.trading_accounts.find({ blockedMargin: { $gt: 0 } }).forEach(function (account) {
    const holdingsSum = db.holdings.aggregate([
        { $match: { user_id: account.user_id } },
        { $group: { _id: null, total: { $sum: "$blocked_margin" } } }
    ]).toArray()[0]?.total || 0;

    const diff = Math.abs(holdingsSum - account.blockedMargin);
    if (diff > 0.01) {
        print("⚠️  MISMATCH for user", account.user_id.toString(),
            "Account: ₹" + account.blockedMargin.toFixed(2),
            "Holdings: ₹" + holdingsSum.toFixed(2),
            "Diff: ₹" + diff.toFixed(2));
        mismatchCount++;
    }
});

if (mismatchCount > 0) {
    print("⚠️  WARNING:", mismatchCount, "accounts have margin sync mismatches!");
} else if (missingBlockedMargin > 0) {
    print("⚠️  WARNING: Some accounts are missing the blockedMargin field!");
} else {
    print("✅ Migration 003 completed successfully - All margins synced");
}

print("Completed at:", new Date());
