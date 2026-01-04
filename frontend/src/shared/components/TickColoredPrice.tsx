import { Box } from '@mui/material';
import { usePrevious } from '@/shared/hooks/usePrevious';
import type { MarketData } from '@/features/market/types/market.types';

interface PriceDisplayProps {
    marketData?: MarketData;
}

/**
 * Component that displays price with color based on tick-to-tick change
 * Green if price increased from last tick, Red if decreased
 */
export const TickColoredPrice = ({ marketData }: PriceDisplayProps) => {
    const currentPrice = marketData?.lastPrice;
    const previousPrice = usePrevious(currentPrice);

    // Determine color based on tick-to-tick change
    const getColor = () => {
        if (!currentPrice || !previousPrice) {
            // No previous price to compare, use overall change
            return marketData?.change && marketData.change >= 0 ? 'success.main' : 'error.main';
        }

        // Compare current tick to previous tick
        return currentPrice >= previousPrice ? 'success.main' : 'error.main';
    };

    return (
        <Box component="span" sx={{ color: getColor(), fontWeight: 600 }}>
            {marketData ? `₹${marketData.lastPrice.toFixed(2)}` : '--'}
        </Box>
    );
};
