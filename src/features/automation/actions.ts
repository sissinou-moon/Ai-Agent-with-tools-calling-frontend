"use server";

import { cookies } from "next/headers";
import { setAuthCookies, clearAuthCookies } from "@/features/auth/actions";
import { COOKIE_NAMES } from "@/features/auth/constants";
import type {
    Workflow,
    WorkflowRun,
    CreateWorkflowPayload,
    TriggerWorkflowResponse,
    NotionDatabase,
    NotionDatabaseSchema,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─── Helper: Get access token, refresh if needed ───
async function getAccessToken(): Promise<string> {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;

    if (!accessToken) {
        const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
        if (!refreshToken) {
            throw new Error("Unauthorized: No session found.");
        }

        const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            await setAuthCookies(refreshData.access_token, refreshData.refresh_token);
            accessToken = refreshData.access_token;
        } else {
            await clearAuthCookies();
            throw new Error("Unauthorized: Session expired.");
        }
    }

    return accessToken!;
}

// ─── Helper: Authenticated fetch with auto-refresh on 401 ───
async function authenticatedFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    let accessToken = await getAccessToken();

    let response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...options.headers,
        },
        cache: "no-store",
    });

    if (response.status === 401) {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

        if (!refreshToken) {
            await clearAuthCookies();
            throw new Error("Session expired. Please log in again.");
        }

        const refreshResponse = await fetch(`${API_URL}/api/v1/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            await setAuthCookies(refreshData.access_token, refreshData.refresh_token);

            response = await fetch(url, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshData.access_token}`,
                    ...options.headers,
                },
                cache: "no-store",
            });
        } else {
            await clearAuthCookies();
            throw new Error("Session expired. Please log in again.");
        }
    }

    return response;
}

// ─── Fetch Workflows ───
export async function fetchWorkflows(): Promise<Workflow[]> {
    const response = await authenticatedFetch(`${API_URL}/api/v1/workflows`);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to fetch workflows (${response.status})`);
    }
    return response.json();
}

// ─── Create / Update Workflow ───
export async function createWorkflow(
    payload: CreateWorkflowPayload
): Promise<Workflow> {
    const response = await authenticatedFetch(`${API_URL}/api/v1/workflows`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to save workflow (${response.status})`);
    }
    return response.json();
}

// ─── Fetch Workflow Runs ───
export async function fetchWorkflowRuns(): Promise<WorkflowRun[]> {
    const response = await authenticatedFetch(`${API_URL}/api/v1/workflows/runs`);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to fetch runs (${response.status})`);
    }
    return response.json();
}

// ─── Trigger Workflow ───
export async function triggerWorkflow(
    token: string,
    data: Record<string, unknown>
): Promise<TriggerWorkflowResponse> {
    const response = await authenticatedFetch(
        `${API_URL}/api/v1/workflows/${token}`,
        {
            method: "POST",
            body: JSON.stringify({ data }),
        }
    );
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to trigger workflow (${response.status})`);
    }
    return response.json();
}

// ─── Notion: List Databases ───
export async function fetchNotionDatabases(): Promise<NotionDatabase[]> {
    const response = await authenticatedFetch(
        `${API_URL}/api/v1/connection/notion/databases`,
        {
            method: "POST",
            body: JSON.stringify({}),
        }
    );
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to fetch Notion databases (${response.status})`);
    }
    return response.json();
}

// ─── Notion: Get Database Schema ───
export async function fetchNotionDatabaseSchema(
    databaseId: string
): Promise<NotionDatabaseSchema> {
    const response = await authenticatedFetch(
        `${API_URL}/api/v1/connection/notion/database/schema`,
        {
            method: "POST",
            body: JSON.stringify({ database_id: databaseId }),
        }
    );
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to fetch database schema (${response.status})`);
    }
    return response.json();
}
