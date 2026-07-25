import { useMemo, useState } from "react";
import type { Conversation, Message } from "../types";
import { useMutation } from "@tanstack/react-query";
import { sendMessage as sendMessageApi } from "../api/send-message";


export function useConversation() {
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: crypto.randomUUID(),
            title: "New Chat",
            messages: [],
        },
    ]);

    const [activeId, setActiveId] = useState(conversations[0].id);

    const [input, setInput] = useState("");

    const mutation = useMutation({
        mutationFn: sendMessageApi,
    });

    const activeConversation = useMemo(
        () => conversations.find((c) => c.id === activeId)!,
        [conversations, activeId]
    );

    const addConversation = () => {
        const conversation: Conversation = {
            id: crypto.randomUUID(),
            title: "New Chat",
            messages: [],
        };

        setConversations((prev) => [...prev, conversation]);
        setActiveId(conversation.id);
    };

    const removeConversation = (id: string) => {
        setConversations((prev) => {
            const next = prev.filter((c) => c.id !== id);

            if (next.length === 0) {
                const conversation: Conversation = {
                    id: crypto.randomUUID(),
                    title: "New Chat",
                    messages: [],
                };

                setActiveId(conversation.id);

                return [conversation];
            }

            if (activeId === id) {
                setActiveId(next[next.length - 1].id);
            }

            return next;
        });
    };

    const updateConversation = (
        conversationId: string,
        updater: (conversation: Conversation) => Conversation
    ) => {
        setConversations((prev) =>
            prev.map((conversation) =>
                conversation.id === conversationId
                    ? updater(conversation)
                    : conversation
            )
        );
    };

    const sendMessage = async () => {
        const assistantPlaceholder: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "",
            thinking: "Thinking...",
            createdAt: new Date(),
        };
        try {
            if (!input.trim()) return;

            const userMessage: Message = {
                id: crypto.randomUUID(),
                role: "user",
                content: input,
                createdAt: new Date(),
            };

            updateConversation(activeId, (conversation) => ({
                ...conversation,
                messages: [...conversation.messages, userMessage],
            }));

            setInput("");

            updateConversation(activeId, (conversation) => ({
                ...conversation,
                messages: [
                    ...conversation.messages,
                    assistantPlaceholder,
                ],
            }));

            const response = await mutation.mutateAsync({
                message: userMessage.content,
            });

            const assistantMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: response.message.content ?? "",
                thinking: response.message.thinking ?? null,
                createdAt: new Date(),
            };

            updateConversation(activeId, (conversation) => ({
                ...conversation,
                messages: conversation.messages.map((message) =>
                    message.id === assistantPlaceholder.id
                        ? {
                            ...message,
                            content: response.message.content ?? "",
                            thinking: response.message.thinking ?? null,
                        }
                        : message
                ),
            }));
        } catch (error) {
            updateConversation(activeId, (conversation) => ({
                ...conversation,
                messages: conversation.messages.map((message) =>
                    message.id === assistantPlaceholder.id
                        ? {
                            ...message,
                            content: "Something went wrong. Please try again.",
                            thinking: null,
                        }
                        : message
                ),
            }));
        }
    };

    return {
        conversations,
        activeConversation,
        activeId,

        input,
        setInput,

        addConversation,
        removeConversation,
        setActiveId,
        updateConversation,
        sendMessage
    };
}