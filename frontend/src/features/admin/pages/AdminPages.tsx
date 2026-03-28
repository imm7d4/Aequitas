import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ControlCenter as ControlCenterView } from './ControlCenter';

export * from './ControlCenter';
export * from './UserManagement';
export * from './WalletManagement';
export * from './JITApprovalQueue';

const AdminPageSkeleton: React.FC<{ title: string, activeTab?: number }> = ({ title, activeTab }) => {
    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                {title}
            </Typography>
            <Paper 
                elevation={0}
                sx={{ 
                    p: 4, 
                    borderRadius: '16px', 
                    border: '1px solid rgba(0,0,0,0.05)',
                    bgcolor: '#fff'
                }}
            >
                {activeTab === 0 && <ControlCenterView />}
                {activeTab === 2 && <Typography>Market Operations (Coming Soon)</Typography>}
                {activeTab === undefined && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            {title} Content Coming Soon
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            This module is currently under development as part of Phase 12.
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export const ControlCenter: React.FC = () => <AdminPageSkeleton title="Admin Control Center" activeTab={0} />;
export const MarketOps: React.FC = () => <AdminPageSkeleton title="Market Operations" activeTab={2} />;
export const AuditLogs: React.FC = () => <AdminPageSkeleton title="Audit & Forensic Logs" />;
export const RiskGovernance: React.FC = () => <AdminPageSkeleton title="Risk Governance" />;
export const SupportTicketing: React.FC = () => <AdminPageSkeleton title="Support Ticketing" />;
