import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import { Box, CircularProgress, Typography, Paper, useTheme } from '@mui/material';
import { CandleInterval } from '../types/market.types';
import { useStockChart } from '../hooks/useStockChart';
import { useMarketData } from '../hooks/useMarketData';
import { useChartIndicators } from './StockChart/hooks/useChartIndicators';
import { useChartData } from './StockChart/hooks/useChartData';
import { ChartLegend } from './StockChart/ChartLegend';
import { ChartControls } from './StockChart/ChartControls';

interface StockChartProps {
    instrumentId: string;
    height?: number | string;
}

export function StockChart({ instrumentId, height = 400 }: StockChartProps) {
    const theme = useTheme();
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const candleSeriesRef = useRef<any>(null);
    const volumeSeriesRef = useRef<any>(null);
    const priceLineSeriesRef = useRef<any>(null);
    const indicatorSeriesRefs = useRef<Record<string, any>>({});
    const hasFittedRef = useRef(false);
    
    const [hoverData, setHoverData] = useState<any>(null);
    const [interval, setInterval] = useState<CandleInterval>('1m');
    
    const { candles, isLoading, error } = useStockChart(instrumentId, interval);
    const { prices } = useMarketData([instrumentId]);
    const currentPrice = prices[instrumentId]?.lastPrice || 0;
    const sanitizedCandles = useChartData(candles);

    const { indicators } = useChartIndicators(chartRef, indicatorSeriesRefs, sanitizedCandles, instrumentId);

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: { background: { type: ColorType.Solid, color: theme.palette.background.paper }, textColor: theme.palette.text.secondary },
            grid: { vertLines: { color: theme.palette.divider }, horzLines: { color: theme.palette.divider } },
            width: chartContainerRef.current.clientWidth,
            height: typeof height === 'number' ? height : 400,
            timeScale: { timeVisible: true, rightBarStaysOnScroll: true },
        }) as any;

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: theme.palette.success.main, downColor: theme.palette.error.main,
            wickUpColor: theme.palette.success.main, wickDownColor: theme.palette.error.main,
            borderVisible: false,
        });

        const volumeSeries = chart.addSeries(HistogramSeries, { color: '#26a69a', priceFormat: { type: 'volume' }, priceScaleId: '' });
        volumeSeries.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

        const priceLineSeries = chart.addSeries(LineSeries, { color: theme.palette.primary.main, lineWidth: 2, priceLineVisible: false });

        chart.subscribeCrosshairMove((param: any) => {
            if (!param.time || param.point === undefined || param.point.x < 0) {
                setHoverData(null);
                return;
            }
            const candle = param.seriesData.get(candleSeries);
            const indicatorValues: Record<string, any> = {};
            Object.entries(indicatorSeriesRefs.current).forEach(([k, s]) => {
                const val = param.seriesData.get(s);
                if (val) indicatorValues[k] = val.value !== undefined ? val.value : val;
            });
            setHoverData({ time: param.time, ohlc: candle, indicators: indicatorValues });
        });

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;
        priceLineSeriesRef.current = priceLineSeries;

        const handleResize = () => chartRef.current?.applyOptions({ 
            width: chartContainerRef.current?.clientWidth || 0,
            height: chartContainerRef.current?.clientHeight || 0 
        });
        window.addEventListener('resize', handleResize);
        return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
    }, []);

    // Sync Theme
    useEffect(() => {
        if (!chartRef.current) return;
        chartRef.current.applyOptions({
            layout: { background: { type: ColorType.Solid, color: theme.palette.background.paper }, textColor: theme.palette.text.secondary },
            grid: { vertLines: { color: theme.palette.divider }, horzLines: { color: theme.palette.divider } },
        });
        candleSeriesRef.current?.applyOptions({ upColor: theme.palette.success.main, downColor: theme.palette.error.main, wickUpColor: theme.palette.success.main, wickDownColor: theme.palette.error.main });
        priceLineSeriesRef.current?.applyOptions({ color: theme.palette.primary.main });
    }, [theme]);

    // Data Updates
    useEffect(() => {
        if (candleSeriesRef.current && volumeSeriesRef.current && sanitizedCandles.length > 0) {
            candleSeriesRef.current.setData(sanitizedCandles.map(({ time, open, high, low, close }) => ({ time, open, high, low, close })));
            volumeSeriesRef.current.setData(sanitizedCandles.map(({ time, open, close, volume }) => ({
                time, value: volume, color: close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
            })));
            if (!hasFittedRef.current) { chartRef.current?.timeScale().fitContent(); hasFittedRef.current = true; }
        }
    }, [sanitizedCandles]);

    // Price Line
    useEffect(() => {
        if (priceLineSeriesRef.current && currentPrice > 0 && sanitizedCandles.length > 0) {
            priceLineSeriesRef.current.setData([{ time: sanitizedCandles[sanitizedCandles.length - 1].time, value: currentPrice }]);
        }
    }, [currentPrice, sanitizedCandles]);

    // Oscillator Layout
    useEffect(() => {
        if (!chartRef.current || !candleSeriesRef.current) return;
        const subPanes = (indicators.rsi.enabled ? 1 : 0) + (indicators.macd.enabled ? 1 : 0);
        const mainBottom = subPanes === 2 ? 0.55 : subPanes === 1 ? 0.35 : 0.15;
        candleSeriesRef.current.priceScale().applyOptions({ scaleMargins: { top: 0.05, bottom: mainBottom } });
    }, [indicators.rsi.enabled, indicators.macd.enabled]);

    if (error) return <Paper sx={{ p: 4, textAlign: 'center', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography color="error">{error}</Typography></Paper>;

    return (
        <Box sx={{ width: '100%', height: height, display: 'flex', flexDirection: 'column' }}>
            <ChartControls interval={interval} onIntervalChange={(val) => { setInterval(val); hasFittedRef.current = false; }} />
            <Box sx={{ position: 'relative', flexGrow: 1, minHeight: 0 }}>
                {isLoading && <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, bgcolor: theme.palette.mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}><CircularProgress /></Box>}
                <ChartLegend hoverData={hoverData} indicatorSeriesRefs={indicatorSeriesRefs} />
                <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
            </Box>
        </Box>
    );
}
