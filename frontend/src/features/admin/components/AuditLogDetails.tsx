import React from 'react';
import { 
    Box, Typography, IconButton, 
    Table, TableBody, TableCell, TableHead, TableRow, 
    Stack, Chip 
} from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { AuditLog } from '../services/adminService';

interface DataValueProps {
    value: any;
    isMasked?: boolean;
    onUnmask?: () => void;
}

export const DataValue: React.FC<DataValueProps> = ({ value, isMasked, onUnmask }) => {
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

interface AuditDetailTableProps {
    data: any;
    log: AuditLog;
    unmaskedLogs: Set<string>;
    onUnmaskRequest: (log: AuditLog) => void;
}

export const AuditDetailTable: React.FC<AuditDetailTableProps> = ({ data, log, unmaskedLogs, onUnmaskRequest }) => {
    if (!data) return <Typography variant="caption" color="text.disabled">No detailed data properties available</Typography>;
    
    const rows: { key: string, value: any }[] = [];
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
                                    onUnmask={() => onUnmaskRequest(log)}
                                />
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
