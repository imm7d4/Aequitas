import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, HistogramSeries } from 'lightweight-charts';
import { Box, CircularProgress, Typography, Paper, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import { CandleInterval } from '../types/market.types';
import { useStockChart } from '../hooks/useStockChart';

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

    const [interval, setInterval] = useState<CandleInterval>('1m');
    const { candles, isLoading, error } = useStockChart(instrumentId, interval);

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

        chartRef.current = chart;
        candleSeriesRef.current = candleSeries;
        volumeSeriesRef.current = volumeSeries;

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

    useEffect(() => {
        if (candleSeriesRef.current && volumeSeriesRef.current && candles.length > 0) {
            const sanitizedData = candles
                .filter(c => {
                    const time = new Date(c.time).getTime();
                    const isValidTime = !isNaN(time);
                    const hasData = c.open !== null && c.open !== undefined &&
                        c.high !== null && c.high !== undefined &&
                        c.low !== null && c.low !== undefined &&
                        c.close !== null && c.close !== undefined;

                    if (!isValidTime || !hasData) {
                        console.warn('Skipping invalid candle data:', c);
                        return false;
                    }
                    return true;
                })
                .map(c => ({
                    time: Math.floor(new Date(c.time).getTime() / 1000) as any,
                    open: Number(c.open),
                    high: Number(c.high),
                    low: Number(c.low),
                    close: Number(c.close),
                    volume: Number(c.volume || 0),
                }))
                .sort((a, b) => a.time - b.time);

            // Remove duplicate timestamps (lightweight-charts doesn't allow them)
            const uniqueData = sanitizedData.filter((item, index, self) =>
                index === 0 || item.time !== self[index - 1].time
            );

            if (uniqueData.length === 0) return;

            const chartData = uniqueData.map(({ time, open, high, low, close }) => ({
                time, open, high, low, close
            }));

            const volumeData = uniqueData.map(({ time, open, close, volume }) => ({
                time,
                value: volume,
                color: close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
            }));

            candleSeriesRef.current.setData(chartData);
            volumeSeriesRef.current.setData(volumeData);

            // Adjust the view to show the latest data
            chartRef.current?.timeScale().fitContent();
        }
    }, [candles]);

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
