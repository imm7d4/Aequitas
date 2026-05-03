import { useState, useMemo, useCallback } from 'react';
import { Instrument } from '@/features/instruments/types/instrument.types';
import { orderService } from '../services/orderService';
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';
import { 
    ORDER_SIDE, ORDER_TYPE, ORDER_VALIDITY, 
    TRAIL_TYPE, TRADING_INTENT, TRADING_CONFIG,
    ORDER_STATUS,
    OrderSide, OrderType, OrderValidity, TrailType
} from '@/shared/constants/AppConstants';

interface OrderState {
    side: OrderSide;
    orderType: OrderType;
    quantity: string;
    userPrice: string | null;
    stopPrice: string;
    limitPrice: string;
    trailAmount: string;
    trailType: TrailType;
    validity: OrderValidity;
    advancedMode: boolean;
    shortMode: boolean;
}

export const useTradePanel = (
    instrument: Instrument, 
    ltp: number, 
    initialSide: OrderSide = ORDER_SIDE.BUY, 
    initialQuantity?: number, 
    initialIntent?: string
) => {
    const [order, setOrder] = useState<OrderState>(() => ({
        side: initialSide,
        orderType: ORDER_TYPE.LIMIT,
        quantity: initialQuantity ? initialQuantity.toString() : '',
        userPrice: null,
        stopPrice: '',
        limitPrice: '',
        trailAmount: '',
        trailType: TRAIL_TYPE.PERCENTAGE,
        validity: ORDER_VALIDITY.DAY,
        advancedMode: false,
        shortMode: initialIntent === TRADING_INTENT.OPEN_SHORT || initialIntent === TRADING_INTENT.CLOSE_SHORT
    }));

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { fetchHoldings } = usePortfolioStore();

    // Derived price logic: If user hasn't touched the price, it follows LTP
    const price = useMemo(() => {
        if (order.userPrice !== null) return order.userPrice;
        return ltp > 0 ? ltp.toFixed(2) : '0';
    }, [order.userPrice, ltp]);

    const updateOrder = useCallback((updates: Partial<OrderState>) => {
        setOrder(prev => ({ ...prev, ...updates }));
    }, []);

    const estValue = useMemo(() => {
        const qty = parseInt(order.quantity) || 0;
        const p = order.orderType === ORDER_TYPE.LIMIT ? parseFloat(price) : ltp;
        const buffer = order.orderType === ORDER_TYPE.MARKET ? TRADING_CONFIG.MARKET_ORDER_BUFFER : 1.0;
        return qty * p * buffer;
    }, [order.quantity, order.orderType, price, ltp]);

    const fees = useMemo(() => {
        const commission = estValue * TRADING_CONFIG.COMMISSION_RATE;
        return Math.min(commission, TRADING_CONFIG.MAX_COMMISSION);
    }, [estValue]);

    const requiredMargin = useMemo(() => {
        if (order.shortMode && order.side === ORDER_SIDE.SELL) {
            return (estValue * TRADING_CONFIG.SHORT_MARGIN_REQUIREMENT) + fees;
        }
        return estValue + fees;
    }, [estValue, order.shortMode, order.side, fees]);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const orderRequest: any = {
                instrumentId: instrument.id,
                symbol: instrument.symbol,
                side: order.side,
                orderType: order.orderType,
                quantity: parseInt(order.quantity),
                validity: order.validity,
                clientOrderId: crypto.randomUUID(),
                intent: order.shortMode
                    ? (order.side === ORDER_SIDE.SELL ? TRADING_INTENT.OPEN_SHORT : TRADING_INTENT.CLOSE_SHORT)
                    : (order.side === ORDER_SIDE.BUY ? TRADING_INTENT.OPEN_LONG : TRADING_INTENT.CLOSE_LONG)
            };

            if (order.orderType === ORDER_TYPE.LIMIT) orderRequest.price = parseFloat(price);
            if ((order.orderType === ORDER_TYPE.STOP || order.orderType === ORDER_TYPE.STOP_LIMIT) && order.stopPrice) 
                orderRequest.stopPrice = parseFloat(order.stopPrice);
            if (order.orderType === ORDER_TYPE.STOP_LIMIT && order.limitPrice) 
                orderRequest.limitPrice = parseFloat(order.limitPrice);
            if (order.orderType === ORDER_TYPE.TRAILING_STOP && order.trailAmount) {
                orderRequest.trailAmount = parseFloat(order.trailAmount);
                orderRequest.trailType = order.trailType;
            }

            const res = await orderService.placeOrder(orderRequest);
            setSuccess(res.status === ORDER_STATUS.FILLED ? `Filled at ${res.avgFillPrice}!` : `Order ${res.orderId} placed!`);
            fetchHoldings();
            
            // Reset quantity and related fields
            updateOrder({ quantity: '', stopPrice: '', limitPrice: '', trailAmount: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        ...order,
        price,
        isLoading,
        error,
        setError,
        success,
        setSuccess,
        estValue,
        fees,
        requiredMargin,
        setSide: (side: OrderSide) => updateOrder({ side }),
        setOrderType: (orderType: OrderType) => updateOrder({ orderType }),
        setQuantity: (quantity: string) => updateOrder({ quantity }),
        setPrice: (p: string) => updateOrder({ userPrice: p }),
        setAdvancedMode: (advancedMode: boolean) => updateOrder({ advancedMode }),
        setShortMode: (shortMode: boolean) => updateOrder({ shortMode }),
        setStopPrice: (stopPrice: string) => updateOrder({ stopPrice }),
        setLimitPrice: (limitPrice: string) => updateOrder({ limitPrice }),
        setTrailAmount: (trailAmount: string) => updateOrder({ trailAmount }),
        setTrailType: (trailType: TrailType) => updateOrder({ trailType }),
        setValidity: (validity: OrderValidity) => updateOrder({ validity }),
        handlePlaceOrder
    };
};
