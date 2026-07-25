"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { ChatInput } from "@/features/conversation/components/chat-input";
import { ChatMessages } from "@/features/conversation/components/chat-messages";
import {
  Conversation,
  ConversationTabs,
} from "@/features/conversation/components/conversation-tabs";
import React from "react";
import { PlusIcon, SendIcon, XIcon } from "lucide-react";
import { useConversation } from "@/features/conversation/hooks/use-conversation";


export default function ConversationPage() {
  const {
    conversations,
    activeConversation,
    activeId,
    input,
    setInput,
    addConversation,
    removeConversation,
    setActiveId,
    sendMessage,
  } = useConversation();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Top bar: sidebar trigger + conversation tabs */}
      <header className="flex h-14 shrink-0 items-center border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
        </div>

        {/* Conversation tabs */}
        <ConversationTabs
          conversations={conversations}
          activeId={activeId}
          onSelect={setActiveId}
          onAdd={addConversation}
          onRemove={removeConversation}
        />
      </header>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Messages area */}
        <ChatMessages messages={activeConversation.messages} />

        {/* Input area */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={sendMessage}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
