import { useMemo } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { HeatmapSector, SmartStock } from '../services/dashboardService';

interface MarketHeatmapProps {
    data: HeatmapSector[];
}

const CustomizedContent = (props: any) => {
    const { x, y, width, height, name, changePct, depth } = props;
    const theme = useTheme();

    if (width < 3 || height < 3) return null;

    const getColor = (pct: number) => {
        if (pct === undefined || pct === null) return '#444';
        if (pct > 0) {
            if (pct > 3) return '#006400'; // Darker Green
            if (pct > 1) return '#2e7d32'; 
            return '#4caf50'; 
        } else if (pct < 0) {
            const absPct = Math.abs(pct);
            if (absPct > 3) return '#8b0000'; // Darker Red
            if (absPct > 1) return '#c62828';
            return '#f44336';
        }
        return '#444'; // For 0 or N/A
    };

    const isSector = depth === 1;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: isSector ? theme.palette.action.hover : getColor(changePct),
                    stroke: '#fff',
                    strokeWidth: isSector ? 2 : 1,
                    strokeOpacity: isSector ? 0.3 : 1,
                }}
            />
            {isSector && height > 25 && (
                <text
                    x={x + 5}
                    y={y + 18}
                    fill={theme.palette.text.secondary}
                    fontSize={11}
                    fontWeight={600}
                    style={{ 
                        pointerEvents: 'none', 
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                    className="sector-label"
                >
                    {name}
                </text>
            )}
            {!isSector && width > 45 && height > 25 && (
                <g style={{ pointerEvents: 'none' }}>
                    <text
                        x={x + width / 2}
                        y={y + height / 2 - (height > 40 ? 4 : 0)}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize={width > 80 ? 14 : 11}
                        fontWeight={400}
                    >
                        {name}
                    </text>
                    {height > 40 && changePct !== undefined && changePct !== null && (
                        <text
                            x={x + width / 2}
                            y={y + height / 2 + 12}
                            textAnchor="middle"
                            fill="#fff"
                            fontSize={width > 80 ? 11 : 9}
                            fontWeight={300}
                            opacity={0.9}
                        >
                            {changePct > 0 ? '+' : ''}{changePct.toFixed(2)}%
                        </text>
                    )}
                </g>
            )}
        </g>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        if (data.depth < 2) return null;

        return (
            <Paper
                elevation={8}
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: (theme) => 
                        theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    minWidth: 200,
                }}
            >
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 0.5 }}>
                    {data.sector || 'Stock Details'}
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                    {data.fullName || data.name}
                </Typography>
                <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Current Price</Typography>
                        <Typography variant="body2" fontWeight={700}>₹{data.lastPrice?.toLocaleString('en-IN')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Daily Change</Typography>
                        <Typography
                            variant="body2"
                            fontWeight={800}
                            sx={{ color: data.changePct >= 0 ? 'success.main' : 'error.main' }}
                        >
                            {data.changePct > 0 ? '▲' : '▼'} {Math.abs(data.changePct)?.toFixed(2)}%
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        );
    }
    return null;
};

export function MarketHeatmap({ data }: MarketHeatmapProps): JSX.Element {
    const theme = useTheme();

    const formattedData = useMemo(() => {
        return {
            name: 'Market',
            children: data.map(sector => ({
                name: sector.name,
                children: sector.stocks.map((stock: SmartStock) => ({
                    name: stock.symbol,
                    fullName: stock.name,
                    sector: sector.name,
                    value: 1, // Equally weighted for now
                    changePct: stock.changePct,
                    lastPrice: stock.lastPrice,
                }))
            }))
        };
    }, [data]);

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#fff',
                backgroundImage: 'none',
            }}
        >
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography 
                        variant="h5" 
                        fontWeight={400} 
                        sx={{ 
                            letterSpacing: '-0.02em', 
                            mb: 0.5,
                            color: 'text.primary'
                        }}
                    >
                        Market Distribution
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sector-wise performance of key indices
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#b71c1c' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={400}>Negative</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#1b5e20' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={400}>Positive</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ width: '100%', height: 600, borderRadius: 2, overflow: 'hidden' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={formattedData.children}
                        dataKey="value"
                        aspectRatio={16 / 9}
                        stroke="#fff"
                        isAnimationActive={true}
                        content={<CustomizedContent />}
                    >
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                    </Treemap>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}
