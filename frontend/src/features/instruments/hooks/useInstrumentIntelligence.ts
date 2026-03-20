import { useMemo } from 'react';
import { IndicatorService } from '@/features/market/services/indicatorService';
import { Candle } from '@/features/market/types/market.types';

export type SentimentType = 'ELITE BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'OVERSOLD' | 'ACCUMULATING' | 'DISTRIBUTING';
export type TrendStrength = 'STRONG UP' | 'UP' | 'SIDEWAYS' | 'DOWN' | 'STRONG DOWN';

export interface InstrumentIntelligence {
    relativeVolume: number | null;
    rsi: number | null;
    sentiment: SentimentType;
    trend: TrendStrength;
    score: number; // 0-100 confluence score
    volatility: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const useInstrumentIntelligence = (
    instrumentId: string, 
    minuteCandles: Candle[], 
    dailyCandles: Candle[]
): InstrumentIntelligence => {
    
    return useMemo(() => {
        if (!instrumentId || minuteCandles.length < 20) {
            return {
                relativeVolume: null,
                rsi: null,
                sentiment: 'NEUTRAL',
                trend: 'SIDEWAYS',
                score: 50,
                volatility: 'MEDIUM'
            };
        }

        // 1. Relative Volume (RVOL) - Last 20 vs Previous 20
        const volumes = minuteCandles.map(c => c.volume);
        const lastVol = volumes[volumes.length - 1];
        const avgVol = volumes.slice(-20).reduce((a, b) => a + b, 0) / 20;
        const relativeVolume = avgVol > 0 ? lastVol / avgVol : 1;

        // 2. Advanced Indicator Logic (Short-term Confluence)
        const prices = minuteCandles.map(c => c.close);
        
        // SMAs/EMAs
        const ema9Arr = IndicatorService.calculateEMA(prices, 9);
        const ema21Arr = IndicatorService.calculateEMA(prices, 21);
        const ema50Arr = IndicatorService.calculateEMA(prices, 50);
        
        const latestEma9 = ema9Arr[ema9Arr.length - 1];
        const latestEma21 = ema21Arr[ema21Arr.length - 1];
        const latestEma50 = ema50Arr[ema50Arr.length - 1];
        const currentPrice = prices[prices.length - 1];

        // RSI
        const rsiArr = IndicatorService.calculateRSI(prices, 14);
        const rsi = rsiArr[rsiArr.length - 1] || 50;

        // 3. Scoring & Logic
        // Trend Factor (40%)
        let trendScore = 50;
        let trend: TrendStrength = 'SIDEWAYS';
        
        if (latestEma9 > latestEma21 && latestEma21 > latestEma50) {
            trendScore = 90;
            trend = 'STRONG UP';
        } else if (latestEma9 > latestEma21) {
            trendScore = 70;
            trend = 'UP';
        } else if (latestEma9 < latestEma21 && latestEma21 < latestEma50) {
            trendScore = 10;
            trend = 'STRONG DOWN';
        } else if (latestEma9 < latestEma21) {
            trendScore = 30;
            trend = 'DOWN';
        }

        // Momentum Factor (RSI) - Mean Reversion vs Trend
        let momentumScore = 50;
        if (rsi > 75) momentumScore = 20; // Overbought
        else if (rsi > 60) momentumScore = 80; // Strong Momentum
        else if (rsi < 25) momentumScore = 80; // Oversold (Expect Bounce)
        else if (rsi < 40) momentumScore = 20; // Weak Momentum

        // FINAL CONFLUENCE SCORE
        const score = (trendScore * 0.6) + (momentumScore * 0.4);

        // SENTIMENT BADGE
        let sentiment: SentimentType = 'NEUTRAL';
        if (score >= 85) sentiment = 'ELITE BULLISH';
        else if (score >= 70) sentiment = 'BULLISH';
        else if (score <= 15) sentiment = 'OVERSOLD';
        else if (score <= 30) sentiment = 'BEARISH';
        else if (latestEma50 && Math.abs(currentPrice - latestEma50) / latestEma50 < 0.005) sentiment = 'ACCUMULATING';

        // Volatility (ATR-like logic)
        const last5 = prices.slice(-5);
        const avg = last5.reduce((a, b) => a + b, 0) / 5;
        const variance = last5.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / 5;
        const stdDev = Math.sqrt(variance);
        const volatility: 'LOW' | 'MEDIUM' | 'HIGH' = (stdDev / currentPrice) > 0.002 ? 'HIGH' : (stdDev / currentPrice) < 0.0005 ? 'LOW' : 'MEDIUM';

        return {
            relativeVolume,
            rsi,
            sentiment,
            trend,
            score: Math.round(score),
            volatility
        };
    }, [instrumentId, minuteCandles, dailyCandles]);
};
