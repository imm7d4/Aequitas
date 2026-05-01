import React from 'react';
import { Stack, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, FormControl, Select, MenuItem } from '@mui/material';
import { 
    ORDER_TYPE, TRAIL_TYPE, ORDER_VALIDITY, ORDER_SIDE,
    OrderType, TrailType, OrderValidity, OrderSide
} from '@/shared/constants/AppConstants';

interface OrderConfigurationSectionProps {
    orderType: OrderType;
    onOrderTypeChange: (val: OrderType) => void;
    quantity: string;
    onQuantityChange: (val: string) => void;
    price: string;
    onPriceChange: (val: string) => void;
    stopPrice: string;
    onStopPriceChange: (val: string) => void;
    limitPrice: string;
    onLimitPriceChange: (val: string) => void;
    trailAmount: string;
    onTrailAmountChange: (val: string) => void;
    trailType: TrailType;
    onTrailTypeChange: (val: TrailType) => void;
    validity: OrderValidity;
    onValidityChange: (val: OrderValidity) => void;
    advancedMode: boolean;
    side: OrderSide;
}

export const OrderConfigurationSection: React.FC<OrderConfigurationSectionProps> = ({
    orderType, onOrderTypeChange, quantity, onQuantityChange, price, onPriceChange,
    stopPrice, onStopPriceChange, limitPrice, onLimitPriceChange,
    trailAmount, onTrailAmountChange, trailType, onTrailTypeChange,
    validity, onValidityChange, advancedMode, side
}) => {
    return (
        <Stack spacing={1.2}>
            <ToggleButtonGroup
                fullWidth
                value={([ORDER_TYPE.LIMIT, ORDER_TYPE.MARKET] as string[]).includes(orderType) ? orderType : ''}
                exclusive
                onChange={(_, v) => v && onOrderTypeChange(v as OrderType)}
                size="small"
            >
                <ToggleButton value={ORDER_TYPE.LIMIT}>LIMIT</ToggleButton>
                <ToggleButton value={ORDER_TYPE.MARKET}>MARKET</ToggleButton>
            </ToggleButtonGroup>

            {advancedMode && (
                <FormControl fullWidth size="small">
                    <Select
                        value={([ORDER_TYPE.STOP, ORDER_TYPE.STOP_LIMIT, ORDER_TYPE.TRAILING_STOP] as string[]).includes(orderType) ? orderType : ''}
                        displayEmpty
                        onChange={(e) => e.target.value && onOrderTypeChange(e.target.value as OrderType)}
                        sx={{ borderRadius: '8px', fontWeight: 600 }}
                    >
                        <MenuItem value="" disabled>Advanced Order Type</MenuItem>
                        <MenuItem value={ORDER_TYPE.STOP}>STOP (MARKET)</MenuItem>
                        <MenuItem value={ORDER_TYPE.STOP_LIMIT}>STOP-LIMIT</MenuItem>
                        <MenuItem value={ORDER_TYPE.TRAILING_STOP}>TRAILING STOP</MenuItem>
                    </Select>
                </FormControl>
            )}

            <TextField
                fullWidth label="Quantity" type="number" size="small"
                value={quantity}
                onChange={(e) => onQuantityChange(e.target.value)}
                InputProps={{
                    endAdornment: <InputAdornment position="end" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>QTY</InputAdornment>,
                    sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                }}
            />

            {orderType === ORDER_TYPE.LIMIT && (
                <TextField
                    fullWidth label="Limit Price" type="number" size="small"
                    value={price}
                    onChange={(e) => onPriceChange(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                    }}
                />
            )}

            {(orderType === ORDER_TYPE.STOP || orderType === ORDER_TYPE.STOP_LIMIT) && (
                <TextField
                    fullWidth label="Trigger Price" type="number" size="small"
                    value={stopPrice}
                    onChange={(e) => onStopPriceChange(e.target.value)}
                    helperText={`Triggers when ${side === ORDER_SIDE.BUY ? 'rises to' : 'falls to'}`}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                    }}
                />
            )}

            {orderType === ORDER_TYPE.STOP_LIMIT && (
                <TextField
                    fullWidth label="Limit Price" type="number" size="small"
                    value={limitPrice}
                    onChange={(e) => onLimitPriceChange(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                    }}
                />
            )}

            {orderType === ORDER_TYPE.TRAILING_STOP && (
                <Stack direction="row" spacing={1}>
                    <TextField
                        fullWidth label="Trail Amount" type="number" size="small"
                        value={trailAmount}
                        onChange={(e) => onTrailAmountChange(e.target.value)}
                    />
                    <Select
                        value={trailType}
                        onChange={(e) => onTrailTypeChange(e.target.value as TrailType)}
                        size="small"
                        sx={{ minWidth: 80, borderRadius: '8px', fontWeight: 700 }}
                    >
                        <MenuItem value={TRAIL_TYPE.PERCENTAGE}>%</MenuItem>
                        <MenuItem value={TRAIL_TYPE.ABSOLUTE}>₹</MenuItem>
                    </Select>
                </Stack>
            )}

            <FormControl fullWidth size="small">
                <Select
                    value={validity}
                    onChange={(e) => onValidityChange(e.target.value as OrderValidity)}
                    sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}
                >
                    <MenuItem value={ORDER_VALIDITY.DAY}>DAY (Standard)</MenuItem>
                    <MenuItem value={ORDER_VALIDITY.IOC}>IOC (Immediate or Cancel)</MenuItem>
                    <MenuItem value={ORDER_VALIDITY.GTC} disabled={orderType === ORDER_TYPE.MARKET}>GTC (Good Til Cancelled)</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
};
