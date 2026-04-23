import { useState, useEffect } from 'react';
import { OrderResponse } from '../services/orderService';
import { Trade, tradeService } from '../services/tradeService';

export const useOrderTrades = (orders: OrderResponse[]) => {
    const [orderTrades, setOrderTrades] = useState<Record<string, Trade[]>>({});
    const [tradesLoading, setTradesLoading] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchNewTrades = async () => {
            const filledExpandedIds = orders
                .filter(o => o.status === 'FILLED' && !orderTrades[o.id] && !tradesLoading[o.id])
                .map(o => o.id);

            for (const id of filledExpandedIds) {
                setTradesLoading(prev => ({ ...prev, [id]: true }));
                try {
                    const trades = await tradeService.getTradesByOrder(id);
                    setOrderTrades(prev => ({ ...prev, [id]: trades }));
                } catch (error) {
                    console.error('Failed to fetch trades for order:', id, error);
                } finally {
                    setTradesLoading(prev => ({ ...prev, [id]: false }));
                }
            }
        };

        fetchNewTrades();
    }, [orders]);

    return { orderTrades, tradesLoading };
};
