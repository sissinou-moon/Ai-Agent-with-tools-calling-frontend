import type { Message } from "../types";
import { Thinking } from "./thinking";
import { ToolList } from "./tool-list";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SparklesIcon } from "lucide-react";

interface AssistantMessageProps {
    message: Message;
}

export function AssistantMessage({
    message,
}: AssistantMessageProps) {
    const isWaiting = message.status === "running" || message.status === "pending";
    const hasThinkingContent = message.thinking && message.thinking !== "Thinking...";

    return (
        <div className="max-w-4xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {hasThinkingContent && (
                <Thinking thinking={message.thinking as string} />
            )}

            <ToolList tools={message.tools} />

            {message.content && (
                <div className="rounded-2xl bg-muted/30 p-5 shadow-sm border border-border/50 markdown-prose">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            table: ({ node, ...props }) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-border border rounded-lg" {...props} /></div>,
                            thead: ({ node, ...props }) => <thead className="bg-muted" {...props} />,
                            th: ({ node, ...props }) => <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" {...props} />,
                            td: ({ node, ...props }) => <td className="px-4 py-2 whitespace-nowrap text-sm border-t" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                            a: ({ node, ...props }) => <a className="text-primary hover:underline" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mb-2 mt-4" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mb-2 mt-4" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
                            code: ({ node, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return !match ? (
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <code className="block bg-[#0d1117] text-[#e6edf3] p-4 rounded-xl overflow-x-auto text-sm mb-2 mt-1 shadow-inner border border-border/50 font-mono" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
            )}

            {isWaiting && !message.content && (
                <div className="flex items-center gap-3 text-muted-foreground p-3 rounded-xl border bg-muted/20">
                     <div className="relative flex size-6 items-center justify-center">
                         <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75"></div>
                         <SparklesIcon className="relative size-3 text-primary animate-pulse" />
                     </div>
                     <span className="text-sm font-medium animate-pulse tracking-tight text-primary/80">AI is analyzing and working on your request...</span>
                </div>
            )}
        </div>
    );
}