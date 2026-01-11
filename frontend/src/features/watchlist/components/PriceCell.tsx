import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const flashGreen = keyframes`
  0% { background-color: rgba(76, 175, 80, 0.3); }
  100% { background-color: transparent; }
`;

const flashRed = keyframes`
  0% { background-color: rgba(244, 67, 54, 0.3); }
  100% { background-color: transparent; }
`;

interface PriceCellProps {
    price: number;
    change: number;
    changePct: number;
}

export const PriceCell: React.FC<PriceCellProps> = ({ price, change, changePct }) => {
    const [flash, setFlash] = useState<'green' | 'red' | null>(null);
    const prevPriceRef = useRef<number>(price);

    useEffect(() => {
        if (prevPriceRef.current !== price) {
            if (price > prevPriceRef.current) {
                setFlash('green');
            } else if (price < prevPriceRef.current) {
                setFlash('red');
            }
            prevPriceRef.current = price;

            // Clear flash after animation
            const timer = setTimeout(() => setFlash(null), 700);
            return () => clearTimeout(timer);
        }
    }, [price]);

    return (
        <Box
            sx={{
                animation: flash === 'green'
                    ? `${flashGreen} 0.7s ease-out`
                    : flash === 'red'
                        ? `${flashRed} 0.7s ease-out`
                        : 'none',
                padding: '4px 8px',
                borderRadius: 1,
            }}
        >
            <Typography variant="body2" fontWeight={600}>
                ₹{price.toLocaleString()}
            </Typography>
            <Typography
                variant="caption"
                sx={{
                    color: change > 0 ? 'success.main' : change < 0 ? 'error.main' : 'text.secondary',
                    fontWeight: 600,
                }}
            >
                {change > 0 ? '+' : ''}{changePct.toFixed(2)}%
            </Typography>
        </Box>
    );
};
