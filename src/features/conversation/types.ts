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

    role: "user" | "assistant";

    content: string;

    thinking?: string;

    createdAt: Date;

    status: MessageStatus;

    tools: ToolExecution[];

    toolCalls: ToolCall[]; // <-- add this
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

export type MessageStatus =
    | "pending"
    | "running"
    | "completed"
    | "error";

export interface ToolExecution {
    id: string;

    name: string;

    status: MessageStatus;

    arguments: Record<string, unknown>;

    result?: unknown;

    error?: string;
}

export interface ContinueMessageRequest {
    messages: ContinueChatMessage[];
}

export interface ContinueChatMessage {
    role: "user" | "assistant" | "tool";

    content?: unknown;

    tool_name?: string;

    tool_calls?: ToolCall[];
}