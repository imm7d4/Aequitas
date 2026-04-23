import React from 'react';
import { Box, Typography, Stack, Switch, Chip } from '@mui/material';
import { Settings as AdvancedIcon } from '@mui/icons-material';

interface TradePanelHeaderProps {
    symbol: string;
    isShortable: boolean;
    shortMode: boolean;
    onShortModeChange: (enabled: boolean) => void;
    advancedMode: boolean;
    onAdvancedModeToggle: () => void;
}

export const TradePanelHeader: React.FC<TradePanelHeaderProps> = ({
    symbol, isShortable, shortMode, onShortModeChange, advancedMode, onAdvancedModeToggle
}) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="subtitle1" fontWeight={800} sx={{ letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                Trade {symbol}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                {isShortable && (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Typography
                            variant="caption"
                            fontWeight={700}
                            color={shortMode ? 'warning.main' : 'text.secondary'}
                            sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}
                        >
                            {advancedMode ? 'Short' : 'Short Mode'}
                        </Typography>
                        <Switch
                            checked={shortMode}
                            onChange={(e) => onShortModeChange(e.target.checked)}
                            size="small"
                            color="warning"
                        />
                    </Stack>
                )}

                <Chip
                    icon={<AdvancedIcon sx={{ fontSize: '14px !important' }} />}
                    label={advancedMode ? 'Advanced' : 'Basic'}
                    onClick={onAdvancedModeToggle}
                    size="small"
                    sx={{
                        cursor: 'pointer',
                        fontWeight: 700,
                        borderRadius: '8px',
                        bgcolor: advancedMode ? 'primary.main' : 'rgba(0,0,0,0.05)',
                        color: advancedMode ? 'white' : 'text.primary'
                    }}
                />
            </Box>
        </Box>
    );
};
