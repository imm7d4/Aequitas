import React from 'react';
import { useTheme } from '@mui/material';

export const HeatmapCell = (props: any) => {
    const { x, y, width, height, name, changePct, depth } = props;
    const theme = useTheme();

    if (width < 3 || height < 3) return null;

    const getColor = (pct: number) => {
        if (pct === undefined || pct === null) return '#444';
        if (pct > 0) {
            if (pct > 3) return '#006400';
            if (pct > 1) return '#2e7d32'; 
            return '#4caf50'; 
        } else if (pct < 0) {
            const absPct = Math.abs(pct);
            if (absPct > 3) return '#8b0000';
            if (absPct > 1) return '#c62828';
            return '#f44336';
        }
        return '#444';
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
