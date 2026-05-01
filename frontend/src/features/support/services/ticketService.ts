import { api } from '@/lib/api/apiClient';
import { APIResponse } from '@/shared/types';

export interface SupportTicket {
    id: string;
    subject: string;
    description: string;
    status: string;
    priority: string;
    category: string;
    createdAt: string;
    updatedAt: string;
}

export interface TicketComment {
    id: string;
    authorId: string;
    authorName: string;
    role: string;
    message: string;
    attachments?: string[];
    createdAt: string;
}

export interface TicketData {
    id: string;
    userId: string;
    userName: string;
    subject: string;
    description: string;
    attachments?: string[];
    createdAt: string;
    comments: TicketComment[];
}

export const ticketService = {
    async getMyTickets(): Promise<SupportTicket[]> {
        const response = await api.get<APIResponse<SupportTicket[]>>('/tickets/my');
        return response.data.data;
    },

    async createTicket(data: {
        subject: string;
        category: string;
        description: string;
        attachments: string[];
    }): Promise<void> {
        await api.post('/tickets', data);
    },

    async getTicketDetails(ticketId: string): Promise<TicketData> {
        const response = await api.get<APIResponse<TicketData>>(`/tickets/${ticketId}`);
        return response.data.data;
    },

    async addComment(ticketId: string, data: {
        message: string;
        attachments: string[];
    }): Promise<void> {
        await api.post(`/tickets/${ticketId}/comments`, data);
    }
};
