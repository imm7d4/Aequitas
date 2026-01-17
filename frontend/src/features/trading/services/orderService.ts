import { api } from '@/lib/api/apiClient';
import { APIResponse } from '@/features/auth/types';

export interface OrderRequest {
    instrumentId: string;
    side: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TRAILING_STOP';
    quantity: number;
    price?: number;
    clientOrderId: string;
    clientOrderId: string;
    symbol: string;
    intent?: 'OPEN_LONG' | 'OPEN_SHORT' | 'CLOSE_LONG' | 'CLOSE_SHORT';

    // Stop Order Fields
    stopPrice?: number;
    limitPrice?: number;
    trailAmount?: number;
    trailType?: 'ABSOLUTE' | 'PERCENTAGE';
}

export interface OrderResponse {
    id: string;
    orderId: string;
    instrumentId: string;
    symbol: string;
    intent?: string;
    side: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TRAILING_STOP';
    quantity: number;
    price?: number;
    status: string;
    createdAt: string;
    validatedAt: string;

    // Stop Order Fields
    stopPrice?: number;
    limitPrice?: number;
    trailAmount?: number;
    trailType?: 'PERCENTAGE' | 'ABSOLUTE';
    highestPrice?: number;
    lowestPrice?: number;
    currentStopPrice?: number;
    executedAt?: string;
    triggeredAt?: string;
    triggerPrice?: number;
    avgFillPrice?: number;
    filledQuantity?: number;
    filledAt?: string;
}

export interface PaginatedOrdersResponse {
    orders: OrderResponse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface OrderFilters {
    instrumentId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export const orderService = {
    placeOrder: async (order: OrderRequest): Promise<OrderResponse> => {
        const response = await api.post<APIResponse<OrderResponse>>('/orders', order);
        return response.data.data;
    },
    getOrders: async (filters?: OrderFilters): Promise<PaginatedOrdersResponse> => {
        const params = new URLSearchParams();
        if (filters?.instrumentId) params.append('instrumentId', filters.instrumentId);
        if (filters?.status) params.append('status', filters.status);
        if (filters?.startDate) params.append('startDate', filters.startDate);
        if (filters?.endDate) params.append('endDate', filters.endDate);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const queryString = params.toString();
        const url = queryString ? `/orders?${queryString}` : '/orders';

        const response = await api.get<APIResponse<PaginatedOrdersResponse>>(url);
        return response.data.data;
    },
    modifyOrder: async (orderId: string, quantity: number, price?: number): Promise<OrderResponse> => {
        const response = await api.put<APIResponse<OrderResponse>>(`/orders/${orderId}`, {
            quantity,
            price,
        });
        return response.data.data;
    },
    cancelOrder: async (orderId: string): Promise<OrderResponse> => {
        const response = await api.delete<APIResponse<OrderResponse>>(`/orders/${orderId}`);
        return response.data.data;
    },
};
