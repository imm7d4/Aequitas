import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Chip, 
    IconButton, TextField, InputAdornment, 
    Stack, MenuItem, Select, Grid,
    Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { 
    Search as SearchIcon,
    History as HistoryIcon,
    Lock as LockIcon,
    Visibility as VisibilityIcon,
    Gavel as GavelIcon
} from '@mui/icons-material';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Alert
} from '@mui/material';
import { CustomGrid, Column, BaseRow } from '../../../shared/components/CustomGrid';

interface AuditLog extends BaseRow {
    id: string;
    timestamp: string;
    actor_id: string;
    actor_name: string;
    actor_role: string;
    action: string;
    resource_id: string;
    resource_type: string;
    description: string;
    old_value: any;
    new_value: any;
    hash: string;
    previous_hash: string;
    correlation_id: string; // US-12.4
}

export const AuditLogs: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('ALL');
    const [filterUser, setFilterUser] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [isJustifyOpen, setIsJustifyOpen] = useState(false);
    const [justifyLog, setJustifyLog] = useState<AuditLog | null>(null);
    const [ticketRef, setTicketRef] = useState('');
    const [justification, setJustification] = useState('');
    const [unmaskedLogs, setUnmaskedLogs] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchLogs();
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setPage(0);
    }, [searchTerm, filterAction, filterUser, startDate, endDate]);

    const fetchLogs = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/admin/audit/logs`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                // Map _id to id if necessary for CustomGrid
                const mappedLogs = (data.data || []).map((log: any) => ({
                    ...log,
                    id: log.id || log._id,
                    correlation_id: log.correlation_id || 'N/A'
                }));
                setLogs(mappedLogs);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const logJustification = () => {
        if (!justifyLog) return;
        fetch(`${import.meta.env.VITE_API_URL}/admin/audit/justify`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                logId: justifyLog.id,
                ticketRef,
                justification
            })
        })
        .then(() => {
            setUnmaskedLogs(prev => new Set(prev).add(justifyLog.id));
            setIsJustifyOpen(false);
            setTicketRef('');
            setJustification('');
        })
        .catch(console.error);
    };

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
                    color={getActionColor(row.action)}
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

    const getActionLabel = (action: string): string => {
        const labels: Record<string, string> = {
            'USER_LOGIN': 'Login',
            'USER_LOGOUT': 'Logout',
            'USER_REGISTERED': 'Registration',
            'ORDER_PLACED': 'Order Placed',
            'ORDER_CANCELLED': 'Order Cancelled',
            'ORDER_FILLED': 'Order Filled',
            'TRADE_SETTLED': 'Trade Settled',
            'DEPOSIT_COMPLETED': 'Deposit',
            'TELEMETRY_PAGE_VISIT': 'Page Visit',
            'JIT_APPROVED': 'JIT Access',
            'WALLET_ADJUSTMENT': 'Ledger Adjustment',
            'CONFIG_UPDATE': 'Config Change'
        };
        return labels[action] || action.replace(/_/g, ' ');
    };

    const getActionColor = (action: string): any => {
        if (action.includes('REGISTER')) return 'info';
        if (action.includes('LOGIN')) return 'success';
        if (action.includes('LOGOUT')) return 'warning';
        if (action.includes('JIT')) return 'warning';
        if (action.includes('ADJUSTMENT')) return 'error';
        if (action.includes('CONFIG')) return 'secondary';
        if (action.includes('ORDER')) return 'primary';
        if (action.includes('TRADE')) return 'success';
        if (action.includes('DEPOSIT')) return 'info';
        if (action.includes('TELEMETRY')) return 'default';
        return 'default';
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesAction = filterAction === 'ALL' || log.action === filterAction;
        const matchesUser = filterUser === '' || log.actor_name.toLowerCase().includes(filterUser.toLowerCase());
        
        const logDate = new Date(log.timestamp);
        const matchesStart = startDate === '' || logDate >= new Date(startDate);
        const matchesEnd = endDate === '' || logDate <= new Date(endDate + 'T23:59:59');

        return matchesSearch && matchesAction && matchesUser && matchesStart && matchesEnd;
    });

    const DataValue: React.FC<{ value: any, isMasked?: boolean, onUnmask?: () => void }> = ({ value, isMasked, onUnmask }) => {
        if (isMasked) return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontFamily: 'Monospace', color: 'text.disabled', fontStyle: 'italic' }}>
                    [MASKED - PII PRIVACY]
                </Typography>
                <IconButton size="small" onClick={onUnmask}>
                    <LockIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                </IconButton>
            </Box>
        );
        if (typeof value === 'object') return <Typography variant="caption" sx={{ fontFamily: 'Monospace', color: 'text.secondary' }}>{JSON.stringify(value)}</Typography>;
        return <Typography variant="body2" sx={{ fontFamily: 'Monospace', fontSize: '0.75rem' }}>{String(value)}</Typography>;
    };

    const isPII = (key: string): boolean => {
        const piiKeys = ['email', 'ip', 'address', 'phone', 'ip_address', 'user_email'];
        return piiKeys.some(pK => key.toLowerCase().includes(pK));
    };

    const AuditDetailTable: React.FC<{ data: any, log: AuditLog }> = ({ data, log }) => {
        if (!data) return <Typography variant="caption" color="text.disabled">No detailed data properties available</Typography>;
        
        const rows: { key: string, value: any }[] = [];
        // ... same logic for rows ...

        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                if (item && typeof item === 'object' && (item.Key || item.key)) {
                    rows.push({ key: item.Key || item.key, value: item.Value || item.value });
                } else {
                    rows.push({ key: `Item ${index + 1}`, value: item });
                }
            });
        } else if (typeof data === 'object') {
            Object.keys(data).filter(k => 
                k !== 'id' && k !== '_id' && k !== 'userID' && k !== 'accountID' && k !== 'instrumentID' && k !== 'ID'
            ).forEach(k => rows.push({ key: k, value: data[k] }));
        }

        if (rows.length === 0) return <Typography variant="caption" color="text.disabled">No details available</Typography>;

        return (
            <Table size="small" sx={{ 
                border: '1px solid rgba(0,0,0,0.05)',
                borderRadius: '8px',
                overflow: 'hidden',
                '& td': { py: 0.75, px: 2, borderBottom: '1px solid rgba(0,0,0,0.05)' }
            }}>
                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 800, fontSize: '0.65rem', color: 'text.secondary', width: '35%' }}>KEY</TableCell>
                        <TableCell sx={{ fontWeight: 800, fontSize: '0.65rem', color: 'text.secondary' }}>VALUE</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, idx) => {
                        const masked = isPII(row.key) && !unmaskedLogs.has(log.id);
                        return (
                            <TableRow key={idx} hover>
                                <TableCell sx={{ textTransform: 'uppercase', color: 'text.secondary', fontWeight: 700, fontSize: '0.65rem', bgcolor: 'rgba(0,0,0,0.005)', letterSpacing: 0.5 }}>
                                    {String(row.key).replace(/_/g, ' ')}
                                </TableCell>
                                <TableCell>
                                    <DataValue 
                                        value={row.value} 
                                        isMasked={masked} 
                                        onUnmask={() => {
                                            setJustifyLog(log);
                                            setIsJustifyOpen(true);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    };

    const renderExpansion = (row: AuditLog) => (
        <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '8px', m: 1, border: '1px solid rgba(0,0,0,0.05)' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: 1 }}>Details</Typography>
                    <AuditDetailTable data={row.new_value || row.old_value} log={row} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Technical Metadata</Typography>
                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption">Resource Type:</Typography>
                            <Chip label={row.resource_type} size="small" variant="outlined" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption">Resource ID:</Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'Monospace' }}>{row.resource_id}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption">Correlation ID:</Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'Monospace', color: 'primary.main' }}>{row.correlation_id}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption">Event Hash:</Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'Monospace', color: 'primary.main', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {row.hash}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption">Previous Hash:</Typography>
                            <Typography variant="caption" sx={{ fontFamily: 'Monospace', color: 'text.disabled', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {row.previous_hash}
                            </Typography>
                        </Box>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );

    return (
        <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <Dialog open={isJustifyOpen} onClose={() => setIsJustifyOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GavelIcon color="primary" /> PII Access Justification
                </DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
                        US-12.4 requires mandatory justification for unmasking PII. This request will be anchor-logged for Detailed Review.
                    </Alert>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Ticket Reference"
                            placeholder="e.g. TKT-1234"
                            size="small"
                            fullWidth
                            value={ticketRef}
                            onChange={(e) => setTicketRef(e.target.value)}
                        />
                        <TextField
                            label="Rationale"
                            placeholder="State why this data is needed..."
                            multiline
                            rows={3}
                            size="small"
                            fullWidth
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsJustifyOpen(false)} variant="text">Cancel</Button>
                    <Button 
                        onClick={logJustification} 
                        variant="contained" 
                        disabled={!ticketRef || !justification}
                        startIcon={<VisibilityIcon />}
                    >
                        Verify & Unmask
                    </Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 800, color: 'text.primary', letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
                    Audit Logs
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
            <TextField 
                size="small"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                        </InputAdornment>
                    ),
                    sx: { borderRadius: '6px', bgcolor: '#fff', width: 180 }
                }}
            />
            <TextField 
                size="small"
                placeholder="Filter by user..."
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                autoComplete="off"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', bgcolor: '#fff', width: 140 } }}
            />
            <Select
                size="small"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                sx={{ borderRadius: '6px', bgcolor: '#fff', minWidth: 140 }}
            >
                <MenuItem value="ALL">All Actions</MenuItem>
                <MenuItem value="USER_LOGIN">Logins</MenuItem>
                <MenuItem value="USER_LOGOUT">Logouts</MenuItem>
                <MenuItem value="USER_REGISTERED">Registrations</MenuItem>
                <MenuItem value="JIT_APPROVED">JIT Approvals</MenuItem>
                <MenuItem value="WALLET_ADJUSTMENT">Wallet Adjustments</MenuItem>
                <MenuItem value="ORDER_PLACED">Orders Placed</MenuItem>
                <MenuItem value="ORDER_CANCELLED">Orders Cancelled</MenuItem>
                <MenuItem value="TRADE_SETTLED">Trade Fills</MenuItem>
                <MenuItem value="DEPOSIT_COMPLETED">Deposits</MenuItem>
                <MenuItem value="TELEMETRY_PAGE_VISIT">Navigation</MenuItem>
                <MenuItem value="CONFIG_UPDATE">Config Changes</MenuItem>
            </Select>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                    type="date"
                    size="small"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', bgcolor: '#fff' } }}
                />
                <Typography variant="caption" color="text.disabled">to</Typography>
                <TextField
                    type="date"
                    size="small"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px', bgcolor: '#fff' } }}
                />
            </Box>
            <IconButton onClick={fetchLogs} size="small" sx={{ border: '1px solid #ddd', borderRadius: '6px', bgcolor: '#fff' }}>
                <HistoryIcon fontSize="small" />
            </IconButton>
            {(filterUser || filterAction !== 'ALL' || startDate || endDate || searchTerm) && (
                <Typography 
                    variant="caption" 
                    sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 600 }}
                    onClick={() => {
                        setFilterUser('');
                        setFilterAction('ALL');
                        setStartDate('');
                        setEndDate('');
                        setSearchTerm('');
                    }}
                >
                    Clear Filters
                </Typography>
            )}
        </Box>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0 }}>
            <CustomGrid
                columns={columns}
                data={filteredLogs}
                isLoading={loading}
                renderExpansion={renderExpansion}
                maxHeight="100%"
                pagination={{
                    page,
                    rowsPerPage,
                    totalCount: filteredLogs.length,
                    onPageChange: setPage,
                    onRowsPerPageChange: setRowsPerPage
                }}
            />
        </Box>
        </Box>
    );
};
