// Migration 002: Add position fields to holdings
// Run: mongosh <connection-string> < 002_add_holding_fields.js

db = db.getSiblingDB('aequitas');

print("=== Migration 002: Add Position Fields to Holdings ===");
print("Started at:", new Date());

// Step 1: Add positionType to existing holdings (assume all are LONG)
const result1 = db.holdings.updateMany(
    { positionType: { $exists: false } },
    { $set: { positionType: "LONG" } }
);

print("Step 1: Added positionType to", result1.modifiedCount, "holdings");

// Step 2: Add margin fields
const result2 = db.holdings.updateMany(
    { blockedMargin: { $exists: false } },
    {
        $set: {
            blockedMargin: 0,
            initialMargin: 0,
            marginStatus: "OK"
        }
    }
);

print("Step 2: Added margin fields to", result2.modifiedCount, "holdings");

// Step 3: Delete any holdings with empty positionType (legacy/corrupted data)
const result3 = db.holdings.deleteMany({ positionType: "" });
print("Step 3: Deleted", result3.deletedCount, "holdings with empty positionType");

// Verification
const totalHoldings = db.holdings.countDocuments();
const longPositions = db.holdings.countDocuments({ positionType: "LONG" });
const shortPositions = db.holdings.countDocuments({ positionType: "SHORT" });
const missingPositionType = db.holdings.countDocuments({ positionType: { $exists: false } });
const missingBlockedMargin = db.holdings.countDocuments({ blockedMargin: { $exists: false } });
const emptyPositionType = db.holdings.countDocuments({ positionType: "" });

print("\n=== Verification ===");
print("Total holdings:", totalHoldings);
print("LONG positions:", longPositions);
print("SHORT positions:", shortPositions);
print("Missing positionType:", missingPositionType, "(should be 0)");
print("Missing blockedMargin:", missingBlockedMargin, "(should be 0)");
print("Empty positionType:", emptyPositionType, "(should be 0)");

if (missingPositionType > 0 || missingBlockedMargin > 0 || emptyPositionType > 0) {
    print("⚠️  WARNING: Some holdings have missing or invalid fields!");
} else {
    print("✅ Migration 002 completed successfully");
}

print("Completed at:", new Date());
