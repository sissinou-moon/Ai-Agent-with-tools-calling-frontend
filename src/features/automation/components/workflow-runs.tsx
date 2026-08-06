"use client";

import { useState } from "react";
import type { WorkflowRun } from "../types";
import {
    CheckCircle2,
    XCircle,
    Clock,
    ChevronDownIcon,
    ChevronUpIcon,
    Loader2,
    HistoryIcon,
    AlertTriangleIcon,
    ZapIcon,
} from "lucide-react";

interface WorkflowRunsProps {
    runs: WorkflowRun[];
    isLoading: boolean;
}

export function WorkflowRuns({ runs, isLoading }: WorkflowRunsProps) {
    const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="space-y-3 animate-in fade-in duration-300">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border border-border/30 bg-card/30 p-4"
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-muted/50 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-32 rounded bg-muted/50 animate-pulse" />
                                <div className="h-2.5 w-48 rounded bg-muted/30 animate-pulse" />
                            </div>
                            <div className="h-6 w-16 rounded-full bg-muted/50 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (runs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 animate-in fade-in zoom-in-95 duration-500">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/30 mb-4">
                    <HistoryIcon className="size-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-sm font-semibold text-muted-foreground">
                    No runs yet
                </h3>
                <p className="text-xs text-muted-foreground/60 mt-1 text-center max-w-sm">
                    Trigger your workflow using the webhook URL or the test panel to see
                    run history here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {runs.map((run, index) => {
                const isExpanded = expandedRunId === run.id;
                const duration = calculateDuration(run.started_at, run.finished_at);

                return (
                    <div
                        key={run.id}
                        className={`
                            rounded-xl border overflow-hidden transition-all duration-300
                            ${run.status === "failed"
                                ? "border-red-500/15 bg-red-500/[0.02]"
                                : run.status === "success"
                                    ? "border-border/30 bg-card/30"
                                    : "border-amber-500/15 bg-amber-500/[0.02]"
                            }
                            animate-in fade-in slide-in-from-bottom-1
                        `}
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        {/* Run Header */}
                        <button
                            onClick={() =>
                                setExpandedRunId(isExpanded ? null : run.id)
                            }
                            className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/20 transition-colors"
                        >
                            {/* Status Icon */}
                            <div
                                className={`
                                    flex size-9 shrink-0 items-center justify-center rounded-lg
                                    ${run.status === "success"
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : run.status === "failed"
                                            ? "bg-red-500/10 text-red-400"
                                            : "bg-amber-500/10 text-amber-400"
                                    }
                                `}
                            >
                                {run.status === "success" ? (
                                    <CheckCircle2 className="size-4" />
                                ) : run.status === "failed" ? (
                                    <XCircle className="size-4" />
                                ) : (
                                    <Loader2 className="size-4 animate-spin" />
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-sm font-semibold ${
                                            run.status === "success"
                                                ? "text-emerald-400"
                                                : run.status === "failed"
                                                    ? "text-red-400"
                                                    : "text-amber-400"
                                        }`}
                                    >
                                        {run.status === "success"
                                            ? "Success"
                                            : run.status === "failed"
                                                ? "Failed"
                                                : "Running"}
                                    </span>
                                    {run.error && (
                                        <span className="flex items-center gap-1 text-[11px] text-red-400/70">
                                            <AlertTriangleIcon className="size-3" />
                                            {run.error}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-0.5 text-[11px] text-muted-foreground/50">
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3" />
                                        {new Date(run.started_at).toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    {duration && (
                                        <>
                                            <span>·</span>
                                            <span className="flex items-center gap-1">
                                                <ZapIcon className="size-3" />
                                                {duration}
                                            </span>
                                        </>
                                    )}
                                    <span>·</span>
                                    <span className="font-mono text-[10px]">
                                        {run.id.slice(0, 8)}
                                    </span>
                                </div>
                            </div>

                            {/* Expand Toggle */}
                            <div className="shrink-0 text-muted-foreground/40">
                                {isExpanded ? (
                                    <ChevronUpIcon className="size-4" />
                                ) : (
                                    <ChevronDownIcon className="size-4" />
                                )}
                            </div>
                        </button>

                        {/* Expanded Payload */}
                        {isExpanded && (
                            <div className="border-t border-border/20 p-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[11px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                                        Trigger Payload
                                    </span>
                                </div>
                                <pre className="rounded-lg bg-background/60 border border-border/30 p-3 text-xs font-mono text-muted-foreground overflow-x-auto no-scrollbar">
                                    {JSON.stringify(run.trigger_payload, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Duration Calculator ───
function calculateDuration(start: string, end: string): string | null {
    if (!start || !end) return null;
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}
