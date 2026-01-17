# Short Selling Database Migration

This directory contains MongoDB migration scripts to make the production database compatible with the short selling feature.

## Quick Start

```bash
# 1. Backup production database
mongodump --uri="mongodb://your-production-uri" --db=aequitas --out=backup_$(date +%Y%m%d_%H%M%S)

# 2. Run all migrations
cd backend/migrations
mongosh "mongodb://your-production-uri" < run_all_migrations.js

# 3. Validate
mongosh "mongodb://your-production-uri" < validate_migration.js
```

## Migration Scripts

| Script | Description | Estimated Time |
|--------|-------------|----------------|
| `001_add_isShortable.js` | Add `isShortable` field to instruments | 10 seconds |
| `002_add_holding_fields.js` | Add position type and margin fields to holdings | 30 seconds |
| `003_add_account_fields.js` | Add `blockedMargin` to accounts + sync from holdings | 1 minute |
| `004_add_order_intent.js` | Add `intent` field to orders | 20 seconds |
| `run_all_migrations.js` | Run all migrations in sequence | 2 minutes |
| `validate_migration.js` | Verify all migrations completed successfully | 1 minute |

## Schema Changes

### Instruments Collection
- **New Field:** `isShortable: Boolean` (default: false)

### Holdings Collection
- **New Fields:**
  - `positionType: String` ("LONG" or "SHORT")
  - `blockedMargin: Number` (default: 0)
  - `initialMargin: Number` (default: 0)
  - `marginStatus: String` ("OK", "WARNING", "CRITICAL", "LIQUIDATED")

### Trading Accounts Collection
- **New Fields:**
  - `blockedMargin: Number` (default: 0)
  - `realizedPL: Number` (default: 0)

### Orders Collection
- **New Field:** `intent: String` ("OPEN_LONG", "CLOSE_LONG", "OPEN_SHORT", "CLOSE_SHORT")

## Rollback

If migration fails:

```bash
# Option 1: Restore from backup
mongorestore --uri="mongodb://your-production-uri" --db=aequitas backup_YYYYMMDD_HHMMSS/aequitas/

# Option 2: Run rollback script (if available)
mongosh "mongodb://your-production-uri" < rollback_migrations.js
```

## Testing

Test on staging environment first:

```bash
# 1. Copy production data to staging
mongodump --uri="mongodb://production-uri" --db=aequitas
mongorestore --uri="mongodb://staging-uri" --db=aequitas dump/aequitas/

# 2. Run migrations on staging
mongosh "mongodb://staging-uri" < run_all_migrations.js

# 3. Validate
mongosh "mongodb://staging-uri" < validate_migration.js

# 4. Test application
# - Deploy code to staging
# - Test short selling features
# - Verify no errors
```

## Detailed Documentation

See [production_migration_guide.md](../../docs/production_migration_guide.md) for:
- Detailed migration steps
- Pre/post-migration checklists
- Troubleshooting guide
- Monitoring recommendations

## Support

If you encounter issues:
1. Check validation output for specific errors
2. Review migration logs
3. Consult [production_migration_guide.md](../../docs/production_migration_guide.md)
4. Contact: [Your team's on-call]
