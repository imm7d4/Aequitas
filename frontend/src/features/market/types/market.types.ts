export interface MarketStatus {
    exchange: 'NSE' | 'BSE';
    status: 'OPEN' | 'CLOSED' | 'PRE_MARKET' | 'POST_MARKET';
    currentTime: Date;
    nextOpen: Date;
    nextClose: Date;
}

export interface MarketHours {
    id: string;
    exchange: string;
    dayOfWeek: number;
    preMarketStart: string;
    preMarketEnd: string;
    marketOpen: string;
    marketClose: string;
    postMarketStart: string;
    postMarketEnd: string;
    isHoliday: boolean;
}

export interface MarketHoliday {
    id: string;
    exchange: string;
    date: Date;
    name: string;
}

export interface CreateMarketHoursRequest {
    exchange: string;
    dayOfWeek: number;
    preMarketStart: string;
    preMarketEnd: string;
    marketOpen: string;
    marketClose: string;
    postMarketStart: string;
    postMarketEnd: string;
}

export interface CreateHolidayRequest {
    exchange: string;
    date: string;
    name: string;
}

export interface MarketData {
    instrumentId: string;
    symbol: string;
    lastPrice: number;
    change: number;
    changePct: number;
    prevClose: number;
    open: number;
    high: number;
    low: number;
    volume: number;
    updatedAt: string;
}
