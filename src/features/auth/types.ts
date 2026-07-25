// ─── Raw API User (as returned by the backend) ───
export interface ApiUser {
    id: string;
    username: string;
    email: string;
    password: string;
    is_active: boolean;
    is_admin: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
}

// ─── Clean frontend User (password stripped) ───
export interface User {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    isAdmin: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

// ─── Register ───
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    message: string;
    user_id: string;
    otp: string;
}

// ─── Verify ───
export interface VerifyRequest {
    email: string;
    otp: string;
}

export interface VerifyResponse {
    message: string;
    is_verified: boolean;
    refresh_token: string;
    access_token: string;
    user: ApiUser;
}

// ─── Login ───
export interface LoginRequest {
    email: string;
    password: string;
    refresh_token: string;
}

export interface LoginResponse {
    message: string;
    refresh_token: string;
    old_refresh_token: string;
    access_token: string;
    user: ApiUser;
}
