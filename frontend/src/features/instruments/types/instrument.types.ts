export interface Instrument {
    id: string;
    symbol: string;
    name: string;
    isin: string;
    exchange: 'NSE' | 'BSE';
    type: 'STOCK' | 'ETF' | 'BOND' | 'MUTUAL_FUND';
    sector: string;
    lotSize: number;
    tickSize: number;
    isShortable?: boolean;
    status: 'ACTIVE' | 'SUSPENDED' | 'DELISTED';
    listingDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateInstrumentRequest {
    symbol: string;
    name: string;
    isin: string;
    exchange: string;
    type: string;
    sector: string;
    lotSize: number;
    tickSize: number;
    listingDate?: string;
    status?: string;
}

export interface UpdateInstrumentRequest {
    name?: string;
    sector?: string;
    lotSize?: number;
    tickSize?: number;
    status?: string;
}
