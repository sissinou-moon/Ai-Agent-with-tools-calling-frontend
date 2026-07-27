import type { Message } from "../types";
import { EmptyState } from "./empty-state";
import { AssistantMessage } from "./assistant-message";
import { UserMessage } from "./user-message";

interface ChatMessagesProps {
    messages: Message[];
}

export function ChatMessages({
    messages,
}: ChatMessagesProps) {
    if (messages.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex max-w-4xl flex-col gap-6">
                {messages.map((message) =>
                    message.role === "user" ? (
                        <UserMessage
                            key={message.id}
                            message={message}
                        />
                    ) : (
                        <AssistantMessage
                            key={message.id}
                            message={message}
                        />
                    )
                )}
            </div>
        </div>
    );
}