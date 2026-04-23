import React from 'react';
import { Box, Typography, Chip, Grid, Stack } from '@mui/material';
import { CustomGrid, Column } from '../../../shared/components/CustomGrid';
import { AuditLog } from '../services/adminService';
import { AuditDetailTable } from '../components/AuditLogDetails';

interface AuditLogGridProps {
    logs: AuditLog[];
    loading: boolean;
    page: number;
    rowsPerPage: number;
    onPageChange: (page: number) => void;
    onRowsPerPageChange: (rows: number) => void;
    unmaskedLogs: Set<string>;
    onUnmaskRequest: (log: AuditLog) => void;
}

const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
        'USER_LOGIN': 'Login', 'USER_LOGOUT': 'Logout', 'USER_REGISTERED': 'Registration',
        'ORDER_PLACED': 'Order Placed', 'ORDER_CANCELLED': 'Order Cancelled', 'ORDER_FILLED': 'Order Filled',
        'TRADE_SETTLED': 'Trade Settled', 'DEPOSIT_COMPLETED': 'Deposit', 'TELEMETRY_PAGE_VISIT': 'Page Visit',
        'JIT_APPROVED': 'JIT Access', 'WALLET_ADJUSTMENT': 'Ledger Adjustment', 'CONFIG_UPDATE': 'Config Change'
    };
    return labels[action] || action.replace(/_/g, ' ');
};

const getActionColor = (action: string): string => {
    if (action.includes('REGISTER')) return 'info';
    if (action.includes('LOGIN')) return 'success';
    if (action.includes('LOGOUT') || action.includes('JIT')) return 'warning';
    if (action.includes('ADJUSTMENT')) return 'error';
    if (action.includes('CONFIG')) return 'secondary';
    if (action.includes('ORDER')) return 'primary';
    if (action.includes('TRADE')) return 'success';
    if (action.includes('DEPOSIT')) return 'info';
    return 'default';
};

export const AuditLogGrid: React.FC<AuditLogGridProps> = ({
    logs, loading, page, rowsPerPage, 
    onPageChange, onRowsPerPageChange,
    unmaskedLogs, onUnmaskRequest
}) => {
    const columns: Column<AuditLog>[] = [
        {
            id: 'timestamp',
            label: 'Time',
            minWidth: 160,
            render: (row) => (
                <Typography variant="body2" sx={{ fontFamily: 'Monospace', fontSize: '0.75rem' }}>
                    {new Date(row.timestamp).toLocaleString()}
                </Typography>
            )
        },
        {
            id: 'correlation_id',
            label: 'Correlation ID',
            minWidth: 120,
            render: (row) => (
                <Typography variant="body2" sx={{ fontFamily: 'Monospace', fontSize: '0.7rem', color: 'primary.main', fontWeight: 600 }}>
                    {row.correlation_id.substring(0, 8)}...
                </Typography>
            )
        },
        {
            id: 'actor_name',
            label: 'User Name',
            minWidth: 150,
            render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.actor_name}</Typography>
            )
        },
        {
            id: 'action',
            label: 'Action',
            minWidth: 140,
            render: (row) => (
                <Chip
                    label={getActionLabel(row.action)}
                    size="small"
                    color={getActionColor(row.action) as any}
                    sx={{ fontWeight: 700, borderRadius: '4px', fontSize: '0.7rem' }}
                />
            )
        },
        {
            id: 'description',
            label: 'Event Summary',
            minWidth: 250,
            render: (row) => (
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {row.description}
                </Typography>
            )
        },
    ];

    const renderExpansion = (row: AuditLog) => (
        <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '8px', m: 1, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: 1 }}>Details</Typography>
                    <AuditDetailTable 
                        data={row.new_value || row.old_value} 
                        log={row} 
                        unmaskedLogs={unmaskedLogs}
                        onUnmaskRequest={() => onUnmaskRequest(row)}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Technical Metadata</Typography>
                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption">Resource Type:</Typography>
                            <Chip label={row.resource_type} size="small" variant="outlined" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption">Correlation ID:</Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'Monospace', color: 'primary.main' }}>{row.correlation_id}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption">Event Hash:</Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'Monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {row.hash}
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );

    return (
        <Box sx={{ flex: 1, minHeight: 0 }}>
            <CustomGrid
                columns={columns}
                data={logs}
                isLoading={loading}
                renderExpansion={renderExpansion}
                pagination={{
                    page, rowsPerPage, totalCount: logs.length,
                    onPageChange, onRowsPerPageChange
                }}
            />
        </Box>
    );
};
