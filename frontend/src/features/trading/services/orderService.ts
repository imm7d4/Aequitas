import { api } from '@/lib/api/apiClient';
import { APIResponse } from '@/features/auth/types';

export interface OrderRequest {
    instrumentId: string;
    side: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT';
    quantity: number;
    price?: number;
    clientOrderId: string;
    symbol: string;
}

export interface OrderResponse {
    id: string;
    orderId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT';
    quantity: number;
    price?: number;
    status: string;
    createdAt: string;
    validatedAt: string;
}

export const orderService = {
    placeOrder: async (order: OrderRequest): Promise<OrderResponse> => {
        const response = await api.post<APIResponse<OrderResponse>>('/orders', order);
        return response.data.data;
    },
};
