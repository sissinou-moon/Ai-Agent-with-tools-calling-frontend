import type { ToolExecution } from "../types";
import { ToolCard } from "./tool-card";

interface ToolListProps {
    tools: ToolExecution[];
}

export function ToolList({ tools }: ToolListProps) {
    if (tools.length === 0) return null;

    return (
        <div className="space-y-3">
            {tools.map((tool) => (
                <ToolCard
                    key={tool.id}
                    tool={tool}
                />
            ))}
        </div>
    );
}