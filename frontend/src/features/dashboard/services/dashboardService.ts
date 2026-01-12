import { api } from '@/lib/api/apiClient';

export interface PerformanceOverview {
    totalEquity: number;
    cashBalance: number;
    holdingsValue: number;
    realizedPL: number;
    unrealizedPL: number;
    profitFactor: number;
}

export interface TradingAnalysis {
    winCount: number;
    lossCount: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    largestWin: number;
    largestLoss: number;
    totalTrades: number;
}

export interface BehavioralInsights {
    winRateByTimeOfDay: Record<string, number>;
    winRateByDayOfWeek: Record<string, number>;
    avgHoldingDuration: {
        winningTrades: number;
        losingTrades: number;
    };
}

export interface SmartStock {
    instrumentId: string;
    symbol: string;
    name: string;
    lastPrice: number;
    changePct: number;
    volumeSurge: number;
    vwapDistance: string;
    breakoutFlag: string;
    newsFlag: string;
}

export interface MarketIntelligence {
    topGainers: SmartStock[];
    topLosers: SmartStock[];
}

export interface HoldingBreakdown {
    symbol: string;
    quantity: number;
    currentValue: number;
    unrealizedPL: number;
}

export interface PortfolioDistribution {
    cashBalance: number;
    holdingsValue: number;
    activePositions: number;
    holdingsBySymbol: HoldingBreakdown[];
}

export interface DashboardSummary {
    performanceOverview: PerformanceOverview;
    tradingAnalysis: TradingAnalysis;
    behavioralInsights: BehavioralInsights;
    marketIntelligence: MarketIntelligence;
    portfolioDistribution: PortfolioDistribution;
}

export const dashboardService = {
    async getSummary(): Promise<DashboardSummary> {
        const response = await api.get<DashboardSummary>('/dashboard/summary');
        return response.data;
    },
};
