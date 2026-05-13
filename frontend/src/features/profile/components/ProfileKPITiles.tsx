import React from 'react';
import { Box, Grid, Typography, Skeleton, Tooltip, IconButton, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { ProfileStats } from '../services/profileStatsService';

interface ProfileKPITilesProps {
    stats: ProfileStats | null;
    balance: number;
    isLoading: boolean;
    onRefresh: () => void;
}

interface KPITileProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    subLabel?: string;
    color?: string;
    isLoading: boolean;
}

const KPITile: React.FC<KPITileProps> = ({ icon, label, value, subLabel, color, isLoading }) => {
    const theme = useTheme();
    return (
        <Box sx={{
            p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2,
            bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 2,
            transition: 'border-color 0.2s', '&:hover': { borderColor: 'primary.main' },
        }}>
            <Box sx={{
                width: 40, height: 40, borderRadius: 1.5, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                bgcolor: color ? `${color}18` : `${theme.palette.primary.main}18`,
                color: color || 'primary.main',
            }}>
                {icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                    {label}
                </Typography>
                {isLoading ? (
                    <Skeleton variant="text" width={80} height={28} />
                ) : (
                    <Typography variant="h6" fontWeight={800} noWrap sx={{ color: color, lineHeight: 1.2 }}>
                        {value}
                    </Typography>
                )}
                {subLabel && !isLoading && (
                    <Typography variant="caption" color="text.secondary">{subLabel}</Typography>
                )}
            </Box>
        </Box>
    );
};

export const ProfileKPITiles: React.FC<ProfileKPITilesProps> = ({ stats, balance, isLoading, onRefresh }) => {
    const theme = useTheme();

    const formatCurrency = (val: number) =>
        `₹${Math.abs(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const plColor = stats && stats.totalRealizedPL < 0
        ? theme.palette.error.main
        : theme.palette.success.main;

    return (
        <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Trading Overview
                </Typography>
                <Tooltip title="Refresh stats">
                    <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                    <KPITile
                        icon={<SwapHorizIcon fontSize="small" />}
                        label="Total Trades"
                        value={isLoading ? '—' : `${stats?.totalTrades ?? 0}`}
                        subLabel={`${stats?.closedTrades ?? 0} closed`}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPITile
                        icon={<EmojiEventsIcon fontSize="small" />}
                        label="Win Rate"
                        value={isLoading ? '—' : `${(stats?.winRate ?? 0).toFixed(1)}%`}
                        subLabel="Closed positions"
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPITile
                        icon={<ShowChartIcon fontSize="small" />}
                        label="Realized P&L"
                        value={isLoading ? '—' : `${stats && stats.totalRealizedPL < 0 ? '-' : '+'}${formatCurrency(stats?.totalRealizedPL ?? 0)}`}
                        color={isLoading ? undefined : plColor}
                        isLoading={isLoading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KPITile
                        icon={<AccountBalanceWalletIcon fontSize="small" />}
                        label="Cash Balance"
                        value={formatCurrency(balance)}
                        isLoading={isLoading}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
