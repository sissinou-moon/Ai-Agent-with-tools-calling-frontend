export interface WebhookEvent {
    id: string;
    user_id: string;
    type: string;
    source: string;
    data: Record<string, any>;
    created_at: string;
}

export interface GetEventsResponse {
    success: boolean;
    data?: WebhookEvent[];
    message?: string;
}

export interface GetTokenResponse {
    success: boolean;
    token?: string;
    message?: string;
}
