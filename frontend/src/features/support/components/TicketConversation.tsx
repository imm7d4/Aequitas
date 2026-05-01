import React, { useState, useEffect, useRef } from 'react';
import { 
    Box, Typography, Stack, TextField, Button, 
    Avatar, Paper, Divider, CircularProgress 
} from '@mui/material';
import { 
    Send as SendIcon, 
    AdminPanelSettings as SupportIcon,
    Person as UserIcon
} from '@mui/icons-material';
import { Base64ImagePicker } from '../../../shared/components/Base64ImagePicker';
import { useAuth } from '@/features/auth';
import { ticketService, TicketData, TicketComment } from '../services/ticketService';

interface TicketConversationProps {
    ticketId: string;
    isAdminView?: boolean;
    onCommentAdded?: () => void;
}

export const TicketConversation: React.FC<TicketConversationProps> = ({ 
    ticketId, 
    isAdminView = false,
    onCommentAdded
}) => {
    const { user } = useAuth();
    const [ticket, setTicket] = useState<TicketData | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await ticketService.getTicketDetails(ticketId);
            setTicket(data);
            scrollToBottom();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [ticketId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }, 100);
    };

    const handleSend = async () => {
        if (!message.trim() && attachments.length === 0) return;
        setSending(true);

        try {
            await ticketService.addComment(ticketId, { message, attachments });
            setMessage('');
            setAttachments([]);
            await fetchData();
            if (onCommentAdded) onCommentAdded();
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    if (loading && !ticket) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={24} /></Box>;

    const comments = ticket?.comments || [];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '600px' }}>
            <Box 
                ref={scrollRef}
                sx={{ 
                    flex: 1, overflowY: 'auto', p: 2, bgcolor: 'rgba(0,0,0,0.01)',
                    display: 'flex', flexDirection: 'column', gap: 2
                }}
            >
                {ticket && (
                    <Box sx={{ alignSelf: 'flex-start', maxWidth: '85%', display: 'flex', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}><UserIcon sx={{ fontSize: 18 }} /></Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Paper 
                                elevation={0}
                                sx={{ p: 1.5, borderRadius: '12px', borderTopLeftRadius: 0, bgcolor: '#fff', border: '1px solid rgba(0,0,0,0.05)' }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block', mb: 0.5 }}>INITIAL REQUEST</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{ticket.subject}</Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>{ticket.description}</Typography>
                                {ticket.attachments && ticket.attachments.length > 0 && (
                                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                        {ticket.attachments.map((img, i) => (
                                            <Box key={i} component="img" src={img} sx={{ width: 140, height: 90, borderRadius: '8px', objectFit: 'cover', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)' }} onClick={() => window.open(img)} />
                                        ))}
                                    </Stack>
                                )}
                            </Paper>
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', fontSize: '10px', color: 'text.disabled' }}>{new Date(ticket.createdAt).toLocaleString()}</Typography>
                        </Box>
                    </Box>
                )}

                {comments.map((comment) => {
                    const isSelf = comment.authorId === user?.id;
                    const isSupport = comment.role === 'ADMIN';
                    const displayName = isSelf ? 'You' : (isSupport ? 'Support' : comment.authorName);
                    
                    return (
                        <Box 
                            key={comment.id} 
                            sx={{ alignSelf: isSelf ? 'flex-end' : 'flex-start', maxWidth: '80%', display: 'flex', gap: 1.5, flexDirection: isSelf ? 'row-reverse' : 'row' }}
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: isSupport ? 'error.main' : 'primary.main' }}>
                                {isSupport ? <SupportIcon sx={{ fontSize: 18 }} /> : <UserIcon sx={{ fontSize: 18 }} />}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 1.5, borderRadius: '12px', borderTopLeftRadius: isSelf ? '12px' : 0, borderTopRightRadius: isSelf ? 0 : '12px',
                                        bgcolor: isSelf ? 'primary.main' : '#fff', color: isSelf ? '#fff' : 'text.primary', border: '1px solid rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.75rem', opacity: 0.8 }}>{displayName} {isSupport && !isSelf && '(Support Team)'}</Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{comment.message}</Typography>
                                </Paper>
                                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', fontSize: '10px', color: 'text.disabled', textAlign: isSelf ? 'right' : 'left' }}>{new Date(comment.createdAt).toLocaleString()}</Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
            <Divider />
            {!ticket || ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? (
                <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}><Typography variant="body2" color="text.secondary">This ticket is {ticket?.status.toLowerCase()}. New messages are disabled.</Typography></Box>
            ) : (
                <Box sx={{ p: 2, bgcolor: '#fff' }}>
                    <Base64ImagePicker selectedImages={attachments} onImagesSelected={(imgs) => setAttachments(prev => [...prev, ...imgs].slice(0, 3))} onRemoveImage={(i) => setAttachments(prev => prev.filter((_, idx) => idx !== i))} />
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <TextField fullWidth size="small" placeholder="Type..." multiline maxRows={4} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
                        <Button variant="contained" onClick={handleSend} disabled={sending || (!message.trim() && attachments.length === 0)} sx={{ minWidth: 'auto', px: 2 }}>
                            {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
};
