import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Stack, Chip, 
    Card, CardContent,
    Dialog, DialogTitle, DialogContent, Grid,
    useTheme
} from '@mui/material';
import { 
    Add as AddIcon, 
    Chat as ChatIcon, 
    AccessTime as TimeIcon
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { RaiseTicketModal } from '../../../shared/components/RaiseTicketModal';
import { TicketConversation } from '../../../shared/components/TicketConversation';

interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export const SupportHub: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRaiseOpen, setIsRaiseOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();

    const fetchTickets = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/tickets/my`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            const ticketList = data.data || [];
            setTickets(ticketList);
            setLoading(false);

            // Deep link handling: auto-open ticket if ID in URL
            const ticketId = searchParams.get('ticketId');
            if (ticketId) {
                const ticket = ticketList.find((t: any) => t.id === ticketId);
                if (ticket) {
                    setSelectedTicket(ticket);
                    // Clear the param after opening to avoid re-opening on manual closes
                    setSearchParams({}, { replace: true });
                }
            }
        })
        .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const getStatusColor = (status: string): any => {
        switch (status) {
            case 'OPEN': return 'info';
            case 'IN_PROGRESS': return 'warning';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'default';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1000px', mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1, mb: 0.5 }}>
                        Support Hub
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track your requests and communicate with our compliance team.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    onClick={() => setIsRaiseOpen(true)}
                    sx={{ borderRadius: '8px', px: 3, py: 1, fontWeight: 700 }}
                >
                    New Ticket
                </Button>
            </Box>

            {tickets.length === 0 && !loading ? (
                <Card sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(0,0,0,0.01)', border: '2px dashed rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>No Tickets Found</Typography>
                    <Typography variant="body2" color="text.disabled">If you're facing any issues, feel free to raise a new support request.</Typography>
                </Card>
            ) : (
                <Stack spacing={2}>
                    {tickets.map((ticket) => (
                        <Card 
                            key={ticket.id} 
                            sx={{ 
                                transition: 'all 0.2s',
                                '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' },
                                cursor: 'pointer',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}
                            onClick={() => setSelectedTicket(ticket)}
                        >
                            <CardContent sx={{ p: '20px !important' }}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                            <Chip 
                                                label={ticket.status} 
                                                size="small" 
                                                color={getStatusColor(ticket.status)}
                                                sx={{ fontWeight: 800, borderRadius: '4px', fontSize: '10px' }}
                                            />
                                            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TimeIcon sx={{ fontSize: 14 }} /> {new Date(ticket.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                                            {ticket.subject}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis', 
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {ticket.description}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { md: 'flex-end' }, gap: 1 }}>
                                        <Button 
                                            variant="outlined" 
                                            startIcon={<ChatIcon />}
                                            size="small"
                                            sx={{ borderRadius: '6px', fontWeight: 600 }}
                                        >
                                            View Conversation
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            <RaiseTicketModal 
                open={isRaiseOpen}
                onClose={() => setIsRaiseOpen(false)}
                onSuccess={fetchTickets}
            />

            {/* Conversation Dialog */}
            <Dialog 
                open={!!selectedTicket} 
                onClose={() => setSelectedTicket(null)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: theme.palette.primary.main, color: '#fff' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedTicket?.subject}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>ID: {selectedTicket?.id} | {selectedTicket?.category}</Typography>
                    </Box>
                    <Chip label={selectedTicket?.status} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700 }} />
                </DialogTitle>
                <DialogContent sx={{ p: 0, height: '600px', display: 'flex', flexDirection: 'column' }}>
                    {selectedTicket && <TicketConversation ticketId={selectedTicket.id} />}
                </DialogContent>
            </Dialog>
        </Box>
    );
};
