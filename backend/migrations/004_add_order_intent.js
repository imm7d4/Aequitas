// Migration 004: Add intent field to orders
// Run: mongosh <connection-string> < 004_add_order_intent.js

db = db.getSiblingDB('aequitas');

print("=== Migration 004: Add Intent to Orders ===");
print("Started at:", new Date());

// Step 1: Infer intent for BUY orders
const result1 = db.orders.updateMany(
    { intent: { $exists: false }, side: "BUY" },
    { $set: { intent: "OPEN_LONG" } }
);

print("Step 1: Added OPEN_LONG intent to", result1.modifiedCount, "BUY orders");

// Step 2: Infer intent for SELL orders
const result2 = db.orders.updateMany(
    { intent: { $exists: false }, side: "SELL" },
    { $set: { intent: "CLOSE_LONG" } }
);

print("Step 2: Added CLOSE_LONG intent to", result2.modifiedCount, "SELL orders");

// Verification
const totalOrders = db.orders.countDocuments();
const ordersWithIntent = db.orders.countDocuments({ intent: { $exists: true } });
const missingIntent = db.orders.countDocuments({ intent: { $exists: false } });
const emptyIntent = db.orders.countDocuments({ intent: "" });

print("\n=== Verification ===");
print("Total orders:", totalOrders);
print("Orders with intent:", ordersWithIntent);
print("Missing intent:", missingIntent, "(should be 0)");
print("Empty intent:", emptyIntent, "(should be 0)");

// Intent breakdown
const intentCounts = {
    OPEN_LONG: db.orders.countDocuments({ intent: "OPEN_LONG" }),
    CLOSE_LONG: db.orders.countDocuments({ intent: "CLOSE_LONG" }),
    OPEN_SHORT: db.orders.countDocuments({ intent: "OPEN_SHORT" }),
    CLOSE_SHORT: db.orders.countDocuments({ intent: "CLOSE_SHORT" })
};

print("\n=== Intent Breakdown ===");
print("OPEN_LONG:", intentCounts.OPEN_LONG);
print("CLOSE_LONG:", intentCounts.CLOSE_LONG);
print("OPEN_SHORT:", intentCounts.OPEN_SHORT);
print("CLOSE_SHORT:", intentCounts.CLOSE_SHORT);

if (missingIntent > 0 || emptyIntent > 0) {
    print("⚠️  WARNING: Some orders have missing or empty intent!");
} else {
    print("✅ Migration 004 completed successfully");
}

print("Completed at:", new Date());
