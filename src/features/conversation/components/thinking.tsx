"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon, BrainIcon } from "lucide-react";

interface ThinkingProps {
    thinking: string;
}

export function Thinking({ thinking }: ThinkingProps) {
    const [expanded, setExpanded] = useState(false);

    if (!thinking.trim()) return null;

    return (
        <div className="rounded-xl border bg-muted/40">
            <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-muted/50"
            >
                {expanded ? (
                    <ChevronDownIcon className="size-4" />
                ) : (
                    <ChevronRightIcon className="size-4" />
                )}

                <BrainIcon className="size-4 text-primary" />

                <span>Thinking</span>
            </button>

            {expanded && (
                <div className="border-t px-4 py-3">
                    <pre className="whitespace-pre-wrap break-words font-sans text-sm text-muted-foreground">
                        {thinking}
                    </pre>
                </div>
            )}
        </div>
    );
}