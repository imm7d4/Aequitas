import { api } from '@/lib/api/apiClient';
import { APIResponse } from '@/shared/types';

export interface AuditLog {
    id: string;
    timestamp: string;
    actor_id: string;
    actor_name: string;
    actor_role: string;
    action: string;
    resource_id: string;
    resource_type: string;
    description: string;
    old_value: any;
    new_value: any;
    hash: string;
    previous_hash: string;
    correlation_id: string;
}

export interface PlatformMetrics {
    tpm: number;
    dau: number;
    concurrentSessions: number;
    timestamp: string;
}

export interface Threshold {
    metricName: string;
    value: number;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    isEnabled: boolean;
}

export interface AdminConfig {
    alertThresholds: Threshold[];
    isGlobalHalt: boolean;
    haltReason: string;
    maintenanceMode: boolean;
}

export interface JITRequest {
    id: string;
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

export interface AdminUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    kycStatus: string;
    status: string;
    createdAt?: string;
}

export const adminService = {
    // Audit Logs
    async getAuditLogs(): Promise<AuditLog[]> {
        const response = await api.get<APIResponse<AuditLog[]>>('/admin/audit/logs');
        return response.data.data;
    },

    async justifyAuditLog(logId: string, ticketRef: string, justification: string): Promise<void> {
        await api.post('/admin/audit/justify', { logId, ticketRef, justification });
    },

    // Platform Metrics
    async getPlatformMetrics(): Promise<PlatformMetrics> {
        const response = await api.get<APIResponse<PlatformMetrics>>('/admin/platform/metrics');
        return response.data.data;
    },

    // Config
    async getAdminConfig(): Promise<AdminConfig> {
        const response = await api.get<APIResponse<AdminConfig>>('/admin/config');
        return response.data.data;
    },

    async updateAdminConfig(config: Partial<AdminConfig>): Promise<void> {
        await api.put('/admin/config', config);
    },

    // JIT Requests
    async requestJITAccess(data: {
        action: string;
        resourceId: string;
        amount: number;
        reason: string;
        duration: number;
    }): Promise<void> {
        await api.post('/admin/jit/request', data);
    },

    async getJitApprovals(): Promise<JITRequest[]> {
        const response = await api.get<APIResponse<JITRequest[]>>('/admin/jit/approvals');
        return response.data.data;
    },

    async approveJitRequest(requestId: string): Promise<void> {
        await api.post('/admin/jit/approve', { requestId });
    },

    async rejectJitRequest(requestId: string | number): Promise<void> {
        await api.post('/admin/jit/reject', { requestId });
    },

    // Wallets
    async getWallets(): Promise<any[]> {
        const response = await api.get<APIResponse<any[]>>('/admin/wallets');
        return response.data.data;
    },

    // Users
    async getUsers(): Promise<AdminUser[]> {
        const response = await api.get<APIResponse<AdminUser[]>>('/admin/users');
        return response.data.data;
    },

    async updateUserStatus(userId: string, status: string): Promise<void> {
        await api.put(`/admin/users/${userId}/status`, { status });
    },

    async createUser(userData: any): Promise<void> {
        await api.post('/admin/users', userData);
    }
};
