"use client";

import { useState } from "react";
import type { Workflow, WorkflowStep } from "../types";
import { useTriggerWorkflow } from "../hooks/use-workflows";
import {
    CopyIcon,
    CheckIcon,
    PlayIcon,
    PencilIcon,
    GlobeIcon,
    ZapIcon,
    Loader2,
    CheckCircle2,
    XCircleIcon,
    CodeIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "lucide-react";
import { toast } from "sonner";

interface WorkflowOverviewProps {
    workflow: Workflow;
    runs: { total: number; successful: number; lastRun?: string };
    onEdit: () => void;
}

export function WorkflowOverview({ workflow, runs, onEdit }: WorkflowOverviewProps) {
    const [copied, setCopied] = useState(false);
    const [showTestPanel, setShowTestPanel] = useState(false);
    const [testPayload, setTestPayload] = useState(
        JSON.stringify(
            {
                data: {
                    name: "sissinou",
                    email: "sissinouyassine7@gmail.com",
                },
            },
            null,
            2
        )
    );

    const triggerWorkflow = useTriggerWorkflow();

    const webhookUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/workflows/${workflow.webhook_token}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            setCopied(true);
            toast.success("Webhook URL copied!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    const handleTest = () => {
        try {
            const parsed = JSON.parse(testPayload);
            const payload = parsed.data || parsed;

            triggerWorkflow.mutate(
                { token: workflow.webhook_token, data: payload },
                {
                    onSuccess: (result) => {
                        if (result.success) {
                            toast.success("Workflow triggered!", {
                                description: `Run ID: ${result.run_id}`,
                            });
                        } else {
                            toast.error("Workflow returned unsuccessful");
                        }
                    },
                    onError: (error) => {
                        toast.error("Failed to trigger workflow", {
                            description: error.message,
                        });
                    },
                }
            );
        } catch {
            toast.error("Invalid JSON payload");
        }
    };

    const successRate = runs.total > 0
        ? Math.round((runs.successful / runs.total) * 100)
        : 0;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ─── Main Card ─── */}
            <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-border/30">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10">
                                    <ZapIcon className="size-7 text-primary" />
                                </div>
                                {workflow.is_active && (
                                    <div className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                                        <div className="size-2 rounded-full bg-white animate-pulse" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight">
                                    {workflow.name}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                            workflow.is_active
                                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                                                : "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20"
                                        }`}
                                    >
                                        <div
                                            className={`size-1.5 rounded-full ${
                                                workflow.is_active ? "bg-emerald-400" : "bg-amber-400"
                                            }`}
                                        />
                                        {workflow.is_active ? "Active" : "Inactive"}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground/50">
                                        Created{" "}
                                        {new Date(workflow.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onEdit}
                            className="inline-flex items-center gap-2 rounded-lg bg-accent/50 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                        >
                            <PencilIcon className="size-3.5" />
                            Edit
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 divide-x divide-border/30">
                    <div className="p-5 text-center">
                        <p className="text-2xl font-bold tracking-tight">{runs.total}</p>
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                            Total Runs
                        </p>
                    </div>
                    <div className="p-5 text-center">
                        <p className="text-2xl font-bold tracking-tight text-emerald-400">
                            {successRate}%
                        </p>
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                            Success Rate
                        </p>
                    </div>
                    <div className="p-5 text-center">
                        <p className="text-sm font-medium tracking-tight mt-1">
                            {runs.lastRun
                                ? formatTimeAgo(runs.lastRun)
                                : "—"}
                        </p>
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                            Last Run
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Webhook URL ─── */}
            <div className="rounded-xl border border-border/40 bg-card/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <GlobeIcon className="size-4" />
                    Webhook Endpoint
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex-1 overflow-hidden rounded-lg bg-background/60 border border-border/30 px-3 py-2.5">
                        <code className="text-xs font-mono text-muted-foreground break-all select-all">
                            POST {webhookUrl}
                        </code>
                    </div>
                    <button
                        onClick={handleCopy}
                        className={`
                            shrink-0 rounded-lg p-2.5 transition-all duration-300
                            ${copied
                                ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                                : "bg-accent/50 text-muted-foreground hover:text-foreground hover:bg-accent"
                            }
                        `}
                    >
                        {copied ? (
                            <CheckIcon className="size-4 animate-in zoom-in duration-200" />
                        ) : (
                            <CopyIcon className="size-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* ─── Test Workflow ─── */}
            <div className="rounded-xl border border-border/40 bg-card/30 overflow-hidden">
                <button
                    onClick={() => setShowTestPanel(!showTestPanel)}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
                >
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <CodeIcon className="size-4 text-amber-400" />
                        Test Workflow
                    </div>
                    {showTestPanel ? (
                        <ChevronUpIcon className="size-4 text-muted-foreground" />
                    ) : (
                        <ChevronDownIcon className="size-4 text-muted-foreground" />
                    )}
                </button>

                {showTestPanel && (
                    <div className="border-t border-border/30 p-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-xs text-muted-foreground">
                            Send a test payload to trigger your workflow.
                        </p>
                        <textarea
                            value={testPayload}
                            onChange={(e) => setTestPayload(e.target.value)}
                            rows={8}
                            className="w-full rounded-lg border border-border/40 bg-background/60 px-3 py-2 text-xs font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/20 transition-all resize-none"
                            spellCheck={false}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={handleTest}
                                disabled={triggerWorkflow.isPending}
                                className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {triggerWorkflow.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <PlayIcon className="size-4" />
                                )}
                                {triggerWorkflow.isPending ? "Triggering..." : "Send Test"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Time Ago Helper ───
function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
