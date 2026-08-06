"use client";

import { useState } from "react";
import { WorkflowBuilder } from "./workflow-builder";
import { WorkflowOverview } from "./workflow-overview";
import { WorkflowRuns } from "./workflow-runs";
import { useWorkflows, useWorkflowRuns } from "../hooks/use-workflows";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Loader2, PlusIcon, SparklesIcon, BotIcon } from "lucide-react";

export function AutomationPage() {
    const { data: workflows = [], isLoading: workflowsLoading } = useWorkflows();
    const { data: runs = [], isLoading: runsLoading } = useWorkflowRuns();

    const [isEditing, setIsEditing] = useState(false);

    // For now, we assume 1 workflow per user.
    const activeWorkflow = workflows.length > 0 ? workflows[0] : null;

    const showBuilder = isEditing || (!workflowsLoading && !activeWorkflow);

    // Calculate run stats
    const totalRuns = runs.length;
    const successfulRuns = runs.filter((r) => r.status === "success").length;
    const lastRun = runs.length > 0 ? runs[0].started_at : undefined;

    return (
        <div className="flex h-full flex-col">
            {/* ─── Header ─── */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 bg-background/80 px-4 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <div className="flex items-center gap-2">
                        <BotIcon className="size-4 text-primary" />
                        <h1 className="text-sm font-semibold tracking-tight">Automation</h1>
                    </div>
                </div>

                {!showBuilder && activeWorkflow && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <PlusIcon className="size-3.5" />
                        New Workflow
                    </button>
                )}
            </header>

            {/* ─── Content Area ─── */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 relative">
                {/* Decorative background glow */}
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <div className="mx-auto max-w-5xl relative">
                    {workflowsLoading ? (
                        // Initial loading state
                        <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-in fade-in duration-500">
                            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 animate-pulse">
                                <Loader2 className="size-8 text-primary animate-spin" />
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">
                                Loading automation workspace...
                            </p>
                        </div>
                    ) : showBuilder ? (
                        // Builder View (Create / Edit)
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                        <SparklesIcon className="size-6 text-primary" />
                                        {activeWorkflow ? "Edit Workflow" : "Create Workflow"}
                                    </h2>
                                    <p className="text-muted-foreground mt-1">
                                        Connect tools and define your automation steps.
                                    </p>
                                </div>
                                {activeWorkflow && (
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>

                            <WorkflowBuilder
                                onSaved={() => setIsEditing(false)}
                                initialData={
                                    activeWorkflow
                                        ? { name: activeWorkflow.name, steps: [] } // In a full implementation, you'd fetch/pass the full workflow steps here if editing
                                        : undefined
                                }
                            />
                        </div>
                    ) : (
                        // Dashboard View (Overview + Runs)
                        activeWorkflow && (
                            <div className="grid gap-8 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px]">
                                {/* Left Column: Runs */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold tracking-tight">
                                            Run History
                                        </h3>
                                        {runsLoading && (
                                            <Loader2 className="size-4 animate-spin text-muted-foreground" />
                                        )}
                                    </div>
                                    <WorkflowRuns runs={runs} isLoading={runsLoading} />
                                </div>

                                {/* Right Column: Overview */}
                                <div className="space-y-4 lg:order-last order-first">
                                    <div className="sticky top-6">
                                        <WorkflowOverview
                                            workflow={activeWorkflow}
                                            runs={{
                                                total: totalRuns,
                                                successful: successfulRuns,
                                                lastRun: lastRun,
                                            }}
                                            onEdit={() => setIsEditing(true)}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
