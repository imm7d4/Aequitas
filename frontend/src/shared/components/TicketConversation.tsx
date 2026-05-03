import React from 'react';
import { Box, Typography, Stack, TextField, Button, Divider, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { Base64ImagePicker } from './Base64ImagePicker';
import { useTicketConversation } from '../hooks/useTicketConversation';
import { TicketMessage } from './TicketMessage';

interface TicketConversationProps {
    ticketId: string;
    onCommentAdded?: () => void;
}

export const TicketConversation: React.FC<TicketConversationProps> = ({ ticketId, onCommentAdded }) => {
    const { user, ticket, loading, message, setMessage, attachments, setAttachments, sending, handleSend, scrollRef } = useTicketConversation(ticketId, onCommentAdded);

    if (loading && !ticket) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={24} /></Box>;

    const isClosed = ticket?.status === 'RESOLVED' || ticket?.status === 'CLOSED';

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '600px' }}>
            <Box ref={scrollRef} sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'rgba(0,0,0,0.01)' }}>
                {ticket && (
                    <TicketMessage 
                        message={ticket.description} authorName={ticket.userName} role="USER" 
                        createdAt={ticket.createdAt} attachments={ticket.attachments} 
                        isSelf={ticket.userId === user?.id} isSupport={false} 
                    />
                )}
                {ticket?.comments.map((c: any) => (
                    <TicketMessage 
                        key={c.id} message={c.message} authorName={c.authorName} role={c.role} 
                        createdAt={c.createdAt} attachments={c.attachments} 
                        isSelf={c.authorId === user?.id} isSupport={c.role === 'ADMIN'} 
                    />
                ))}
            </Box>

            <Divider />

            {isClosed ? (
                <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <Typography variant="body2" color="text.secondary">Ticket is {ticket.status.toLowerCase()}. New messages are disabled.</Typography>
                </Box>
            ) : (
                <Box sx={{ p: 2, bgcolor: '#fff' }}>
                    <Base64ImagePicker selectedImages={attachments} onImagesSelected={(imgs) => setAttachments(prev => [...prev, ...imgs].slice(0, 3))} onRemoveImage={(i) => setAttachments(prev => prev.filter((_, idx) => idx !== i))} />
                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <TextField fullWidth size="small" placeholder="Type your message..." multiline maxRows={4} value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} />
                        <Button variant="contained" onClick={handleSend} disabled={sending || (!message.trim() && attachments.length === 0)} sx={{ minWidth: 'auto', px: 2 }}>
                            {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon fontSize="small" />}
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
};
