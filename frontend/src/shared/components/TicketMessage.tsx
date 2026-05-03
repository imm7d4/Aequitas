import React from 'react';
import { Box, Typography, Avatar, Paper, Stack } from '@mui/material';
import { AdminPanelSettings as SupportIcon, Person as UserIcon } from '@mui/icons-material';

interface TicketMessageProps {
    message: string;
    authorName: string;
    role: string;
    createdAt: string;
    attachments?: string[];
    isSelf: boolean;
    isSupport: boolean;
}

export const TicketMessage: React.FC<TicketMessageProps> = ({ message, authorName, role, createdAt, attachments, isSelf, isSupport }) => (
    <Box sx={{ alignSelf: isSelf ? 'flex-end' : 'flex-start', maxWidth: '80%', display: 'flex', gap: 1.5, flexDirection: isSelf ? 'row-reverse' : 'row' }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: isSupport ? 'error.main' : 'primary.main' }}>
            {isSupport ? <SupportIcon sx={{ fontSize: 18 }} /> : <UserIcon sx={{ fontSize: 18 }} />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
            <Paper elevation={0} sx={{ p: 1.5, borderRadius: '12px', borderTopLeftRadius: isSelf ? '12px' : 0, borderTopRightRadius: isSelf ? 0 : '12px', bgcolor: isSelf ? 'primary.main' : '#fff', color: isSelf ? '#fff' : 'text.primary', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.75rem', opacity: 0.8 }}>{isSelf ? 'You' : (isSupport ? 'Support' : authorName)}</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{message}</Typography>
                {attachments && attachments.length > 0 && (
                    <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                        {attachments.map((img, i) => <Box key={i} component="img" src={img} sx={{ width: 120, height: 80, borderRadius: '4px', objectFit: 'cover' }} onClick={() => window.open(img)} />)}
                    </Stack>
                )}
            </Paper>
            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', fontSize: '10px', color: 'text.disabled', textAlign: isSelf ? 'right' : 'left' }}>{new Date(createdAt).toLocaleString()}</Typography>
        </Box>
    </Box>
);
