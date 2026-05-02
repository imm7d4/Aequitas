import { Box, Typography, alpha, useTheme } from '@mui/material';

interface ChartLegendProps {
    hoverData: any;
    indicatorSeriesRefs: React.MutableRefObject<Record<string, any>>;
}

export const ChartLegend = ({ hoverData, indicatorSeriesRefs }: ChartLegendProps) => {
    const theme = useTheme();

    if (!hoverData) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 10,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                bgcolor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)',
                p: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                maxWidth: '80%',
            }}
        >
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" fontWeight={700} sx={{ color: 'text.primary', mr: 1 }}>
                    {new Date(hoverData.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                {Object.entries(indicatorSeriesRefs.current).map(([key, series]) => {
                    let value = hoverData.indicators?.[key];
                    if (value === undefined || value === null) return null;

                    let label = key.toUpperCase();
                    if (key.startsWith('sma-')) label = `SMA(${key.split('-')[1]})`;
                    if (key.startsWith('ema-')) label = `EMA(${key.split('-')[1]})`;
                    if (key === 'bb-upper') label = 'BB Upper';
                    if (key === 'bb-middle') label = 'BB Middle';
                    if (key === 'bb-lower') label = 'BB Lower';
                    if (key === 'rsi') label = 'RSI';
                    if (key === 'macd-line') label = 'MACD';
                    if (key === 'macd-signal') label = 'Signal';
                    if (key === 'macd-hist') label = 'Hist';

                    const color = series.options().color;

                    return (
                        <Box key={key} sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            <Box sx={{ width: 8, height: 2, bgcolor: color }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                {label}: <span style={{ color: color, fontWeight: 700 }}>{typeof value === 'number' ? value.toFixed(2) : value}</span>
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};
