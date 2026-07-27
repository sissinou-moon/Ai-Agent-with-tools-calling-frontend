export interface ConnectionStatus {
    app: string;
    user_id: string;
}

export interface SaveConnectionPayload {
    user_id: string;
    app: string;
    access_token: string;
    data: {
        expires_in: number;
        refresh_token: string;
        scope: string;
        token_type: string;
        refresh_token_expires_in: number;
    };
}

export interface SaveConnectionResponse {
    user_id: string;
    access_token: string;
    updated_at: string;
    app: string;
    created_at: string;
    id: number;
    data: {
        scope: string;
        expires_in: number;
        token_type: string;
        refresh_token: string;
        refresh_token_expires_in: number;
    };
}

