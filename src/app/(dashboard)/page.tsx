"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, XIcon, SendIcon } from "lucide-react";

type Conversation = {
  id: string;
  title: string;
};

export default function ConversationPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>([
    { id: "1", title: "New Chat" },
  ]);
  const [activeId, setActiveId] = React.useState("1");
  const [input, setInput] = React.useState("");

  const addConversation = () => {
    const id = Date.now().toString();
    setConversations((prev) => [...prev, { id, title: `Chat ${prev.length + 1}` }]);
    setActiveId(id);
  };

  const removeConversation = (id: string) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) {
        const newConv = { id: Date.now().toString(), title: "New Chat" };
        setActiveId(newConv.id);
        return [newConv];
      }
      if (activeId === id) {
        setActiveId(next[next.length - 1].id);
      }
      return next;
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;
    // TODO: handle sending message
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
        <div className="flex flex-1 items-center gap-1 overflow-x-auto px-2 no-scrollbar">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`group relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 ${
                activeId === conv.id
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <span className="truncate max-w-[120px]">{conv.title}</span>
              {conversations.length > 1 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeConversation(conv.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                      removeConversation(conv.id);
                    }
                  }}
                  className="rounded-sm p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
                >
                  <XIcon className="size-3" />
                </span>
              )}
            </button>
          ))}

          {/* Add new conversation */}
          <button
            onClick={addConversation}
            className="flex shrink-0 items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            title="New conversation"
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Messages area */}
        <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10">
              <svg
                className="size-8 text-primary/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Start a conversation
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Ask anything — I&apos;m here to help with your tasks, questions, and ideas.
            </p>
          </div>
        </div>

        {/* Input area */}
        <div className="shrink-0 border-t border-border/40 bg-background/60 backdrop-blur-sm p-4">
          <div className="mx-auto max-w-3xl">
            <div className="relative flex items-end rounded-2xl border border-border/60 bg-muted/30 shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20">
              <textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                rows={2}
                className="flex-1 resize-none bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="m-2 flex shrink-0 items-center justify-center rounded-xl bg-primary p-2.5 text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <SendIcon className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground/50">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
