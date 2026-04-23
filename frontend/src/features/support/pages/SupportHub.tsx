import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Stack, Chip, 
    Card, CardContent, Dialog, DialogTitle, DialogContent, Grid, useTheme
} from '@mui/material';
import { Add as AddIcon, Chat as ChatIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { RaiseTicketModal } from '../components/RaiseTicketModal';
import { TicketConversation } from '../components/TicketConversation';
import { ticketService, SupportTicket } from '../services/ticketService';

export const SupportHub: React.FC = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRaiseOpen, setIsRaiseOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const ticketList = await ticketService.getMyTickets();
            setTickets(ticketList);
            const ticketId = searchParams.get('ticketId');
            if (ticketId) {
                const ticket = ticketList.find((t: any) => t.id === ticketId);
                if (ticket) { setSelectedTicket(ticket); setSearchParams({}, { replace: true }); }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTickets(); }, []);

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
                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1, mb: 0.5 }}>Support Hub</Typography>
                    <Typography variant="body2" color="text.secondary">Track requests and communicate with compliance.</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsRaiseOpen(true)} sx={{ borderRadius: '8px', px: 3, fontWeight: 700 }}>New Ticket</Button>
            </Box>

            {tickets.length === 0 && !loading ? (
                <Card sx={{ textAlign: 'center', py: 8, bgcolor: 'rgba(0,0,0,0.01)', border: '2px dashed rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                    <Typography variant="h6" color="text.secondary">No Tickets Found</Typography>
                </Card>
            ) : (
                <Stack spacing={2}>
                    {tickets.map((ticket) => (
                        <Card key={ticket.id} sx={{ transition: 'all 0.2s', '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }, cursor: 'pointer', border: '1px solid rgba(0,0,0,0.05)' }} onClick={() => setSelectedTicket(ticket)}>
                            <CardContent sx={{ p: '20px !important' }}>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                            <Chip label={ticket.status} size="small" color={getStatusColor(ticket.status)} sx={{ fontWeight: 800, borderRadius: '4px', fontSize: '10px' }} />
                                            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 0.5 }}><TimeIcon sx={{ fontSize: 14 }} /> {new Date(ticket.createdAt).toLocaleDateString()}</Typography>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>{ticket.subject}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}>
                                        <Button variant="outlined" startIcon={<ChatIcon />} size="small" sx={{ borderRadius: '6px', fontWeight: 600 }}>View Conversation</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            <RaiseTicketModal open={isRaiseOpen} onClose={() => setIsRaiseOpen(false)} onSuccess={fetchTickets} />

            <Dialog open={!!selectedTicket} onClose={() => setSelectedTicket(null)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: theme.palette.primary.main, color: '#fff' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedTicket?.subject}</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>ID: {selectedTicket?.id}</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 0, height: '600px', display: 'flex', flexDirection: 'column' }}>
                    {selectedTicket && <TicketConversation ticketId={selectedTicket.id} />}
                </DialogContent>
            </Dialog>
        </Box>
    );
};
