export interface UserPreferences {
    theme: string;
    defaultPage: string;
    notificationsEnabled: boolean;
}

export type AdminRole = 'PLATFORM_ADMIN' | 'RISK_OFFICER' | 'COMPLIANCE_OFFICER' | 'SUPPORT';
export type UserRole = 'TRADER' | AdminRole;

export interface User {
    id: string;
    email: string;
    fullName?: string;
    displayName?: string;
    bio?: string;
    avatar?: string;
    phone?: string;
    lastLoginAt?: string;
    lastLoginIP?: string;
    preferences: UserPreferences;
    isAdmin: boolean;
    role: UserRole;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    isOnboardingComplete?: boolean;
    onboardingSkipped?: boolean;
    onboardingCompletedAt?: string;
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
