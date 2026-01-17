// Migration 001: Add isShortable field to instruments
// Run: mongosh <connection-string> < 001_add_isShortable.js

db = db.getSiblingDB('aequitas');

print("=== Migration 001: Add isShortable to Instruments ===");
print("Started at:", new Date());

// Add isShortable field to all instruments (default: false)
const result1 = db.instruments.updateMany(
    { isShortable: { $exists: false } },
    { $set: { isShortable: false } }
);

print("Updated", result1.modifiedCount, "instruments with isShortable: false");

// Mark specific instruments as shortable
// TODO: Update this list based on your requirements
const shortableSymbols = [
    'TCS', 'INFY', 'RELIANCE', 'HDFCBANK', 'ICICIBANK',
    'WIPRO', 'BHARTIARTL', 'ITC', 'SBIN', 'LT'
];

const result2 = db.instruments.updateMany(
    { symbol: { $in: shortableSymbols } },
    { $set: { isShortable: true } }
);

print("Marked", result2.modifiedCount, "instruments as shortable");

// Verification
const totalInstruments = db.instruments.countDocuments();
const shortableCount = db.instruments.countDocuments({ isShortable: true });
const missingField = db.instruments.countDocuments({ isShortable: { $exists: false } });

print("\n=== Verification ===");
print("Total instruments:", totalInstruments);
print("Shortable instruments:", shortableCount);
print("Missing isShortable field:", missingField, "(should be 0)");

if (missingField > 0) {
    print("⚠️  WARNING: Some instruments are missing the isShortable field!");
} else {
    print("✅ Migration 001 completed successfully");
}

print("Completed at:", new Date());
