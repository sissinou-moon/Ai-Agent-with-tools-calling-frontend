import { SendIcon } from "lucide-react";

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function ChatInput({
    value,
    onChange,
    onSend,
    onKeyDown,
}: ChatInputProps) {
    return (
        <div className="shrink-0 border-t border-border/40 bg-background/60 p-4 backdrop-blur-sm">
            <div className="mx-auto max-w-3xl">
                <div className="relative flex items-end rounded-2xl border border-border/60 bg-muted/30 shadow-sm transition-colors focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20">
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Type your message here..."
                        rows={2}
                        className="flex-1 resize-none bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground/60"
                    />

                    <button
                        onClick={onSend}
                        disabled={!value.trim()}
                        className="m-2 flex shrink-0 items-center justify-center rounded-xl bg-primary p-2.5 text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <SendIcon className="size-4" />
                    </button>
                </div>

                <p className="mt-2 text-center text-xs text-muted-foreground/50">
                    Press Enter to send · Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}