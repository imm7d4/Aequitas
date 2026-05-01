/**
 * Global application constants to replace hardcoded strings and magic numbers.
 * Organized by functional category.
 */

export const ORDER_SIDE = {
    BUY: 'BUY',
    SELL: 'SELL',
} as const;

export type OrderSide = typeof ORDER_SIDE[keyof typeof ORDER_SIDE];

export const ORDER_TYPE = {
    MARKET: 'MARKET',
    LIMIT: 'LIMIT',
    STOP: 'STOP',
    STOP_LIMIT: 'STOP_LIMIT',
    TRAILING_STOP: 'TRAILING_STOP',
} as const;

export type OrderType = typeof ORDER_TYPE[keyof typeof ORDER_TYPE];

export const ORDER_STATUS = {
    PENDING: 'PENDING',
    FILLED: 'FILLED',
    CANCELLED: 'CANCELLED',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
    PARTIAL_FILL: 'PARTIAL_FILL',
    COMPLETED: 'COMPLETED',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export const ORDER_VALIDITY = {
    DAY: 'DAY',
    IOC: 'IOC',
    GTC: 'GTC',
} as const;

export type OrderValidity = typeof ORDER_VALIDITY[keyof typeof ORDER_VALIDITY];

export const TRAIL_TYPE = {
    ABSOLUTE: 'ABSOLUTE',
    PERCENTAGE: 'PERCENTAGE',
} as const;

export type TrailType = typeof TRAIL_TYPE[keyof typeof TRAIL_TYPE];

export const TRADING_INTENT = {
    OPEN_LONG: 'OPEN_LONG',
    CLOSE_LONG: 'CLOSE_LONG',
    OPEN_SHORT: 'OPEN_SHORT',
    CLOSE_SHORT: 'CLOSE_SHORT',
} as const;

export type TradingIntent = typeof TRADING_INTENT[keyof typeof TRADING_INTENT];

export const POSITION_TYPE = {
    LONG: 'LONG',
    SHORT: 'SHORT',
} as const;

export type PositionType = typeof POSITION_TYPE[keyof typeof POSITION_TYPE];

export const MARGIN_STATUS = {
    OK: 'OK',
    CALL: 'CALL',
    CRITICAL: 'CRITICAL',
    LIQUIDATED: 'LIQUIDATED',
} as const;

export type MarginStatus = typeof MARGIN_STATUS[keyof typeof MARGIN_STATUS];

export const EXCHANGE = {
    NSE: 'NSE',
    BSE: 'BSE',
} as const;

export type Exchange = typeof EXCHANGE[keyof typeof EXCHANGE];

export const INSTRUMENT_TYPE = {
    STOCK: 'STOCK',
    ETF: 'ETF',
    BOND: 'BOND',
    MUTUAL_FUND: 'MUTUAL_FUND',
} as const;

export type InstrumentType = typeof INSTRUMENT_TYPE[keyof typeof INSTRUMENT_TYPE];

export const INSTRUMENT_STATUS = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    DELISTED: 'DELISTED',
} as const;

export type InstrumentStatus = typeof INSTRUMENT_STATUS[keyof typeof INSTRUMENT_STATUS];

export const SEVERITY = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    CRITICAL: 'CRITICAL',
} as const;

export type Severity = typeof SEVERITY[keyof typeof SEVERITY];

export const TICKET_CATEGORY = {
    TECHNICAL: 'TECHNICAL',
    WALLET: 'WALLET',
    TRADING: 'TRADING',
    ACCOUNT: 'ACCOUNT',
    OTHERS: 'OTHERS',
} as const;

export type TicketCategory = typeof TICKET_CATEGORY[keyof typeof TICKET_CATEGORY];

export const TRADING_CONFIG = {
    COMMISSION_RATE: 0.0003,
    MAX_COMMISSION: 20.0,
    MARGIN_REQUIREMENT: 0.20,
    SHORT_MARGIN_REQUIREMENT: 0.20,
    MARKET_ORDER_BUFFER: 1.01,
} as const;
