"use client";

import { useEffect, useRef } from "react";

import type { Message } from "../types";
import { EmptyState } from "./empty-state";

interface ChatMessagesProps {
    messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
    if (messages.length === 0) {
        return <EmptyState />;
    }

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex flex-1 flex-col overflow-y-auto p-6">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`mb-4 flex ${message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                        }`}
                >
                    <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                            }`}
                    >
                        {message.content || message.thinking}
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}