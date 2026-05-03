import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SupportTicket } from '../types/support.types';
import { TicketConversation } from '../../../shared/components/TicketConversation';

interface ConversationDialogProps {
    ticket: SupportTicket | null;
    onClose: () => void;
    onCommentAdded: () => void;
}

export const ConversationDialog: React.FC<ConversationDialogProps> = ({ 
    ticket, 
    onClose, 
    onCommentAdded 
}) => {
    return (
        <Dialog 
            open={!!ticket} 
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                bgcolor: 'primary.main', 
                color: '#fff' 
            }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>{ticket?.subject}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        ID: {ticket?.id} | User: {ticket?.userName}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: '#fff' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, height: '600px', display: 'flex', flexDirection: 'column' }}>
                {ticket && (
                    <TicketConversation 
                        ticketId={ticket.id} 
                        isAdminView={true} 
                        onCommentAdded={onCommentAdded}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
