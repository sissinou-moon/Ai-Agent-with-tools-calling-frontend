import type { Message } from "../types";
import { Thinking } from "./thinking";
import { ToolList } from "./tool-list";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
                <div className="rounded-xl bg-muted/40 p-4 markdown-prose">
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
                                    <code className="block bg-muted p-3 rounded-lg overflow-x-auto text-sm mb-2 mt-1" {...props}>
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
        </div>
    );
}