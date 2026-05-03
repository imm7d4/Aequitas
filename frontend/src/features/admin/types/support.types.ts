export interface SupportTicket {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    subject: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    category: string;
    firstResponseAt?: string;
    resolvedAt?: string;
    createdAt: string;
}
