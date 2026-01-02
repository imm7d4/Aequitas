# US-0.1.2 - Trading Account Creation

**Epic:** EPIC 0.1 - User & Account Foundation  
**Phase:** Phase 0 - Foundation (Non-Negotiable)  
**Status:** Completed

## User Story

As a **system**  
I want to **automatically create a trading account**  
So that **the user can trade stocks**

## Acceptance Criteria

- [x] One trading account per user (1:1 relationship)
- [x] Default cash balance = 0
- [x] Account currency = base currency (INR)
- [x] Trading account created automatically on user registration
- [x] Trading account ID generated
- [x] Account status = ACTIVE
- [x] Link trading account to user ID

## Technical Requirements

### Backend (Go + MongoDB)

**Model/Schema:**
```go
type TradingAccount struct {
    ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    UserID       primitive.ObjectID `bson:"user_id" json:"userId"`
    Balance      float64            `bson:"balance" json:"balance"`
    Currency     string             `bson:"currency" json:"currency"`
    Status       string             `bson:"status" json:"status"`
    CreatedAt    time.Time          `bson:"created_at" json:"createdAt"`
    UpdatedAt    time.Time          `bson:"updated_at" json:"updatedAt"`
}
```

**API Endpoints:**
- Internal service call (not exposed as REST endpoint)
- `GET /api/trading-account` - Get user's trading account

**Business Logic (TradingAccountService):**
- `CreateForUser(userID string) (*TradingAccount, error)`
  - Generate unique trading account ID
  - Set balance to 0.0
  - Set currency to "INR"
  - Set status to "ACTIVE"
  - Link to user ID
  - Create trading account record
  - Return trading account data

**Validation Rules:**
- User ID must exist
- User can only have one trading account
- Currency must be valid (INR)
- Balance must be non-negative

**Integration Points:**
- Called by AuthService after successful user registration
- Transactional: If trading account creation fails, rollback user creation

### Frontend (TypeScript + React)

**Components:**
- `TradingAccountCard.tsx` - Display trading account info (50-100 lines)
  - Account ID
  - Balance
  - Currency
  - Status

**Hooks:**
- `useTradingAccount.ts` - Fetch trading account data (< 200 lines)
  - Load account on mount
  - Handle loading/error states
  - Refresh account data

**Services:**
- `tradingAccountService.ts` - API integration
  - `getTradingAccount(): Promise<TradingAccount>`

**Types:**
```typescript
export interface TradingAccount {
  id: string;
  userId: string;
  balance: number;
  currency: 'INR';
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
  createdAt: Date;
  updatedAt: Date;
}
```

**State Management:**
- Global state (Zustand/Redux) for trading account
- Accessible across features (orders, wallet, portfolio)

## Dependencies

**Upstream:**
- US-0.1.1 (User Registration) - must complete first

**Downstream:**
- US-2.1.1 (Add Funds) - requires trading account
- US-3.1.1 (Place Buy Order) - requires trading account
- US-6.1.2 (Portfolio View) - displays trading account

## Implementation Notes

### Business Rules
- **One account per user**: Enforce at database level with unique index on user_id
- **Auto-creation**: Trading account creation is part of registration flow
- **Atomic operation**: User + Trading Account creation should be transactional

### Edge Cases
- User registration succeeds but trading account creation fails
  - Solution: Rollback user creation or mark user as incomplete
- Duplicate trading account creation attempt
  - Solution: Check if account exists before creating
- Invalid currency
  - Solution: Validate currency against allowed list

### Performance Considerations
- Index on user_id for fast lookups
- Cache trading account data in frontend

### Error Handling
- If trading account creation fails during registration:
  - Log error
  - Rollback user creation
  - Return error to user
  - Retry mechanism for transient failures

## Testing Requirements

### Backend Unit Tests
- ✅ CreateForUser creates account with correct defaults
- ✅ CreateForUser links to user ID
- ✅ CreateForUser sets balance to 0
- ✅ CreateForUser sets currency to INR
- ✅ CreateForUser sets status to ACTIVE
- ✅ Duplicate account creation prevented

### Backend Integration Tests
- ✅ User registration triggers trading account creation
- ✅ GET /api/trading-account returns user's account
- ✅ GET /api/trading-account returns 404 if no account
- ✅ Failed trading account creation rolls back user

### Frontend Unit Tests
- ✅ TradingAccountCard displays account info
- ✅ useTradingAccount fetches account on mount
- ✅ useTradingAccount handles loading state
- ✅ useTradingAccount handles error state

### E2E Tests
- ✅ New user registration creates trading account
- ✅ Dashboard displays trading account info
- ✅ Trading account balance shows 0 for new users

## Audit Trail

| Date | Author | Change |
|------|--------|--------|
| 2026-01-02 | ChatGPT Assisted | Initial creation |
| 2026-01-02 | Dharmesh | Completed implementation - Automatic trading account creation on registration |
