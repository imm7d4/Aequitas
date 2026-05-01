import React from 'react';
import { Box, Typography, TextField, Select, MenuItem } from '@mui/material';

interface AuditLogFiltersProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    filterAction: string;
    setFilterAction: (val: string) => void;
}

export const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
    searchTerm, setSearchTerm,
    filterAction, setFilterAction
}) => {
    return (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 2 }}>
            <Typography sx={{ fontSize: '20px', fontWeight: 800 }}>Audit Logs</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <TextField 
                    size="small" 
                    placeholder="Search..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    sx={{ width: 180 }} 
                />
                <Select 
                    size="small" 
                    value={filterAction} 
                    onChange={(e) => setFilterAction(e.target.value)} 
                    sx={{ minWidth: 140 }}
                >
                    <MenuItem value="ALL">All Actions</MenuItem>
                    <MenuItem value="USER_LOGIN">Logins</MenuItem>
                    <MenuItem value="JIT_APPROVED">JIT Approvals</MenuItem>
                    <MenuItem value="WALLET_ADJUSTMENT">Adjustments</MenuItem>
                </Select>
            </Box>
        </Box>
    );
};
