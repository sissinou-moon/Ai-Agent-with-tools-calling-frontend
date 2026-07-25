"use server";

import { cookies } from "next/headers";
import {
    COOKIE_NAMES,
    ACCESS_TOKEN_MAX_AGE,
    REFRESH_TOKEN_MAX_AGE,
} from "./constants";

/**
 * Sets both auth tokens as httpOnly cookies.
 * Must be called from a Server Action context.
 */
export async function setAuthCookies(
    accessToken: string,
    refreshToken: string
) {
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    cookieStore.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    // Clear the logout indicator cookie
    cookieStore.delete("loggout");
}

/**
 * Reads the refresh token from cookies.
 */
export async function getRefreshToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
}

/**
 * Performs logout: deletes access_token and sets loggout to "true"
 * while keeping the refresh_token in cookies.
 */
export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAMES.ACCESS_TOKEN);
    cookieStore.set("loggout", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: REFRESH_TOKEN_MAX_AGE,
    });
}

