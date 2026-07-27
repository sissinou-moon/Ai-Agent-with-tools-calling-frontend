import type { Message } from "../types";
import { Thinking } from "./thinking";
import { ToolList } from "./tool-list";

interface AssistantMessageProps {
    message: Message;
}

export function AssistantMessage({
    message,
}: AssistantMessageProps) {
    return (
        <div className="max-w-4xl space-y-3">
            {message.thinking && (
                <Thinking thinking={message.thinking} />
            )}

            <ToolList tools={message.tools} />

            {message.content && (
                <div className="rounded-xl bg-muted/40 p-4 whitespace-pre-wrap">
                    {message.content}
                </div>
            )}
        </div>
    );
}