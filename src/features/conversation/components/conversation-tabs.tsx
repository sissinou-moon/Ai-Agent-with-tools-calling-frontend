import { PlusIcon, XIcon } from "lucide-react";

export interface Conversation {
    id: string;
    title: string;
    messages: any[];
}

interface ConversationTabsProps {
    conversations: Conversation[];
    activeId: string;
    onSelect: (id: string) => void;
    onAdd: () => void;
    onRemove: (id: string) => void;
}

export function ConversationTabs({
    conversations,
    activeId,
    onSelect,
    onAdd,
    onRemove,
}: ConversationTabsProps) {
    return (
        <div className="flex flex-1 items-center gap-1 overflow-x-auto px-2 no-scrollbar">
            {conversations.map((conv) => (
                <button
                    key={conv.id}
                    onClick={() => onSelect(conv.id)}
                    className={`group relative flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 ${activeId === conv.id
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`}
                >
                    <span className="max-w-[120px] truncate">
                        {conv.title}
                    </span>

                    {conversations.length > 1 && (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(conv.id);
                            }}
                            className="rounded-sm p-0.5 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
                        >
                            <XIcon className="size-3" />
                        </span>
                    )}
                </button>
            ))}

            <button
                onClick={onAdd}
                className="flex shrink-0 items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
                <PlusIcon className="size-4" />
            </button>
        </div>
    );
}