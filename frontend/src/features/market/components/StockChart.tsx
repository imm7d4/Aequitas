import { useEffect, useRef, useState, useMemo } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries, LineSeries } from 'lightweight-charts';
import { Box, CircularProgress, Typography, Paper, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import { CandleInterval } from '../types/market.types';
import { useStockChart } from '../hooks/useStockChart';
import { useMarketData } from '../hooks/useMarketData';
import { useIndicatorStore } from '../store/indicatorStore';
import { IndicatorService } from '../services/indicatorService';

interface StockChartProps {
    instrumentId: string;
    symbol: string;
}

export function StockChart({ instrumentId, symbol }: StockChartProps) {
    const theme = useTheme();
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const candleSeriesRef = useRef<any>(null);
    const volumeSeriesRef = useRef<any>(null);
    const priceLineSeriesRef = useRef<any>(null);
    const hasFittedRef = useRef(false);

    // Indicator series refs
    const indicatorSeriesRefs = useRef<Record<string, any>>({});

    const [interval, setInterval] = useState<CandleInterval>('1m');
    const { candles, isLoading, error } = useStockChart(instrumentId, interval);
    const { prices } = useMarketData([instrumentId]);
    const currentPrice = prices[instrumentId]?.lastPrice || 0;

    // Get indicator settings
    const { getIndicators } = useIndicatorStore();
    const indicators = getIndicators(instrumentId);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: theme.palette.background.paper },
                textColor: theme.palette.text.secondary,
            },
            grid: {
                vertLines: { color: theme.palette.divider },
                horzLines: { color: theme.palette.divider },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                rightBarStaysOnScroll: true,
                tickMarkFormatter: (time: number) => {
                    const date = new Date(time * 1000);
                    return date.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                },
            },
            localization: {
                locale: 'en-IN',
                timeFormatter: (time: number) => {
                    const date = new Date(time * 1000);
                    return date.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                },
            },
        }) as any;

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: theme.palette.success.main,
            downColor: theme.palette.error.main,
            borderVisible: false,
            wickUpColor: theme.palette.success.main,
            wickDownColor: theme.palette.error.main,
        });

        const volumeSeries = chart.addSeries(HistogramSeries, {
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '', // set as overlay
        });

        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        // Add current price line series
        const priceLineSeries = chart.addSeries(LineSeries, {
            color: theme.palette.primary.main,
            lineWidth: 2,
            priceLineVisible: false,
            lastValueVisible: true,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 4,
        });

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;
        priceLineSeriesRef.current = priceLineSeries;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [theme]);

    // Centralized sanitized data source for chart and indicators
    const sanitizedCandles = useMemo(() => {
        if (!candles || candles.length === 0) return [];

        const now = Date.now();
        return candles
            .filter(c => {
                const candleTime = new Date(c.time).getTime();
                return candleTime <= now;
            })
            .filter(c => {
                const time = new Date(c.time).getTime();
                const isValidTime = !isNaN(time);
                const hasData = c.open !== null && c.open !== undefined &&
                    c.high !== null && c.high !== undefined &&
                    c.low !== null && c.low !== undefined &&
                    c.close !== null && c.close !== undefined;
                return isValidTime && hasData;
            })
            .map(c => ({
                time: Math.floor(new Date(c.time).getTime() / 1000) as any,
                open: Number(c.open),
                high: Number(c.high),
                low: Number(c.low),
                close: Number(c.close),
                volume: Number(c.volume || 0),
            }))
            .sort((a, b) => a.time - b.time)
            .filter((item, index, self) =>
                index === 0 || item.time !== self[index - 1].time
            );
    }, [candles]);

    // Update chart data when sanitized candles change
    useEffect(() => {
        if (candleSeriesRef.current && volumeSeriesRef.current && sanitizedCandles.length > 0) {
            const chartData = sanitizedCandles.map(({ time, open, high, low, close }) => ({
                time, open, high, low, close
            }));

            const volumeData = sanitizedCandles.map(({ time, open, close, volume }) => ({
                time,
                value: volume,
                color: close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
            }));

            candleSeriesRef.current.setData(chartData);
            volumeSeriesRef.current.setData(volumeData);

            if (!hasFittedRef.current) {
                chartRef.current?.timeScale().fitContent();
                hasFittedRef.current = true;
            }
        }
    }, [sanitizedCandles]);

    // Reset fit flag when interval changes
    useEffect(() => {
        hasFittedRef.current = false;
    }, [interval]);

    // Update current price line when price changes
    useEffect(() => {
        if (priceLineSeriesRef.current && currentPrice > 0 && sanitizedCandles.length > 0) {
            const lastCandle = sanitizedCandles[sanitizedCandles.length - 1];
            priceLineSeriesRef.current.setData([
                { time: lastCandle.time, value: currentPrice }
            ]);
        }
    }, [currentPrice, sanitizedCandles]);

    // Calculate indicators using useMemo
    const closePrices = useMemo(() => sanitizedCandles.map(c => c.close), [sanitizedCandles]);

    const smaData = useMemo(() => {
        if (!indicators.sma.enabled || closePrices.length === 0) return null;
        const periods = indicators.sma.settings.periods || [20, 50, 200];
        return periods.map(period => ({
            period,
            values: IndicatorService.calculateSMA(closePrices, period)
        }));
    }, [closePrices, indicators.sma]);

    const emaData = useMemo(() => {
        if (!indicators.ema.enabled || closePrices.length === 0) return null;
        const periods = indicators.ema.settings.periods || [9, 21, 50];
        return periods.map(period => ({
            period,
            values: IndicatorService.calculateEMA(closePrices, period)
        }));
    }, [closePrices, indicators.ema]);

    const bollingerData = useMemo(() => {
        if (!indicators.bollingerBands.enabled || closePrices.length === 0) return null;
        const period = indicators.bollingerBands.settings.period || 20;
        const stdDev = indicators.bollingerBands.settings.stdDev || 2;
        return IndicatorService.calculateBollingerBands(closePrices, period, stdDev);
    }, [closePrices, indicators.bollingerBands]);

    const vwapData = useMemo(() => {
        if (!indicators.vwap.enabled || sanitizedCandles.length === 0) return null;
        return IndicatorService.calculateVWAP(sanitizedCandles);
    }, [sanitizedCandles, indicators.vwap]);

    const rsiData = useMemo(() => {
        if (!indicators.rsi.enabled || closePrices.length === 0) return null;
        const period = indicators.rsi.settings.period || 14;
        return IndicatorService.calculateRSI(closePrices, period);
    }, [closePrices, indicators.rsi]);

    const macdData = useMemo(() => {
        if (!indicators.macd.enabled || closePrices.length === 0) return null;
        const fast = indicators.macd.settings.fastPeriod || 12;
        const slow = indicators.macd.settings.slowPeriod || 26;
        const signal = indicators.macd.settings.signalPeriod || 9;
        return IndicatorService.calculateMACD(closePrices, fast, slow, signal);
    }, [closePrices, indicators.macd]);

    // Adjust chart layout based on active oscillators (RSI, MACD)
    useEffect(() => {
        if (!chartRef.current || !candleSeriesRef.current) return;

        const rsiEnabled = !!indicators.rsi.enabled;
        const macdEnabled = !!indicators.macd.enabled;

        // Base layout
        let mainTop = 0.05;
        let mainBottom = 0.15; // Space for volume at bottom

        if (rsiEnabled && macdEnabled) {
            mainBottom = 0.55; // Main chart takes top 45%
        } else if (rsiEnabled || macdEnabled) {
            mainBottom = 0.35; // Main chart takes top 65%
        }

        candleSeriesRef.current.priceScale().applyOptions({
            scaleMargins: {
                top: mainTop,
                bottom: mainBottom,
            },
        });

        // Volume always stays as overlay at the bottom
        volumeSeriesRef.current?.priceScale().applyOptions({
            scaleMargins: {
                top: 0.85,
                bottom: 0,
            },
        });
    }, [indicators.rsi.enabled, indicators.macd.enabled]);

    // Render SMA indicators
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

        const colors = ['#2196F3', '#FF9800', '#F44336']; // Blue, Orange, Red

        smaData.forEach((sma, index) => {
            const key = `sma-${sma.period}`;

            // Remove existing series if it exists
            if (indicatorSeriesRefs.current[key]) {
                chartRef.current.removeSeries(indicatorSeriesRefs.current[key]);
            }

            if (sma.values.length > 0) {
                const series = chartRef.current.addSeries(LineSeries, {
                    color: colors[index] || '#2196F3',
                    lineWidth: 2,
                    title: `SMA(${sma.period})`,
                    priceLineVisible: false,
                    lastValueVisible: true
                });

                const offset = closePrices.length - sma.values.length;
                const data = sma.values.map((value, i) => ({
                    time: sanitizedCandles[offset + i].time,
                    value
                }));

                series.setData(data);
                indicatorSeriesRefs.current[key] = series;
            }
        });
    }, [smaData, candles, closePrices.length]);

    // Render EMA indicators
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

        const colors = ['#00BCD4', '#9C27B0', '#E91E63']; // Cyan, Purple, Pink

        emaData.forEach((ema, index) => {
            const key = `ema-${ema.period}`;

            if (indicatorSeriesRefs.current[key]) {
                chartRef.current.removeSeries(indicatorSeriesRefs.current[key]);
            }

            if (ema.values.length > 0) {
                const series = chartRef.current.addSeries(LineSeries, {
                    color: colors[index] || '#00BCD4',
                    lineWidth: 2,
                    title: `EMA(${ema.period})`,
                    priceLineVisible: false,
                    lastValueVisible: true
                });

                const offset = closePrices.length - ema.values.length;
                const data = ema.values.map((value, i) => ({
                    time: sanitizedCandles[offset + i].time,
                    value
                }));

                series.setData(data);
                indicatorSeriesRefs.current[key] = series;
            }
        });
    }, [emaData, candles, closePrices.length]);

    // Render Bollinger Bands
    useEffect(() => {
        if (!chartRef.current || !bollingerData) {
            ['bb-upper', 'bb-middle', 'bb-lower'].forEach(key => {
                if (indicatorSeriesRefs.current[key]) {
                    chartRef.current?.removeSeries(indicatorSeriesRefs.current[key]);
                    delete indicatorSeriesRefs.current[key];
                }
            });
            return;
        }

        if (bollingerData.length > 0) {
            const offset = closePrices.length - bollingerData.length;
            const color = indicators.bollingerBands.color || '#757575';

            // Upper band
            if (indicatorSeriesRefs.current['bb-upper']) {
                chartRef.current.removeSeries(indicatorSeriesRefs.current['bb-upper']);
            }
            const upperSeries = chartRef.current.addSeries(LineSeries, {
                color,
                lineWidth: 1,
                lineStyle: 2, // Dashed
                title: 'BB Upper',
                priceLineVisible: false,
                lastValueVisible: false
            });
            upperSeries.setData(bollingerData.map((bb, i) => ({
                time: sanitizedCandles[offset + i].time,
                value: bb.upper
            })));
            indicatorSeriesRefs.current['bb-upper'] = upperSeries;

            // Middle band
            if (indicatorSeriesRefs.current['bb-middle']) {
                chartRef.current.removeSeries(indicatorSeriesRefs.current['bb-middle']);
            }
            const middleSeries = chartRef.current.addSeries(LineSeries, {
                color,
                lineWidth: 1,
                title: 'BB Middle',
                priceLineVisible: false,
                lastValueVisible: false
            });
            middleSeries.setData(bollingerData.map((bb, i) => ({
                time: sanitizedCandles[offset + i].time,
                value: bb.middle
            })));
            indicatorSeriesRefs.current['bb-middle'] = middleSeries;

            // Lower band
            if (indicatorSeriesRefs.current['bb-lower']) {
                chartRef.current.removeSeries(indicatorSeriesRefs.current['bb-lower']);
            }
            const lowerSeries = chartRef.current.addSeries(LineSeries, {
                color,
                lineWidth: 1,
                lineStyle: 2, // Dashed
                title: 'BB Lower',
                priceLineVisible: false,
                lastValueVisible: false
            });
            lowerSeries.setData(bollingerData.map((bb, i) => ({
                time: sanitizedCandles[offset + i].time,
                value: bb.lower
            })));
            indicatorSeriesRefs.current['bb-lower'] = lowerSeries;
        }
    }, [bollingerData, candles, closePrices.length, indicators.bollingerBands.color]);

    // Render VWAP
    useEffect(() => {
        if (!chartRef.current || !vwapData) {
            if (indicatorSeriesRefs.current['vwap']) {
                chartRef.current?.removeSeries(indicatorSeriesRefs.current['vwap']);
                delete indicatorSeriesRefs.current['vwap'];
            }
            return;
        }

        if (vwapData.length > 0) {
            if (indicatorSeriesRefs.current['vwap']) {
                chartRef.current.removeSeries(indicatorSeriesRefs.current['vwap']);
            }

            const series = chartRef.current.addSeries(LineSeries, {
                color: indicators.vwap.color || '#FFC107',
                lineWidth: 2,
                title: 'VWAP',
                priceLineVisible: false,
                lastValueVisible: true
            });

            const data = vwapData.map((value, i) => ({
                time: sanitizedCandles[i].time,
                value
            }));

            series.setData(data);
            indicatorSeriesRefs.current['vwap'] = series;
        }
    }, [vwapData, sanitizedCandles, indicators.vwap.color]);

    // Render RSI
    useEffect(() => {
        if (!chartRef.current || !rsiData) {
            if (indicatorSeriesRefs.current['rsi']) {
                chartRef.current.removeSeries(indicatorSeriesRefs.current['rsi']);
                delete indicatorSeriesRefs.current['rsi'];
            }
            return;
        }

        const key = 'rsi';
        if (indicatorSeriesRefs.current[key]) {
            chartRef.current.removeSeries(indicatorSeriesRefs.current[key]);
        }

        const rsiColor = indicators.rsi.color || '#9C27B0';
        const series = chartRef.current.addSeries(LineSeries, {
            color: rsiColor,
            lineWidth: 2,
            title: 'RSI',
            priceScaleId: 'rsi',
        });

        // Configure RSI sub-pane margins
        const rsiTop = indicators.macd.enabled ? 0.45 : 0.7;
        const rsiBottom = indicators.macd.enabled ? 0.3 : 0.05;

        chartRef.current.priceScale('rsi').applyOptions({
            scaleMargins: {
                top: rsiTop,
                bottom: rsiBottom,
            },
            autoScale: false,
        });

        const offset = closePrices.length - rsiData.length;
        const data = rsiData.map((value, i) => ({
            time: sanitizedCandles[offset + i].time,
            value
        }));

        series.setData(data);

        // Add RSI levels
        series.createPriceLine({ price: 70, color: 'rgba(156, 39, 176, 0.4)', lineWidth: 1, lineStyle: 1, title: 'OB' });
        series.createPriceLine({ price: 30, color: 'rgba(156, 39, 176, 0.4)', lineWidth: 1, lineStyle: 1, title: 'OS' });

        indicatorSeriesRefs.current[key] = series;
    }, [rsiData, sanitizedCandles, indicators.rsi.color, indicators.macd.enabled]);

    // Render MACD
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

        // Cleanup before re-rendering
        ['macd-line', 'macd-signal', 'macd-hist'].forEach(key => {
            if (indicatorSeriesRefs.current[key]) {
                chartRef.current.removeSeries(indicatorSeriesRefs.current[key]);
            }
        });

        const macdTop = 0.75;
        const macdBottom = 0;

        chartRef.current.priceScale('macd').applyOptions({
            scaleMargins: {
                top: macdTop,
                bottom: macdBottom,
            },
        });

        const offset = closePrices.length - macdData.length;
        const commonData = macdData.map((d, i) => ({ time: sanitizedCandles[offset + i].time, ...d }));

        // Histogram
        const histSeries = chartRef.current.addSeries(HistogramSeries, {
            priceScaleId: 'macd',
            title: 'MACD Hist',
            priceLineVisible: false,
        });
        histSeries.setData(commonData.map(d => ({
            time: d.time,
            value: d.histogram,
            color: d.histogram >= 0 ? theme.palette.success.light : theme.palette.error.light
        })));
        indicatorSeriesRefs.current['macd-hist'] = histSeries;

        // Signal Line
        const signalSeries = chartRef.current.addSeries(LineSeries, {
            color: '#FF9800',
            lineWidth: 1,
            priceScaleId: 'macd',
            title: 'Signal',
            priceLineVisible: false,
            lastValueVisible: false,
        });
        signalSeries.setData(commonData.map(d => ({ time: d.time, value: d.signal })));
        indicatorSeriesRefs.current['macd-signal'] = signalSeries;

        // MACD Line
        const macdLineSeries = chartRef.current.addSeries(LineSeries, {
            color: '#2196F3',
            lineWidth: 1,
            priceScaleId: 'macd',
            title: 'MACD',
            priceLineVisible: false,
        });
        macdLineSeries.setData(commonData.map(d => ({ time: d.time, value: d.MACD })));
        indicatorSeriesRefs.current['macd-line'] = macdLineSeries;

    }, [macdData, sanitizedCandles, theme.palette]);

    const handleIntervalChange = (
        _event: React.MouseEvent<HTMLElement>,
        newInterval: CandleInterval | null,
    ) => {
        if (newInterval !== null) {
            setInterval(newInterval);
        }
    };

    if (error) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600}>
                    {symbol} Chart
                </Typography>
                <ToggleButtonGroup
                    value={interval}
                    exclusive
                    onChange={handleIntervalChange}
                    size="small"
                    aria-label="time interval"
                >
                    <ToggleButton value="1m">1M</ToggleButton>
                    <ToggleButton value="5m">5M</ToggleButton>
                    <ToggleButton value="15m">15M</ToggleButton>
                    <ToggleButton value="1h">1H</ToggleButton>
                    <ToggleButton value="1d">1D</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box sx={{ position: 'relative', height: 400 }}>
                {isLoading && (
                    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, bgcolor: 'rgba(255,255,255,0.7)' }}>
                        <CircularProgress />
                    </Box>
                )}
                <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
            </Box>
        </Paper>
    );
}
