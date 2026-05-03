import React, { useMemo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { CustomGrid } from '../../../shared/components/CustomGrid';
import { useSupportTicketing } from '../hooks/useSupportTicketing';
import { ConversationDialog } from './ConversationDialog';
import { getSupportTicketColumns } from './SupportTicketing.columns';

export const SupportTicketing: React.FC = () => {
    const {
        tickets,
        loading,
        selectedTicket,
        setSelectedTicket,
        fetchTickets,
        updateStatus
    } = useSupportTicketing();

    const columns = useMemo(() => 
        getSupportTicketColumns(setSelectedTicket, updateStatus),
    [setSelectedTicket, updateStatus]);

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

            <CustomGrid
                columns={columns}
                data={tickets}
                isLoading={loading}
            />

            <ConversationDialog 
                ticket={selectedTicket}
                onClose={() => setSelectedTicket(null)}
                onCommentAdded={fetchTickets}
            />
        </Box>
    );
};
