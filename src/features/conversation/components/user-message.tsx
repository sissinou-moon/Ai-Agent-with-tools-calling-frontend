import type { Message } from "../types";

interface UserMessageProps {
    message: Message;
}

export function UserMessage({
    message,
}: UserMessageProps) {
    return (
        <div className="flex justify-end">
            <div className="max-w-3xl rounded-xl bg-primary px-4 py-3 text-primary-foreground whitespace-pre-wrap">
                {message.content}
            </div>
        </div>
    );
}