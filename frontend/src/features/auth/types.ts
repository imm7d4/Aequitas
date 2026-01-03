export interface User {
    id: string;
    email: string;
    fullName?: string;
    displayName?: string;
    bio?: string;
    avatar?: string;
    lastLoginAt?: string;
    lastLoginIP?: string;
    isAdmin: boolean;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
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
