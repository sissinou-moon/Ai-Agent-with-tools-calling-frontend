import { useMemo, useState } from "react";
import type { Conversation, Message, MessageStatus, ToolExecution } from "../types";
import { useMutation } from "@tanstack/react-query";
import { sendMessage as sendMessageApi } from "../api/send-message";
import { mapAssistantMessage } from "../mapper";
import { toolRegistry } from "@/features/tools/registry";
import { useConnectionStatus } from "@/features/connections/hooks/use-connection-status";


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

    const { data: connections = [] } = useConnectionStatus();

    const connectionMap = useMemo(
        () =>
            Object.fromEntries(
                connections.map((connection) => [
                    connection.app,
                    connection,
                ])
            ),
        [connections]
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

    const updateToolStatus = (
        conversationId: string,
        messageId: string,
        toolId: string,
        status: MessageStatus,
        result?: unknown,
        error?: string
    ) => {
        updateConversation(conversationId, (conversation) => ({
            ...conversation,
            messages: conversation.messages.map((message) => {
                if (message.id !== messageId) {
                    return message;
                }

                return {
                    ...message,
                    tools: message.tools.map((tool) => {
                        if (tool.id !== toolId) {
                            return tool;
                        }

                        return {
                            ...tool,
                            status,
                            result,
                            error,
                        };
                    }),
                };
            }),
        }));
    };

    const sendMessage = async () => {
        const placeholderId = crypto.randomUUID();
        const assistantPlaceholder: Message = {
            id: placeholderId,
            role: "assistant",
            content: "",
            thinking: "Thinking...",
            createdAt: new Date(),
            status: "running",
            tools: []
        };
        try {
            if (!input.trim()) return;
            const content = input.trim();


            const userMessage: Message = {
                id: crypto.randomUUID(),
                role: "user",
                content,
                createdAt: new Date(),
                status: "completed",
                tools: []
            };

            setInput("");

            updateConversation(activeId, (conversation) => ({
                ...conversation,
                messages: [
                    ...conversation.messages,
                    userMessage,
                    assistantPlaceholder,
                ],
            }));

            const response = await mutation.mutateAsync({
                message: userMessage.content,
            });

            const assistantMessage =
                mapAssistantMessage(response, placeholderId);

            updateConversation(activeId, (conversation) => ({
                ...conversation,
                messages: conversation.messages.map((message) =>
                    message.id === assistantPlaceholder.id
                        ? assistantMessage
                        : message
                ),
            }));

            await executeTools(
                activeId,
                assistantMessage.id,
                assistantMessage.tools
            );
        } catch (error) {
            updateConversation(activeId, (conversation) => ({
                ...conversation,
                messages: conversation.messages.map((message) =>
                    message.id === assistantPlaceholder.id
                        ? {
                            ...message,
                            status: "error",
                            content: "Something went wrong. Please try again.",
                            thinking: "",
                        }
                        : message
                ),
            }));
        }
    };

    const executeTools = async (
        conversationId: string,
        messageId: string,
        tools: ToolExecution[]
    ) => {
        for (const tool of tools) {
            try {
                updateToolStatus(
                    conversationId,
                    messageId,
                    tool.id,
                    "running"
                );

                const executor = toolRegistry[
                    tool.name as keyof typeof toolRegistry
                ];

                if (!executor) {
                    throw new Error(`No executor found for ${tool.name}`);
                }

                const registry =
                    toolRegistry[
                    tool.name as keyof typeof toolRegistry
                    ];

                if (!registry) {
                    throw new Error(`Unknown tool ${tool.name}`);
                }

                const connection =
                    connectionMap[registry.app];

                if (!connection) {
                    throw new Error(`${registry.app} is not connected.`);
                }

                const result = await registry.execute({
                    connection,
                    tool,
                });
                updateToolStatus(
                    conversationId,
                    messageId,
                    tool.id,
                    "completed",
                    result
                );
            } catch (error) {
                updateToolStatus(
                    conversationId,
                    messageId,
                    tool.id,
                    "error",
                    undefined,
                    error instanceof Error
                        ? error.message
                        : "Unknown error"
                );
            }
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
        sendMessage,

        updateToolStatus
    };
}