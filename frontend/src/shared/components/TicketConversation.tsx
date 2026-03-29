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
import { Base64ImagePicker } from './Base64ImagePicker';
import { useAuth } from '@/features/auth';

interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    role: string;
    message: string;
    attachments?: string[];
    createdAt: string;
}

interface TicketData {
    id: string;
    userId: string;
    userName: string;
    subject: string;
    description: string;
    attachments?: string[];
    createdAt: string;
    comments: Comment[];
}

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

    const fetchData = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/tickets/${ticketId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            setTicket(data.data);
            setLoading(false);
            scrollToBottom();
        })
        .catch(() => setLoading(false));
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

    const handleSend = () => {
        if (!message.trim() && attachments.length === 0) return;
        setSending(true);

        fetch(`${import.meta.env.VITE_API_URL}/tickets/${ticketId}/comments`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, attachments })
        })
        .then(() => {
            setMessage('');
            setAttachments([]);
            setSending(false);
            fetchData();
            if (onCommentAdded) onCommentAdded();
        })
        .catch(() => setSending(false));
    };

    if (loading && !ticket) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={24} /></Box>;

    const comments = ticket?.comments || [];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '600px' }}>
            {/* Thread Area */}
            <Box 
                ref={scrollRef}
                sx={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    p: 2, 
                    bgcolor: 'rgba(0,0,0,0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                {/* Initial Request Rendered as First Message */}
                {ticket && (
                    <Box sx={{ alignSelf: 'flex-start', maxWidth: '85%', display: 'flex', gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                            <UserIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 1.5, 
                                    borderRadius: '12px', 
                                    borderTopLeftRadius: 0,
                                    bgcolor: '#fff',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block', mb: 0.5 }}>
                                    INITIAL REQUEST
                                </Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    {ticket.subject}
                                </Typography>
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                                    {ticket.description}
                                </Typography>
                                {ticket.attachments && ticket.attachments.length > 0 && (
                                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                        {ticket.attachments.map((img, i) => (
                                            <Box 
                                                key={i} 
                                                component="img" 
                                                src={img} 
                                                sx={{ 
                                                    width: 140, 
                                                    height: 90, 
                                                    borderRadius: '8px', 
                                                    objectFit: 'cover',
                                                    cursor: 'pointer',
                                                    border: '1px solid rgba(0,0,0,0.1)',
                                                    '&:hover': { opacity: 0.9, transform: 'scale(1.02)' },
                                                    transition: 'all 0.2s'
                                                }}
                                                onClick={() => window.open(img)}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Paper>
                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', fontSize: '10px', color: 'text.disabled' }}>
                                {new Date(ticket.createdAt).toLocaleString()}
                            </Typography>
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
                            sx={{ 
                                alignSelf: isSelf ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                display: 'flex',
                                gap: 1.5,
                                flexDirection: isSelf ? 'row-reverse' : 'row'
                            }}
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: isSupport ? 'error.main' : 'primary.main' }}>
                                {isSupport ? <SupportIcon sx={{ fontSize: 18 }} /> : <UserIcon sx={{ fontSize: 18 }} />}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Paper 
                                    elevation={0}
                                    sx={{ 
                                        p: 1.5, 
                                        borderRadius: '12px', 
                                        borderTopLeftRadius: isSelf ? '12px' : 0,
                                        borderTopRightRadius: isSelf ? 0 : '12px',
                                        bgcolor: isSelf ? 'primary.main' : '#fff',
                                        color: isSelf ? '#fff' : 'text.primary',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.75rem', opacity: 0.8 }}>
                                        {displayName} {isSupport && !isSelf && '(Support Team)'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {comment.message}
                                    </Typography>
                                    {comment.attachments && comment.attachments.length > 0 && (
                                        <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                            {comment.attachments.map((img, i) => (
                                                <Box 
                                                    key={i} 
                                                    component="img" 
                                                    src={img} 
                                                    sx={{ 
                                                        width: 120, 
                                                        height: 80, 
                                                        borderRadius: '4px', 
                                                        objectFit: 'cover',
                                                        cursor: 'pointer',
                                                        border: isSelf ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(0,0,0,0.1)',
                                                        '&:hover': { opacity: 0.9 }
                                                    }}
                                                    onClick={() => window.open(img)}
                                                />
                                            ))}
                                        </Stack>
                                    )}
                                </Paper>
                                <Typography variant="caption" sx={{ mt: 0.5, display: 'block', fontSize: '10px', color: 'text.disabled', textAlign: isSelf ? 'right' : 'left' }}>
                                    {new Date(comment.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            <Divider />

            {/* Input Area */}
            {ticket && (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') ? (
                <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        This ticket is {ticket.status.toLowerCase()}. New messages are disabled.
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ p: 2, bgcolor: '#fff' }}>
                    <Base64ImagePicker 
                        selectedImages={attachments}
                        onImagesSelected={(imgs) => setAttachments(prev => [...prev, ...imgs].slice(0, 3))}
                        onRemoveImage={(i) => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type your message..."
                            multiline
                            maxRows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <Button 
                            variant="contained" 
                            onClick={handleSend}
                            disabled={sending || (!message.trim() && attachments.length === 0)}
                            sx={{ minWidth: 'auto', px: 2 }}
                        >
                            {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
};
