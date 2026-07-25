// ─── API Endpoint Paths ───
export const AUTH_ENDPOINTS = {
    REGISTER: "/api/v1/auth/register",
    VERIFY: "/api/v1/auth/verify",
    LOGIN: "/api/v1/auth/login",
} as const;

// ─── Cookie Configuration ───
export const COOKIE_NAMES = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
} as const;

// 30 days in seconds (refresh token lifetime)
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

// 1 day in seconds (access token lifetime)
export const ACCESS_TOKEN_MAX_AGE = 60 * 60 * 24;

// ─── OTP Configuration ───
export const OTP_LENGTH = 6;
