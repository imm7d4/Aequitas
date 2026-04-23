import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AuditLog } from '../services/adminService';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { AuditLogFilters } from '../components/AuditLogFilters';
import { AuditLogJustificationDialog } from '../components/AuditLogJustificationDialog';
import { AuditLogGrid } from '../components/AuditLogGrid';

export const AuditLogs: React.FC = () => {
    const {
        logs, loading,
        searchTerm, setSearchTerm,
        filterAction, setFilterAction,
        unmaskedLogs, logJustification
    } = useAuditLogs();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [isJustifyOpen, setIsJustifyOpen] = useState(false);
    const [justifyLog, setJustifyLog] = useState<AuditLog | null>(null);

    const handleUnmaskRequest = (log: AuditLog) => {
        setJustifyLog(log);
        setIsJustifyOpen(true);
    };

    const handleVerify = async (ticketRef: string, justification: string) => {
        if (!justifyLog) return;
        const success = await logJustification(justifyLog.id, ticketRef, justification);
        if (success) {
            setIsJustifyOpen(false);
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <AuditLogJustificationDialog 
                open={isJustifyOpen}
                onClose={() => setIsJustifyOpen(false)}
                onConfirm={handleVerify}
            />

            <AuditLogFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterAction={filterAction}
                setFilterAction={setFilterAction}
            />

            <AuditLogGrid 
                logs={logs}
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={setPage}
                onRowsPerPageChange={setRowsPerPage}
                unmaskedLogs={unmaskedLogs}
                onUnmaskRequest={handleUnmaskRequest}
            />
        </Box>
    );
};
