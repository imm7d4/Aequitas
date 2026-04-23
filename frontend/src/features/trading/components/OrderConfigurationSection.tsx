import React from 'react';
import { Stack, TextField, InputAdornment, ToggleButtonGroup, ToggleButton, FormControl, Select, MenuItem } from '@mui/material';

interface OrderConfigurationSectionProps {
    orderType: string;
    onOrderTypeChange: (val: any) => void;
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
    trailType: 'ABSOLUTE' | 'PERCENTAGE';
    onTrailTypeChange: (val: any) => void;
    validity: string;
    onValidityChange: (val: any) => void;
    advancedMode: boolean;
    side: 'BUY' | 'SELL';
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
                value={['LIMIT', 'MARKET'].includes(orderType) ? orderType : ''}
                exclusive
                onChange={(_, v) => v && onOrderTypeChange(v)}
                size="small"
            >
                <ToggleButton value="LIMIT">LIMIT</ToggleButton>
                <ToggleButton value="MARKET">MARKET</ToggleButton>
            </ToggleButtonGroup>

            {advancedMode && (
                <FormControl fullWidth size="small">
                    <Select
                        value={['STOP', 'STOP_LIMIT', 'TRAILING_STOP'].includes(orderType) ? orderType : ''}
                        displayEmpty
                        onChange={(e) => e.target.value && onOrderTypeChange(e.target.value as any)}
                        sx={{ borderRadius: '8px', fontWeight: 600 }}
                    >
                        <MenuItem value="" disabled>Advanced Order Type</MenuItem>
                        <MenuItem value="STOP">STOP (MARKET)</MenuItem>
                        <MenuItem value="STOP_LIMIT">STOP-LIMIT</MenuItem>
                        <MenuItem value="TRAILING_STOP">TRAILING STOP</MenuItem>
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

            {orderType === 'LIMIT' && (
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

            {(orderType === 'STOP' || orderType === 'STOP_LIMIT') && (
                <TextField
                    fullWidth label="Trigger Price" type="number" size="small"
                    value={stopPrice}
                    onChange={(e) => onStopPriceChange(e.target.value)}
                    helperText={`Triggers when ${side === 'BUY' ? 'rises to' : 'falls to'}`}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                    }}
                />
            )}

            {orderType === 'STOP_LIMIT' && (
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

            {orderType === 'TRAILING_STOP' && (
                <Stack direction="row" spacing={1}>
                    <TextField
                        fullWidth label="Trail Amount" type="number" size="small"
                        value={trailAmount}
                        onChange={(e) => onTrailAmountChange(e.target.value)}
                    />
                    <Select
                        value={trailType}
                        onChange={(e) => onTrailTypeChange(e.target.value as any)}
                        size="small"
                        sx={{ minWidth: 80, borderRadius: '8px', fontWeight: 700 }}
                    >
                        <MenuItem value="PERCENTAGE">%</MenuItem>
                        <MenuItem value="ABSOLUTE">₹</MenuItem>
                    </Select>
                </Stack>
            )}

            <FormControl fullWidth size="small">
                <Select
                    value={validity}
                    onChange={(e) => onValidityChange(e.target.value as any)}
                    sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}
                >
                    <MenuItem value="DAY">DAY (Standard)</MenuItem>
                    <MenuItem value="IOC">IOC (Immediate or Cancel)</MenuItem>
                    <MenuItem value="GTC" disabled={orderType === 'MARKET'}>GTC (Good Til Cancelled)</MenuItem>
                </Select>
            </FormControl>
        </Stack>
    );
};
