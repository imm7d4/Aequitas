import { useState, useMemo, useEffect } from 'react';
import { Instrument } from '@/features/instruments/types/instrument.types';
import { orderService } from '../services/orderService';
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';
import { 
    ORDER_SIDE, ORDER_TYPE, ORDER_VALIDITY, 
    TRAIL_TYPE, TRADING_INTENT, TRADING_CONFIG,
    ORDER_STATUS,
    OrderSide, OrderType, OrderValidity, TrailType
} from '@/shared/constants/AppConstants';

export const useTradePanel = (instrument: Instrument, ltp: number, initialSide: OrderSide = ORDER_SIDE.BUY, initialQuantity?: number, initialIntent?: string) => {
    const [side, setSide] = useState<OrderSide>(initialSide);
    const [orderType, setOrderType] = useState<OrderType>(ORDER_TYPE.LIMIT);
    const [quantity, setQuantity] = useState<string>(initialQuantity ? initialQuantity.toString() : '');
    const [price, setPrice] = useState<string>(ltp > 0 ? ltp.toFixed(2) : '0');
    const [isPriceTouched, setIsPriceTouched] = useState(false);
    const [advancedMode, setAdvancedMode] = useState(false);
    const [shortMode, setShortMode] = useState(() => initialIntent === TRADING_INTENT.OPEN_SHORT || initialIntent === TRADING_INTENT.CLOSE_SHORT);
    const [stopPrice, setStopPrice] = useState<string>('');
    const [limitPrice, setLimitPrice] = useState<string>('');
    const [trailAmount, setTrailAmount] = useState<string>('');
    const [trailType, setTrailType] = useState<TrailType>(TRAIL_TYPE.PERCENTAGE);
    const [validity, setValidity] = useState<OrderValidity>(ORDER_VALIDITY.DAY);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { fetchHoldings } = usePortfolioStore();

    useEffect(() => {
        if (ltp > 0 && (price === '0' || price === '') && !isPriceTouched) {
            setPrice(ltp.toFixed(2));
        }
    }, [ltp, price, isPriceTouched]);

    useEffect(() => {
        setPrice(ltp > 0 ? ltp.toFixed(2) : '0');
        setIsPriceTouched(false);
    }, [instrument.id]);

    const estValue = useMemo(() => {
        const qty = parseInt(quantity) || 0;
        const p = orderType === ORDER_TYPE.LIMIT ? parseFloat(price) : ltp;
        const buffer = orderType === ORDER_TYPE.MARKET ? TRADING_CONFIG.MARKET_ORDER_BUFFER : 1.0;
        return qty * p * buffer;
    }, [quantity, price, orderType, ltp]);

    const fees = useMemo(() => {
        const commissionRate = TRADING_CONFIG.COMMISSION_RATE; 
        const maxCommission = TRADING_CONFIG.MAX_COMMISSION;     
        const commission = estValue * commissionRate;
        return Math.min(commission, maxCommission);
    }, [estValue]);

    const requiredMargin = useMemo(() => {
        if (shortMode && side === ORDER_SIDE.SELL) {
            return (estValue * TRADING_CONFIG.SHORT_MARGIN_REQUIREMENT) + fees;
        }
        return estValue + fees;
    }, [estValue, shortMode, side, fees]);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const orderRequest: any = {
                instrumentId: instrument.id,
                symbol: instrument.symbol,
                side,
                orderType,
                quantity: parseInt(quantity),
                validity,
                clientOrderId: crypto.randomUUID(),
                intent: shortMode
                    ? (side === ORDER_SIDE.SELL ? TRADING_INTENT.OPEN_SHORT : TRADING_INTENT.CLOSE_SHORT)
                    : (side === ORDER_SIDE.BUY ? TRADING_INTENT.OPEN_LONG : TRADING_INTENT.CLOSE_LONG)
            };
            if (orderType === ORDER_TYPE.LIMIT && price) orderRequest.price = parseFloat(price);
            if ((orderType === ORDER_TYPE.STOP || orderType === ORDER_TYPE.STOP_LIMIT) && stopPrice) orderRequest.stopPrice = parseFloat(stopPrice);
            if (orderType === ORDER_TYPE.STOP_LIMIT && limitPrice) orderRequest.limitPrice = parseFloat(limitPrice);
            if (orderType === ORDER_TYPE.TRAILING_STOP && trailAmount) {
                orderRequest.trailAmount = parseFloat(trailAmount);
                orderRequest.trailType = trailType;
            }

            const res = await orderService.placeOrder(orderRequest);
            setSuccess(res.status === ORDER_STATUS.FILLED ? `Filled at ${res.avgFillPrice}!` : `Order ${res.orderId} placed!`);
            fetchHoldings();
            setQuantity('');
            setStopPrice('');
            setLimitPrice('');
            setTrailAmount('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        side, setSide,
        orderType, setOrderType,
        quantity, setQuantity,
        price, setPrice, setIsPriceTouched,
        advancedMode, setAdvancedMode,
        shortMode, setShortMode,
        stopPrice, setStopPrice,
        limitPrice, setLimitPrice,
        trailAmount, setTrailAmount,
        trailType, setTrailType,
        validity, setValidity,
        isLoading, error, setError, success, setSuccess,
        estValue, fees, requiredMargin,
        handlePlaceOrder
    };
};
