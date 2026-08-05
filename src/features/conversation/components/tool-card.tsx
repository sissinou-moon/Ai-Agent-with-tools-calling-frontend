"use client";

import { useState } from "react";
import type { ToolExecution } from "../types";
import { ChevronDownIcon, ChevronUpIcon, Settings2Icon, CheckCircle2Icon, Loader2Icon, XCircleIcon } from "lucide-react";

interface ToolCardProps {
    tool: ToolExecution;
}

export function ToolCard({ tool }: ToolCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const statusConfig: any = {
        waiting: { text: "Waiting", icon: <Loader2Icon className="size-4 animate-spin" />, color: "text-muted-foreground" },
        running: { text: "Running", icon: <Loader2Icon className="size-4 animate-spin" />, color: "text-blue-500" },
        completed: { text: "Completed", icon: <CheckCircle2Icon className="size-4" />, color: "text-emerald-500" },
        error: { text: "Error", icon: <XCircleIcon className="size-4" />, color: "text-destructive" },
    };

    const config = statusConfig[tool.status] || statusConfig.waiting;
    const hasContent = tool.status === "completed" || tool.error || tool.status === "running";

    return (
        <div className="mt-3 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div 
                className="flex cursor-pointer items-center justify-between p-3 border-b border-border/50 hover:bg-muted/40 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                        <Settings2Icon className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-tight">
                            {tool.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                        <span className={`text-xs flex items-center gap-1.5 ${config.color} font-medium`}>
                            {config.icon}
                            {config.text}
                        </span>
                    </div>
                </div>
                
                <div className="flex size-8 items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-colors">
                   {isExpanded ? (
                       <ChevronUpIcon className="size-4 text-muted-foreground" />
                   ) : (
                       <ChevronDownIcon className="size-4 text-muted-foreground" />
                   )}
                </div>
            </div>
            
            {hasContent && (
                <div 
                    className={`relative transition-all duration-500 ease-in-out cursor-pointer ${isExpanded ? "max-h-[800px]" : "max-h-32 overflow-hidden"}`}
                    onClick={() => !isExpanded && setIsExpanded(true)}
                >
                    <div className="p-4 bg-muted/20">
                        {tool.status === "running" && (
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Loader2Icon className="size-4 animate-spin" />
                                <span>Executing operation...</span>
                            </div>
                        )}
                        {tool.status === "completed" && Boolean(tool.result) && (
                            <div className="rounded-lg bg-[#0d1117] p-4 overflow-auto scrollbar-thin border border-border/50 shadow-inner">
                                <pre className="text-xs text-[#e6edf3] font-mono leading-relaxed">
                                    {JSON.stringify(tool.result, null, 2)}
                                </pre>
                            </div>
                        )}
                        {tool.error && (
                            <div className="rounded-lg bg-destructive/10 p-4 overflow-auto border border-destructive/20 text-destructive shadow-inner">
                                <pre className="text-xs font-mono leading-relaxed">
                                    {JSON.stringify(tool.error, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                    
                    {!isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/95 to-transparent flex items-end justify-center pb-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-background/80 px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-sm animate-bounce">
                                <ChevronDownIcon className="size-3" />
                                Expand to see more
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}