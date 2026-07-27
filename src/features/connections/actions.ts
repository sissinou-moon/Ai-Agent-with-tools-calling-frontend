"use server";

import { cookies } from "next/headers";
import { setAuthCookies, clearAuthCookies } from "@/features/auth/actions";
import { COOKIE_NAMES } from "@/features/auth/constants";
import type { ConnectionStatus, SaveConnectionPayload, SaveConnectionResponse } from "./types";

export async function fetchConnectionStatus(): Promise<ConnectionStatus[]> {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

    if (!accessToken) {
        return [];
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // 1. Initial attempt to get connection status
    let response = await fetch(`${API_URL}/api/v1/connection/status`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store", // Ensure we always get fresh status
    });

    if (response.ok) {
        return response.json();
    }

    // 2. If 401 Unauthorized, attempt to refresh tokens
    if (response.status === 401) {
        const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

        if (!refreshToken) {
            await clearAuthCookies();
            return [];
        }

        const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            
            // Save new tokens
            await setAuthCookies(refreshData.access_token, refreshData.refresh_token);
            
            // 3. Retry status fetch with new access token
            response = await fetch(`${API_URL}/api/v1/connection/status`, {
                headers: {
                    Authorization: `Bearer ${refreshData.access_token}`,
                },
                cache: "no-store",
            });

            if (response.ok) {
                return response.json();
            }
        } else {
            // Refresh failed (e.g. invalid refresh token)
            await clearAuthCookies();
            return [];
        }
    }

    // Return empty array for any other errors (or could throw)
    return [];
}

export async function saveConnection(
    payload: SaveConnectionPayload
): Promise<SaveConnectionResponse> {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    // If no access token is found, attempt to refresh immediately using the refresh token
    if (!accessToken) {
        const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
        if (!refreshToken) {
            await clearAuthCookies();
            throw new Error("Unauthorized: No session found.");
        }

        const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            // Save new tokens in cookies
            await setAuthCookies(refreshData.access_token, refreshData.refresh_token);
            accessToken = refreshData.access_token;
        } else {
            await clearAuthCookies();
            throw new Error("Unauthorized: Session expired.");
        }
    }

    // 1. Initial attempt to save the connection
    let response = await fetch(`${API_URL}/api/v1/connection/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });

    if (response.ok) {
        return response.json();
    }

    // 2. If 401 Unauthorized, attempt to refresh tokens (e.g., if token expired during the request or was invalid)
    if (response.status === 401) {
        const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

        if (!refreshToken) {
            await clearAuthCookies();
            throw new Error("Unauthorized: Session expired.");
        }

        const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            
            // Save new tokens
            await setAuthCookies(refreshData.access_token, refreshData.refresh_token);
            
            // 3. Retry save connection fetch with new access token
            response = await fetch(`${API_URL}/api/v1/connection/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshData.access_token}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                return response.json();
            }
        } else {
            // Refresh failed (e.g. invalid refresh token)
            await clearAuthCookies();
            throw new Error("Session expired. Please log in again.");
        }
    }

    const errorText = await response.text();
    throw new Error(errorText || `Failed to save connection (Status: ${response.status})`);
}

