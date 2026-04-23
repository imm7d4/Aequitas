import { useState, useMemo, useEffect } from 'react';
import { Instrument } from '@/features/instruments/types/instrument.types';
import { orderService } from '../services/orderService';
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';

export const useTradePanel = (instrument: Instrument, ltp: number, initialSide: 'BUY' | 'SELL' = 'BUY', initialQuantity?: number, initialIntent?: string) => {
    const [side, setSide] = useState<'BUY' | 'SELL'>(initialSide);
    const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TRAILING_STOP'>('LIMIT');
    const [quantity, setQuantity] = useState<string>(initialQuantity ? initialQuantity.toString() : '');
    const [price, setPrice] = useState<string>(ltp > 0 ? ltp.toFixed(2) : '0');
    const [isPriceTouched, setIsPriceTouched] = useState(false);
    const [advancedMode, setAdvancedMode] = useState(false);
    const [shortMode, setShortMode] = useState(() => initialIntent === 'OPEN_SHORT' || initialIntent === 'CLOSE_SHORT');
    const [stopPrice, setStopPrice] = useState<string>('');
    const [limitPrice, setLimitPrice] = useState<string>('');
    const [trailAmount, setTrailAmount] = useState<string>('');
    const [trailType, setTrailType] = useState<'ABSOLUTE' | 'PERCENTAGE'>('PERCENTAGE');
    const [validity, setValidity] = useState<'DAY' | 'IOC' | 'GTC'>('DAY');
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
        const p = orderType === 'LIMIT' ? parseFloat(price) : ltp;
        const buffer = orderType === 'MARKET' ? 1.01 : 1.0;
        return qty * p * buffer;
    }, [quantity, price, orderType, ltp]);

    const fees = useMemo(() => {
        const commissionRate = 0.0003; 
        const maxCommission = 20.0;     
        const commission = estValue * commissionRate;
        return Math.min(commission, maxCommission);
    }, [estValue]);

    const requiredMargin = useMemo(() => {
        if (shortMode && side === 'SELL') {
            return (estValue * 0.20) + fees;
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
                    ? (side === 'SELL' ? 'OPEN_SHORT' : 'CLOSE_SHORT')
                    : (side === 'BUY' ? 'OPEN_LONG' : 'CLOSE_LONG')
            };
            if (orderType === 'LIMIT' && price) orderRequest.price = parseFloat(price);
            if ((orderType === 'STOP' || orderType === 'STOP_LIMIT') && stopPrice) orderRequest.stopPrice = parseFloat(stopPrice);
            if (orderType === 'STOP_LIMIT' && limitPrice) orderRequest.limitPrice = parseFloat(limitPrice);
            if (orderType === 'TRAILING_STOP' && trailAmount) {
                orderRequest.trailAmount = parseFloat(trailAmount);
                orderRequest.trailType = trailType;
            }

            const res = await orderService.placeOrder(orderRequest);
            setSuccess(res.status === 'FILLED' ? `Filled at ${res.avgFillPrice}!` : `Order ${res.orderId} placed!`);
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
