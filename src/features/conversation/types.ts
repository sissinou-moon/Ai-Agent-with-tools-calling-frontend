export type MessageRole = "user" | "assistant";

export interface ToolCall {
    id?: string;
    function: {
        name: string;
        arguments: Record<string, unknown>;
    };
}

export interface Message {
    id: string;
    role: MessageRole;

    // main content
    content: string;

    // optional metadata from backend
    thinking?: string | null;
    images?: string[] | null;
    toolName?: string | null;
    toolCalls?: ToolCall[] | null;

    // ui state
    status?: "pending" | "success" | "error";

    createdAt: Date;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
}

export interface SendMessageRequest {
    message: string;
}

export interface SendMessageResponse {
    message: {
        role: "assistant";
        content?: string | null;
        thinking?: string | null;
        images?: string[] | null;
        tool_name?: string | null;
        tool_calls?: ToolCall[] | null;
    };
}