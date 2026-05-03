import { useEffect, useMemo } from 'react';
import { LineSeries, HistogramSeries } from 'lightweight-charts';
import { IndicatorService } from '../../../services/indicatorService';
import { useIndicatorStore } from '../../../store/indicatorStore';
import { useTheme } from '@mui/material';

export const useChartIndicators = (
    chartRef: any,
    indicatorSeriesRefs: React.MutableRefObject<Record<string, any>>,
    sanitizedCandles: any[],
    instrumentId: string
) => {
    const theme = useTheme();
    const { getIndicators } = useIndicatorStore();
    const indicators = getIndicators(instrumentId);
    const closePrices = useMemo(() => sanitizedCandles.map(c => c.close), [sanitizedCandles]);

    // SMA Data
    const smaData = useMemo(() => {
        if (!indicators.sma.enabled || closePrices.length === 0) return null;
        const periods = indicators.sma.settings.periods || [20, 50, 200];
        return periods.map((period: number) => ({
            period,
            values: IndicatorService.calculateSMA(closePrices, period)
        }));
    }, [closePrices, indicators.sma]);

    // EMA Data
    const emaData = useMemo(() => {
        if (!indicators.ema.enabled || closePrices.length === 0) return null;
        const periods = indicators.ema.settings.periods || [9, 21, 50];
        return periods.map((period: number) => ({
            period,
            values: IndicatorService.calculateEMA(closePrices, period)
        }));
    }, [closePrices, indicators.ema]);

    // Bollinger Data
    const bollingerData = useMemo(() => {
        if (!indicators.bollingerBands.enabled || closePrices.length === 0) return null;
        const period = indicators.bollingerBands.settings.period || 20;
        const stdDev = indicators.bollingerBands.settings.stdDev || 2;
        return IndicatorService.calculateBollingerBands(closePrices, period, stdDev);
    }, [closePrices, indicators.bollingerBands]);

    // MACD Data
    const macdData = useMemo(() => {
        if (!indicators.macd.enabled || closePrices.length === 0) return null;
        const fast = indicators.macd.settings.fastPeriod || 12;
        const slow = indicators.macd.settings.slowPeriod || 26;
        const signal = indicators.macd.settings.signalPeriod || 9;
        return IndicatorService.calculateMACD(closePrices, fast, slow, signal);
    }, [closePrices, indicators.macd]);

    // SMA Rendering
    useEffect(() => {
        if (!chartRef.current || !smaData) {
            Object.keys(indicatorSeriesRefs.current).forEach(key => {
                if (key.startsWith('sma-')) {
                    chartRef.current?.removeSeries(indicatorSeriesRefs.current[key]);
                    delete indicatorSeriesRefs.current[key];
                }
            });
            return;
        }
        const colors = ['#2196F3', '#FF9800', '#F44336'];
        smaData.forEach((sma: any, index: number) => {
            const key = `sma-${sma.period}`;
            if (indicatorSeriesRefs.current[key]) chartRef.current.removeSeries(indicatorSeriesRefs.current[key]);
            if (sma.values.length > 0) {
                const series = chartRef.current.addSeries(LineSeries, {
                    color: colors[index] || '#2196F3',
                    lineWidth: 2,
                    title: `SMA(${sma.period})`,
                    priceLineVisible: false,
                    lastValueVisible: true
                });
                const offset = closePrices.length - sma.values.length;
                series.setData(sma.values.map((value: number, i: number) => ({ time: sanitizedCandles[offset + i].time, value })));
                indicatorSeriesRefs.current[key] = series;
            }
        });
    }, [smaData, sanitizedCandles, closePrices.length, chartRef, indicatorSeriesRefs]);

    // EMA Rendering
    useEffect(() => {
        if (!chartRef.current || !emaData) {
            Object.keys(indicatorSeriesRefs.current).forEach(key => {
                if (key.startsWith('ema-')) {
                    chartRef.current?.removeSeries(indicatorSeriesRefs.current[key]);
                    delete indicatorSeriesRefs.current[key];
                }
            });
            return;
        }
        const colors = ['#00BCD4', '#9C27B0', '#E91E63'];
        emaData.forEach((ema: any, index: number) => {
            const key = `ema-${ema.period}`;
            if (indicatorSeriesRefs.current[key]) chartRef.current.removeSeries(indicatorSeriesRefs.current[key]);
            if (ema.values.length > 0) {
                const series = chartRef.current.addSeries(LineSeries, {
                    color: colors[index] || '#00BCD4',
                    lineWidth: 2,
                    title: `EMA(${ema.period})`,
                    priceLineVisible: false,
                    lastValueVisible: true
                });
                const offset = closePrices.length - ema.values.length;
                series.setData(ema.values.map((value: number, i: number) => ({ time: sanitizedCandles[offset + i].time, value })));
                indicatorSeriesRefs.current[key] = series;
            }
        });
    }, [emaData, sanitizedCandles, closePrices.length, chartRef, indicatorSeriesRefs]);

    // MACD Rendering
    useEffect(() => {
        if (!chartRef.current || !macdData) {
            ['macd-line', 'macd-signal', 'macd-hist'].forEach(key => {
                if (indicatorSeriesRefs.current[key]) {
                    chartRef.current.removeSeries(indicatorSeriesRefs.current[key]);
                    delete indicatorSeriesRefs.current[key];
                }
            });
            return;
        }
        ['macd-line', 'macd-signal', 'macd-hist'].forEach(key => {
            if (indicatorSeriesRefs.current[key]) chartRef.current.removeSeries(indicatorSeriesRefs.current[key]);
        });
        const offset = closePrices.length - macdData.length;
        const histSeries = chartRef.current.addSeries(HistogramSeries, { priceScaleId: 'macd', title: 'MACD Hist', priceLineVisible: false });
        chartRef.current.priceScale('macd').applyOptions({ scaleMargins: { top: 0.75, bottom: 0 } });
        histSeries.setData(macdData.map((d: any, i: number) => ({
            time: sanitizedCandles[offset + i].time,
            value: d.histogram,
            color: d.histogram >= 0 ? theme.palette.success.light : theme.palette.error.light
        })));
        indicatorSeriesRefs.current['macd-hist'] = histSeries;

        const signalSeries = chartRef.current.addSeries(LineSeries, { color: '#FF9800', lineWidth: 1, priceScaleId: 'macd', title: 'Signal', priceLineVisible: false, lastValueVisible: false });
        signalSeries.setData(macdData.map((d: any, i: number) => ({ time: sanitizedCandles[offset + i].time, value: d.signal })));
        indicatorSeriesRefs.current['macd-signal'] = signalSeries;

        const macdLineSeries = chartRef.current.addSeries(LineSeries, { color: '#2196F3', lineWidth: 1, priceScaleId: 'macd', title: 'MACD', priceLineVisible: false });
        macdLineSeries.setData(macdData.map((d: any, i: number) => ({ time: sanitizedCandles[offset + i].time, value: d.MACD })));
        indicatorSeriesRefs.current['macd-line'] = macdLineSeries;
    }, [macdData, sanitizedCandles, closePrices.length, chartRef, indicatorSeriesRefs, theme]);

    return { indicators, smaData, emaData, bollingerData, macdData };
};
