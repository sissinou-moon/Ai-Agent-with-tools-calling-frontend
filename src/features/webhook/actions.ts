"use server";

import { authenticatedFetch } from "@/features/automation/actions";
import type { GetEventsResponse, GetTokenResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWebhookEvents(): Promise<GetEventsResponse> {
    const response = await authenticatedFetch(`${API_URL}/api/v1/webhook/events`);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to fetch events (${response.status})`);
    }
    return response.json();
}

export async function fetchWebhookToken(): Promise<GetTokenResponse> {
    const response = await authenticatedFetch(`${API_URL}/api/v1/webhook/events/token`);
    if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `Failed to fetch webhook token (${response.status})`);
    }
    return response.json();
}
