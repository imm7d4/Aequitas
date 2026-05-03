import React from 'react';
import { Box, Typography, Chip, IconButton, Stack, Select, MenuItem, Tooltip } from '@mui/material';
import { Message as MessageIcon, ErrorOutline as OverdueIcon } from '@mui/icons-material';
import { Column } from '../../../shared/components/CustomGrid';
import { SupportTicket } from '../types/support.types';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'OPEN': return 'error';
        case 'IN_PROGRESS': return 'warning';
        case 'RESOLVED': return 'success';
        default: return 'default';
    }
};

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'URGENT': return '#f44336';
        case 'HIGH': return '#ff9800';
        case 'MEDIUM': return '#2196f3';
        default: return '#9e9e9e';
    }
};

export const getSupportTicketColumns = (
    onOpenConversation: (ticket: SupportTicket) => void,
    onUpdateStatus: (id: string, status: string) => void
): Column<SupportTicket>[] => [
    {
        id: 'createdAt',
        label: 'Opened',
        minWidth: 150,
        render: (row) => new Date(row.createdAt).toLocaleString()
    },
    {
        id: 'priority',
        label: 'Priority',
        minWidth: 100,
        render: (row) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getPriorityColor(row.priority) }} />
                <Typography variant="body2">{row.priority}</Typography>
            </Box>
        )
    },
    {
        id: 'userName',
        label: 'Requester',
        minWidth: 150,
    },
    {
        id: 'subject',
        label: 'Subject',
        minWidth: 250,
        render: (row) => (
            <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.subject}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 200 }}>
                    {row.description}
                </Typography>
            </Box>
        )
    },
    {
        id: 'category',
        label: 'Category',
        minWidth: 120,
        render: (row) => <Chip label={row.category} size="small" variant="outlined" />
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 120,
        render: (row) => {
            const isOverdue = (row.priority === 'URGENT' || row.priority === 'HIGH') && 
                             !row.firstResponseAt && 
                             (new Date().getTime() - new Date(row.createdAt).getTime()) > 4 * 60 * 60 * 1000;
            
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                        label={row.status}
                        color={getStatusColor(row.status) as any}
                        size="small"
                        sx={{ fontWeight: 700, borderRadius: '4px' }}
                    />
                    {isOverdue && (
                        <Tooltip title="SLA Violation: No response for >4h">
                            <OverdueIcon color="error" sx={{ fontSize: 16 }} />
                        </Tooltip>
                    )}
                </Box>
            );
        }
    },
    {
        id: 'actions' as any,
        label: 'Actions',
        minWidth: 140,
        render: (row) => (
            <Stack direction="row" spacing={1}>
                <IconButton 
                    size="small" 
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenConversation(row);
                    }}
                >
                    <MessageIcon fontSize="small" />
                </IconButton>

                <Select
                    size="small"
                    value={row.status}
                    onChange={(e) => onUpdateStatus(row.id, e.target.value as any)}
                    sx={{ height: 28, fontSize: '0.7rem', fontWeight: 700 }}
                >
                    <MenuItem value="OPEN">OPEN</MenuItem>
                    <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
                    <MenuItem value="RESOLVED">RESOLVE</MenuItem>
                    <MenuItem value="CLOSED">CLOSE</MenuItem>
                </Select>
            </Stack>
        )
    }
];
