import type {
    Message,
    SendMessageResponse,
    ToolExecution,
} from "./types";

export function mapAssistantMessage(
    response: SendMessageResponse,
    messageId: string
): Message {
    const tools: ToolExecution[] =
        response.message.tool_calls?.map((toolCall) => ({
            id: crypto.randomUUID(),

            name: toolCall.function.name,

            status: "pending",

            arguments: toolCall.function.arguments,

            result: undefined,

            error: undefined,
        })) ?? [];

    return {
        id: messageId,

        role: "assistant",

        content: response.message.content ?? "",

        thinking: response.message.thinking ?? "",

        createdAt: new Date(),

        status: "completed",

        tools,
    };
}