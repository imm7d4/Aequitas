import { SMA, EMA, RSI, MACD, BollingerBands } from 'technicalindicators';

export interface CandleData {
    high: number;
    low: number;
    close: number;
    volume: number;
}

export class IndicatorService {
    /**
     * Calculate Simple Moving Average
     * @param prices Array of closing prices (last 100 candles)
     * @param period SMA period (e.g., 20, 50, 200)
     * @returns Array of SMA values
     */
    static calculateSMA(prices: number[], period: number): number[] {
        if (prices.length < period) {
            console.warn(`Insufficient data for SMA(${period}). Need ${period}, have ${prices.length}`);
            // Return empty array if not enough data
            if (prices.length < period) return [];
        }

        const result = SMA.calculate({ period, values: prices });
        return result;
    }

    /**
     * Calculate Exponential Moving Average
     * @param prices Closing prices
     * @param period EMA period (e.g., 9, 21, 50)
     * @returns Array of EMA values
     */
    static calculateEMA(prices: number[], period: number): number[] {
        if (prices.length < period) {
            console.warn(`Insufficient data for EMA(${period}). Need ${period}, have ${prices.length}`);
            return [];
        }

        const result = EMA.calculate({ period, values: prices });
        return result;
    }

    /**
     * Calculate RSI (Relative Strength Index)
     * @param prices Closing prices
     * @param period RSI period (default 14)
     * @returns Array of RSI values (0-100)
     */
    static calculateRSI(prices: number[], period: number = 14): number[] {
        if (prices.length < period + 1) {
            console.warn(`Insufficient data for RSI(${period}). Need ${period + 1}, have ${prices.length}`);
            return [];
        }

        const result = RSI.calculate({ period, values: prices });
        return result;
    }

    /**
     * Calculate MACD (Moving Average Convergence Divergence)
     * @param prices Closing prices
     * @param fastPeriod Fast EMA period (default 12)
     * @param slowPeriod Slow EMA period (default 26)
     * @param signalPeriod Signal line period (default 9)
     * @returns Array of {MACD, signal, histogram}
     */
    static calculateMACD(
        prices: number[],
        fastPeriod: number = 12,
        slowPeriod: number = 26,
        signalPeriod: number = 9
    ): Array<{ MACD: number; signal: number; histogram: number }> {
        const requiredLength = slowPeriod + signalPeriod;
        if (prices.length < requiredLength) {
            console.warn(`Insufficient data for MACD. Need ${requiredLength}, have ${prices.length}`);
            return [];
        }

        const result = MACD.calculate({
            values: prices,
            fastPeriod,
            slowPeriod,
            signalPeriod,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        });

        // Filter out undefined values and map to our type
        return result
            .filter(r => r.MACD !== undefined && r.signal !== undefined && r.histogram !== undefined)
            .map(r => ({
                MACD: r.MACD!,
                signal: r.signal!,
                histogram: r.histogram!
            }));
    }

    /**
     * Calculate Bollinger Bands
     * @param prices Closing prices
     * @param period Period (default 20)
     * @param stdDev Standard deviation multiplier (default 2)
     * @returns Array of {upper, middle, lower, pb, bandwidth}
     */
    static calculateBollingerBands(
        prices: number[],
        period: number = 20,
        stdDev: number = 2
    ): Array<{ upper: number; middle: number; lower: number; pb: number }> {
        if (prices.length < period) {
            console.warn(`Insufficient data for Bollinger Bands(${period}). Need ${period}, have ${prices.length}`);
            return [];
        }

        const result = BollingerBands.calculate({
            period,
            values: prices,
            stdDev
        });

        // Map to our simplified type (library doesn't include bandwidth)
        return result.map(r => ({
            upper: r.upper,
            middle: r.middle,
            lower: r.lower,
            pb: r.pb
        }));
    }

    /**
     * Calculate VWAP (Volume Weighted Average Price)
     * Requires high, low, close, volume
     * @param candles Array of candle data
     * @returns Array of VWAP values
     */
    static calculateVWAP(candles: CandleData[]): number[] {
        if (candles.length === 0) return [];

        const vwap: number[] = [];
        let cumulativeTPV = 0; // Typical Price × Volume
        let cumulativeVolume = 0;

        candles.forEach(candle => {
            const typicalPrice = (candle.high + candle.low + candle.close) / 3;
            cumulativeTPV += typicalPrice * candle.volume;
            cumulativeVolume += candle.volume;

            if (cumulativeVolume > 0) {
                vwap.push(cumulativeTPV / cumulativeVolume);
            } else {
                vwap.push(candle.close); // Fallback to close price
            }
        });

        return vwap;
    }

    /**
     * Get data sufficiency warning
     * @param indicator Indicator name
     * @param period Required period
     * @param available Available data points
     * @returns Warning message or null
     */
    static getDataSufficiencyWarning(
        indicator: string,
        period: number,
        available: number
    ): string | null {
        if (available < period) {
            return `⚠️ ${indicator}(${period}) requires ${period} candles, only ${available} available. Results may be incomplete.`;
        }
        return null;
    }
}
