import { Message, SendMessageResponse } from "./types";

export function mapAssistantMessage(
    response: SendMessageResponse
): Message {
    const msg = response.message;

    return {
        id: crypto.randomUUID(),
        role: "assistant",
        content: msg.content ?? "",
        thinking: msg.thinking ?? null,
        images: msg.images ?? null,
        toolName: msg.tool_name ?? null,
        toolCalls: msg.tool_calls ?? null,
        status: "success",
        createdAt: new Date(),
    };
}