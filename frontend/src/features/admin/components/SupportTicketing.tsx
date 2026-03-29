import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    MenuItem,
    Stack,
    Select,
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    Message as MessageIcon,
    ErrorOutline as OverdueIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { CustomGrid, Column } from '../../../shared/components/CustomGrid';
import { TicketConversation } from '../../../shared/components/TicketConversation';

interface SupportTicket {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    category: string;
    firstResponseAt?: string;
    resolvedAt?: string;
    createdAt: string;
}

export const SupportTicketing: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/admin/tickets`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                setTickets(data.data || []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const updateStatus = (id: string, status: string) => {
        fetch(`${import.meta.env.VITE_API_URL}/admin/tickets/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        })
            .then(() => fetchTickets())
            .catch(err => console.error(err));
    };

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

    const columns: Column<SupportTicket>[] = [
        {
            id: 'createdAt',
            label: 'Opened',
            minWidth: 150,
            render: (row: SupportTicket) => new Date(row.createdAt).toLocaleString()
        },
        {
            id: 'priority',
            label: 'Priority',
            minWidth: 100,
            render: (row: SupportTicket) => (
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
            render: (row: SupportTicket) => (
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
            render: (row: SupportTicket) => <Chip label={row.category} size="small" variant="outlined" />
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 120,
            render: (row: SupportTicket) => {
                const isOverdue = (row.priority === 'URGENT' || row.priority === 'HIGH') && 
                                 !row.firstResponseAt && 
                                 (new Date().getTime() - new Date(row.createdAt).getTime()) > 4 * 60 * 60 * 1000;
                
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            label={row.status}
                            color={getStatusColor(row.status)}
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
            render: (row: SupportTicket) => (
                <Stack direction="row" spacing={1}>
                    <IconButton 
                        size="small" 
                        color="primary"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(row);
                        }}
                    >
                        <MessageIcon fontSize="small" />
                    </IconButton>

                    <Select
                        size="small"
                        value={row.status}
                        onChange={(e) => updateStatus(row.id, e.target.value as any)}
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

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Support Ticketing Inbox</Typography>
                <Button
                    startIcon={<RefreshIcon />}
                    onClick={fetchTickets}
                    size="small"
                    variant="outlined"
                >
                    Refresh
                </Button>
            </Box>

            <CustomGrid<SupportTicket>
                columns={columns}
                data={tickets}
                isLoading={loading}
            />

            {/* Conversation Dialog */}
            <Dialog 
                open={!!selectedTicket} 
                onClose={() => setSelectedTicket(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: '#fff' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedTicket?.subject}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>ID: {selectedTicket?.id} | User: {selectedTicket?.userName}</Typography>
                    </Box>
                    <IconButton onClick={() => setSelectedTicket(null)} size="small" sx={{ color: '#fff' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, height: '600px', display: 'flex', flexDirection: 'column' }}>
                    {selectedTicket && (
                        <TicketConversation 
                            ticketId={selectedTicket.id} 
                            isAdminView={true} 
                            onCommentAdded={fetchTickets}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};
