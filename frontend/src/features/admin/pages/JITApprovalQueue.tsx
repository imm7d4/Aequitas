import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Chip, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions,
    InputAdornment
} from '@mui/material';
import { Check, Close, Security, Search as SearchIcon } from '@mui/icons-material';
import { CustomGrid, Column, BaseRow } from '../../../shared/components/CustomGrid';

interface JITRequest extends BaseRow {
    makerId: string;
    action: string;
    resourceId: string;
    amount: number;
    reason: string;
    duration: number;
    status: string;
    isDualAuthRequired: boolean;
    checkers: string[];
    createdAt: string;
}

export const JITApprovalQueue: React.FC = () => {
    const [requests, setRequests] = useState<JITRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [mfaOpen, setMfaOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | number | null>(null);
    const [otp, setOtp] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const fetchRequests = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/admin/jit/approvals`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            const mapped = (data.data || []).map((r: any) => ({
                ...r,
                id: r.id || r._id
            }));
            setRequests(mapped);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    const handleOpenMfa = (id: string | number) => {
        setSelectedId(id);
        setMfaOpen(true);
    };

    const handleStepUpApprove = async () => {
        if (!selectedId || otp !== '123456') {
            alert('Invalid MFA Code. Use 123456 for simulation.');
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/jit/approve`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requestId: selectedId })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Approval failed');

            setMfaOpen(false);
            setOtp('');
            fetchRequests();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleReject = async (id: string | number) => {
        if (!confirm('Are you sure you want to reject this request?')) return;
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/jit/reject`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requestId: id })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Rejection failed');
            }

            fetchRequests();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const columns: Column<JITRequest>[] = [
        {
            id: 'makerId',
            label: 'Maker',
            minWidth: 150,
            render: (row) => <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>{row.makerId}</Typography>
        },
        {
            id: 'action',
            label: 'Action Type',
            minWidth: 150,
            render: (row) => (
                <Chip 
                    label={row.action} 
                    size="small" 
                    color="primary" 
                    variant="outlined" 
                    sx={{ fontWeight: 800, borderRadius: '4px' }} 
                />
            )
        },
        {
            id: 'resourceId',
            label: 'Target Resource',
            minWidth: 200,
            render: (row) => <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{row.resourceId}</Typography>
        },
        {
            id: 'amount',
            label: 'Amount (Scoped)',
            minWidth: 150,
            render: (row) => (
                <Typography variant="body2" fontWeight={700}>
                    {row.amount > 0 ? `₹${row.amount.toLocaleString()}` : 'N/A'}
                </Typography>
            )
        },
        {
            id: 'reason',
            label: 'Justification',
            minWidth: 250,
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 150,
            render: (row) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                        label={row.status} 
                        size="small" 
                        sx={{ fontWeight: 800 }} 
                    />
                    {row.isDualAuthRequired && (
                        <Chip 
                            label={`Approvals: ${row.checkers?.length || 0}/2`} 
                            size="small" 
                            color="warning" 
                            variant="outlined"
                            sx={{ fontWeight: 800 }}
                        />
                    )}
                </Box>
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right',
            minWidth: 180,
            render: (row) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button 
                        size="small" 
                        startIcon={<Close />} 
                        color="error"
                        onClick={() => handleReject(row.id)}
                        sx={{ fontWeight: 700 }}
                    >
                        Reject
                    </Button>
                    <Button 
                        size="small" 
                        variant="contained" 
                        color="success" 
                        startIcon={<Check />}
                        onClick={() => handleOpenMfa(row.id)}
                        sx={{ fontWeight: 800, borderRadius: '6px' }}
                    >
                        Approve
                    </Button>
                </Box>
            )
        }
    ];

    const filtered = requests.filter(r => 
        r.status === 'PENDING' && 
        (r.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
         r.reason.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            px: 3,
            pt: 2
        }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 800, color: 'text.primary', letterSpacing: -0.5 }}>
                    JIT Approval Queue
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <TextField 
                        size="small"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '6px', bgcolor: '#fff', width: 220 }
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0 }}>
                <CustomGrid
                    columns={columns}
                    data={filtered}
                    isLoading={loading}
                    maxHeight="100%"
                    stickyPagination
                    pagination={{
                        page,
                        rowsPerPage,
                        totalCount: filtered.length,
                        onPageChange: setPage,
                        onRowsPerPageChange: setRowsPerPage
                    }}
                />
            </Box>

            <Dialog open={mfaOpen} onClose={() => setMfaOpen(false)} PaperProps={{ sx: { borderRadius: '12px', width: 360 } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
                    <Security color="primary" /> Step-Up MFA
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                        This is a high-risk action. Please enter the verification code sent to your registered device.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Verification Code"
                        placeholder="123456"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        variant="outlined"
                        autoFocus
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setMfaOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleStepUpApprove}
                        sx={{ fontWeight: 700, borderRadius: '8px' }}
                    >
                        Verify & Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
