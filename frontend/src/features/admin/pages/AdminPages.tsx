import React from 'react';
import { Box, Typography } from '@mui/material';
import { ControlCenter as ControlCenterView } from './ControlCenter';
import { AuditLogs as AuditLogsView } from './AuditLogs';
import { UserManagement as UserManagementView } from './UserManagement';
import { WalletManagement as WalletManagementView } from './WalletManagement';
import { JITApprovalQueue as JITApprovalQueueView } from './JITApprovalQueue';
import { MarketOps as MarketOpsView } from './MarketOperations';
import { SupportTicketing as SupportTicketingView } from '../components/SupportTicketing';

export * from './ControlCenter';
export * from './UserManagement';
export * from './WalletManagement';
export * from './JITApprovalQueue';
export * from './AuditLogs';
export * from './MarketOperations';
export * from '../components/SupportTicketing';

const AdminPageSkeleton: React.FC<{ title: string, activeTab?: number, hideTitle?: boolean }> = ({ title, activeTab, hideTitle }) => {
    return (
        <Box sx={{ px: 3, pt: 2.5, pb: 0, height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!hideTitle && (
                <Typography sx={{ fontSize: '20px', fontWeight: 800, color: 'text.primary', mb: 2, letterSpacing: -0.5 }}>
                    {title}
                </Typography>
            )}
            <Box sx={{ flex: 1, minHeight: 0 }}>
                {activeTab === 0 && <ControlCenterView />}
                {activeTab === 1 && <UserManagementView />}
                {activeTab === 2 && <MarketOpsView />}
                {activeTab === 3 && <WalletManagementView />}
                {activeTab === 4 && <AuditLogsView />}
                {activeTab === 5 && <JITApprovalQueueView />}
                {activeTab === 6 && <SupportTicketingView />}
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
            </Box>
        </Box>
    );
};

export const ControlCenter: React.FC = () => <AdminPageSkeleton title="Admin Control Center" activeTab={0} />;
export const UserManagement: React.FC = () => <AdminPageSkeleton title="User Administration" activeTab={1} hideTitle />;
export const MarketOps: React.FC = () => <AdminPageSkeleton title="Market Operations" activeTab={2} hideTitle />;
export const WalletManagement: React.FC = () => <AdminPageSkeleton title="Wallet Management" activeTab={3} hideTitle />;
export const AuditLogs: React.FC = () => <AdminPageSkeleton title="Audit Logs" activeTab={4} hideTitle />;
export const JITApprovalQueue: React.FC = () => <AdminPageSkeleton title="JIT Approvals" activeTab={5} hideTitle />;
export const RiskGovernance: React.FC = () => <AdminPageSkeleton title="Risk Governance" />;
export const SupportTicketing: React.FC = () => <AdminPageSkeleton title="Support Ticketing" activeTab={6} hideTitle />;
