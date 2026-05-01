import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Chip, TextField, InputAdornment
} from '@mui/material';
import { Check, Close, Search as SearchIcon } from '@mui/icons-material';
import { CustomGrid, Column } from '../../../shared/components/CustomGrid';
import { adminService, JITRequest } from '../services/adminService';
import { MFADialog } from '../components/MFADialog';

export const JITApprovalQueue: React.FC = () => {
    const [requests, setRequests] = useState<JITRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [mfaOpen, setMfaOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [otp, setOtp] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await adminService.getJitApprovals();
            const mapped = data.map((r: any) => ({ ...r, id: r.id || r._id }));
            setRequests(mapped);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleStepUpApprove = async () => {
        if (!selectedId || otp !== '123456') {
            alert('Invalid MFA Code. Use 123456 for simulation.');
            return;
        }
        try {
            await adminService.approveJitRequest(selectedId);
            setMfaOpen(false); setOtp(''); fetchRequests();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm('Are you sure you want to reject this request?')) return;
        try {
            await adminService.rejectJitRequest(id);
            fetchRequests();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const columns: Column<JITRequest>[] = [
        { id: 'makerId', label: 'Maker', minWidth: 150, render: (row) => <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{row.makerId}</Typography>},
        { id: 'action', label: 'Action Type', minWidth: 150, render: (row) => (
            <Chip label={row.action} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800, borderRadius: '4px' }} />
        )},
        { id: 'resourceId', label: 'Target Resource', minWidth: 200, render: (row) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.resourceId}</Typography>},
        { id: 'amount', label: 'Amount', minWidth: 150, render: (row) => (
            <Typography variant="body2" fontWeight={700}>{row.amount > 0 ? `₹${row.amount.toLocaleString()}` : 'N/A'}</Typography>
        )},
        { id: 'reason', label: 'Justification', minWidth: 250 },
        { id: 'status', label: 'Status', minWidth: 150, render: (row) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={row.status} size="small" sx={{ fontWeight: 800 }} />
                {row.isDualAuthRequired && <Chip label={`Approvals: ${row.checkers?.length || 0}/2`} size="small" color="warning" variant="outlined" sx={{ fontWeight: 800 }}/>}
            </Box>
        )},
        { id: 'actions', label: 'Actions', align: 'right', minWidth: 180, render: (row) => (
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" startIcon={<Close />} color="error" onClick={() => handleReject(row.id)}>Reject</Button>
                <Button size="small" variant="contained" color="success" startIcon={<Check />} onClick={() => { setSelectedId(row.id); setMfaOpen(true); }}>Approve</Button>
            </Box>
        )}
    ];

    const filtered = requests.filter(r => r.status === 'PENDING' && (r.action.toLowerCase().includes(searchTerm.toLowerCase()) || r.reason.toLowerCase().includes(searchTerm.toLowerCase())));

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', px: 3, pt: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 800 }}>JIT Approval Queue</Typography>
                <TextField size="small" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.disabled', fontSize: 18 }} /></InputAdornment>,
                        sx: { borderRadius: '6px', bgcolor: '#fff', width: 220 }
                    }}
                />
            </Box>
            <Box sx={{ flex: 1, minHeight: 0 }}>
                <CustomGrid columns={columns} data={filtered} isLoading={loading} maxHeight="100%"
                    pagination={{ page, rowsPerPage, totalCount: filtered.length, onPageChange: setPage, onRowsPerPageChange: setRowsPerPage }}
                />
            </Box>
            <MFADialog open={mfaOpen} onClose={() => setMfaOpen(false)} otp={otp} onOtpChange={setOtp} onSubmit={handleStepUpApprove} />
        </Box>
    );
};
