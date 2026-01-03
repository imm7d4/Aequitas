export interface Watchlist {
    id: string;
    userId: string;
    name: string;
    instrumentIds: string[];
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWatchlistRequest {
    name: string;
}
