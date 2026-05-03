import { useMemo, useState } from 'react';
import { usePortfolioStore } from '../store/portfolioStore';
import { orderService } from '@/features/trading/services/orderService';
import { Instrument } from '@/features/instruments/types/instrument.types';

export const usePositionBanner = (instrument: Instrument, ltp: number) => {
    const { getPositionByInstrumentId, fetchHoldings } = usePortfolioStore();
    const position = getPositionByInstrumentId(instrument.id);
    const [isSquaringOff, setIsSquaringOff] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const unrealizedPL = useMemo(() => {
        if (!position || ltp <= 0) return 0;
        return position.positionType === 'SHORT' 
            ? (position.avgEntryPrice - ltp) * position.quantity 
            : (ltp - position.avgEntryPrice) * position.quantity;
    }, [position, ltp]);

    const plPercentage = useMemo(() => {
        if (!position || position.avgEntryPrice === 0) return 0;
        return (unrealizedPL / (position.avgEntryPrice * position.quantity)) * 100;
    }, [position, unrealizedPL]);

    const handleSquareOff = async () => {
        if (!position || isSquaringOff) return;
        setIsSquaringOff(true);
        try {
            const isShort = position.positionType === 'SHORT';
            await orderService.placeOrder({
                instrumentId: instrument.id, symbol: instrument.symbol, side: isShort ? 'BUY' : 'SELL',
                orderType: 'MARKET', quantity: Math.abs(position.quantity), clientOrderId: crypto.randomUUID(),
                intent: isShort ? 'CLOSE_SHORT' : 'CLOSE_LONG'
            });
            setMessage({ type: 'success', text: 'Position closed!' });
            setTimeout(() => fetchHoldings(), 500);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to square off' });
        } finally { setIsSquaringOff(false); }
    };

    return { position, unrealizedPL, plPercentage, isSquaringOff, message, setMessage, handleSquareOff };
};
