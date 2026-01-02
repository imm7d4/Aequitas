export interface User {
    id: string;
    email: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface APIResponse<T> {
    statusCode: number;
    data: T;
    message: string;
}
