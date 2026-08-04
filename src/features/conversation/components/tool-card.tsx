import type { ToolExecution } from "../types";

interface ToolCardProps {
    tool: ToolExecution;
}

export function ToolCard({ tool }: ToolCardProps) {

    const statusMap: any = {
        waiting: "⏳ Waiting",
        running: "🔄 Running",
        completed: "✅ Completed",
        error: "❌ Error",
    };

    return (
        <div className="mt-3 rounded-xl border bg-muted/40 p-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium">{tool.name}</h4>

                <span className="text-xs text-muted-foreground">
                    {statusMap[tool.status]}
                </span>
            </div>
            {
                tool.status === "running" && (
                    <p className="mt-3 text-xs text-muted-foreground">
                        "Waiting for human approval"
                    </p>
                )
            }
            {
                tool.status === "completed" && (
                    <pre className="mt-3 overflow-auto rounded-lg bg-background p-3 text-xs">
                        {JSON.stringify(tool.result, null, 2)}
                    </pre>
                )
            }
            {tool.error && (
                <pre className="mt-3 overflow-auto rounded-lg bg-background p-3 text-xs">
                    {JSON.stringify(tool.error, null, 2)}
                </pre>
            )}
        </div>
    );
}