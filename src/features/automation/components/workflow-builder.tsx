"use client";

import { useState } from "react";
import {
    Mail,
    Send,
    Database,
    Loader2,
    CheckCircle2,
    SparklesIcon,
    PlusIcon,
    XIcon,
    InfoIcon,
} from "lucide-react";
import { TelegramTestButton } from "./telegram-test-button";
import { NotionDatabasePicker } from "./notion-database-picker";
import { useCreateWorkflow } from "../hooks/use-workflows";
import type {
    ToolName,
    WorkflowStep,
    NotionColumnMapping,
    CreateWorkflowPayload,
} from "../types";
import { toast } from "sonner";

interface WorkflowBuilderProps {
    onSaved: () => void;
    initialData?: {
        name: string;
        steps: WorkflowStep[];
    };
}

const TOOLS = [
    {
        id: "send_email" as ToolName,
        name: "Gmail Email",
        description: "Send automated emails via Gmail",
        icon: Mail,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/20",
        ringColor: "ring-red-500/20",
        activeGlow: "shadow-red-500/10",
    },
    {
        id: "send_message" as ToolName,
        name: "Telegram Message",
        description: "Send messages via Telegram bot",
        icon: Send,
        color: "text-sky-400",
        bgColor: "bg-sky-500/10",
        borderColor: "border-sky-500/20",
        ringColor: "ring-sky-500/20",
        activeGlow: "shadow-sky-500/10",
    },
    {
        id: "add_row" as ToolName,
        name: "Notion Database",
        description: "Add rows to a Notion database",
        icon: Database,
        color: "text-violet-400",
        bgColor: "bg-violet-500/10",
        borderColor: "border-violet-500/20",
        ringColor: "ring-violet-500/20",
        activeGlow: "shadow-violet-500/10",
    },
];

export function WorkflowBuilder({ onSaved, initialData }: WorkflowBuilderProps) {
    // ─── State ───
    const [workflowName, setWorkflowName] = useState(initialData?.name || "");
    const [enabledTools, setEnabledTools] = useState<Set<ToolName>>(() => {
        if (initialData?.steps) {
            return new Set(initialData.steps.map((s) => s.tool_name));
        }
        return new Set();
    });

    // Email state
    const [emailTo, setEmailTo] = useState(() => {
        const step = initialData?.steps?.find((s) => s.tool_name === "send_email");
        return (step?.tool_arguments as Record<string, string>)?.to || "";
    });
    const [emailSubject, setEmailSubject] = useState(() => {
        const step = initialData?.steps?.find((s) => s.tool_name === "send_email");
        return (step?.tool_arguments as Record<string, string>)?.subject || "";
    });
    const [emailBody, setEmailBody] = useState(() => {
        const step = initialData?.steps?.find((s) => s.tool_name === "send_email");
        return (step?.tool_arguments as Record<string, string>)?.body || "";
    });

    // Telegram state
    const [telegramBotToken, setTelegramBotToken] = useState(() => {
        const step = initialData?.steps?.find((s) => s.tool_name === "send_message");
        return (step?.tool_arguments as Record<string, string>)?.bot_token || "";
    });
    const [telegramChatId, setTelegramChatId] = useState(() => {
        const step = initialData?.steps?.find((s) => s.tool_name === "send_message");
        return (step?.tool_arguments as Record<string, string>)?.chat_id || "";
    });
    const [telegramText, setTelegramText] = useState(() => {
        const step = initialData?.steps?.find((s) => s.tool_name === "send_message");
        return (step?.tool_arguments as Record<string, string>)?.text || "";
    });

    // Notion state
    const [notionDatabaseId, setNotionDatabaseId] = useState(() => {
        const step = initialData?.steps?.find((s) => s.tool_name === "add_row");
        return (step?.tool_arguments as Record<string, string>)?.database_id || "";
    });
    const [notionColumns, setNotionColumns] = useState<NotionColumnMapping[]>(() => {
        const step = initialData?.steps?.find((s) => s.tool_name === "add_row");
        if (step?.tool_arguments) {
            const args = step.tool_arguments as Record<string, string>;
            return Object.entries(args)
                .filter(([key]) => key !== "database_id")
                .map(([columnName, payloadField]) => ({ columnName, payloadField }));
        }
        return [];
    });

    const [saveSuccess, setSaveSuccess] = useState(false);

    const createWorkflow = useCreateWorkflow();

    // ─── Toggle tool ───
    const toggleTool = (toolId: ToolName) => {
        setEnabledTools((prev) => {
            const next = new Set(prev);
            if (next.has(toolId)) {
                next.delete(toolId);
            } else {
                next.add(toolId);
            }
            return next;
        });
    };

    // ─── Build steps ───
    const buildSteps = (): WorkflowStep[] => {
        const steps: WorkflowStep[] = [];

        if (enabledTools.has("send_email")) {
            steps.push({
                tool_name: "send_email",
                tool_arguments: {
                    to: emailTo,
                    subject: emailSubject,
                    body: emailBody,
                },
            });
        }

        if (enabledTools.has("send_message")) {
            steps.push({
                tool_name: "send_message",
                tool_arguments: {
                    text: telegramText,
                    chat_id: telegramChatId,
                    bot_token: telegramBotToken,
                    parse_mode: "HTML",
                },
            });
        }

        if (enabledTools.has("add_row")) {
            const notionArgs: Record<string, string> = {
                database_id: notionDatabaseId,
            };
            notionColumns.forEach((col) => {
                if (col.columnName && col.payloadField) {
                    notionArgs[col.columnName] = col.payloadField;
                }
            });
            steps.push({
                tool_name: "add_row",
                tool_arguments: notionArgs,
            });
        }

        return steps;
    };

    // ─── Save ───
    const handleSave = () => {
        if (!workflowName.trim()) {
            toast.error("Please enter a workflow name");
            return;
        }
        if (enabledTools.size === 0) {
            toast.error("Please enable at least one tool");
            return;
        }

        const payload: CreateWorkflowPayload = {
            name: workflowName,
            steps: buildSteps(),
        };

        createWorkflow.mutate(payload, {
            onSuccess: () => {
                setSaveSuccess(true);
                toast.success("Workflow saved successfully!", {
                    description: "Your automation is ready to go.",
                });
                setTimeout(() => {
                    setSaveSuccess(false);
                    onSaved();
                }, 1500);
            },
            onError: (error) => {
                toast.error("Failed to save workflow", {
                    description: error.message,
                });
            },
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ─── Workflow Name ─── */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                    Workflow Name
                </label>
                <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="e.g., Welcome Workflow"
                    className="w-full rounded-xl border border-border/40 bg-background/50 px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
            </div>

            {/* ─── Tool Selection ─── */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                    Choose Tools
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                    {TOOLS.map((tool, index) => {
                        const isEnabled = enabledTools.has(tool.id);
                        return (
                            <button
                                type="button"
                                key={tool.id}
                                onClick={() => toggleTool(tool.id)}
                                className={`
                                    relative flex flex-col items-center gap-2.5 rounded-xl border p-5
                                    transition-all duration-300 ease-out
                                    animate-in fade-in slide-in-from-bottom-2
                                    ${isEnabled
                                        ? `${tool.borderColor} ${tool.bgColor} shadow-lg ${tool.activeGlow} ring-1 ${tool.ringColor}`
                                        : "border-border/30 bg-card/30 hover:bg-card/60 hover:border-border/50"
                                    }
                                `}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div
                                    className={`
                                        flex size-12 items-center justify-center rounded-xl
                                        transition-all duration-300
                                        ${isEnabled
                                            ? `${tool.bgColor} ${tool.color}`
                                            : "bg-muted/50 text-muted-foreground"
                                        }
                                    `}
                                >
                                    <tool.icon className="size-6" />
                                </div>
                                <div className="text-center">
                                    <p className={`text-sm font-semibold ${isEnabled ? tool.color : ""}`}>
                                        {tool.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                                        {tool.description}
                                    </p>
                                </div>

                                {/* Active indicator */}
                                {isEnabled && (
                                    <div className="absolute -top-1.5 -right-1.5 animate-in zoom-in duration-200">
                                        <div className={`flex size-5 items-center justify-center rounded-full ${tool.bgColor} ring-2 ring-background`}>
                                            <CheckCircle2 className={`size-3.5 ${tool.color}`} />
                                        </div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── Tool Configuration Forms ─── */}
            <div className="space-y-6">
                {/* Email Form */}
                {enabledTools.has("send_email") && (
                    <div className="rounded-xl border border-red-500/15 bg-red-500/[0.03] p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2">
                            <Mail className="size-4 text-red-400" />
                            <h3 className="text-sm font-semibold text-red-400">
                                Gmail Configuration
                            </h3>
                        </div>

                        <div className="flex items-start gap-2 rounded-lg bg-red-500/5 p-3 border border-red-500/10">
                            <InfoIcon className="size-3.5 text-red-400/60 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-red-300/60">
                                Use <code className="rounded bg-red-500/10 px-1 py-0.5 font-mono text-red-400">{"{{payload.field}}"}</code> to dynamically inject values from the trigger payload.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    To (Recipient)
                                </label>
                                <input
                                    type="text"
                                    value={emailTo}
                                    onChange={(e) => setEmailTo(e.target.value)}
                                    placeholder="{{payload.email}}"
                                    className="w-full rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="Welcome to our platform"
                                    className="w-full rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Body
                                </label>
                                <textarea
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    placeholder="Hello {{payload.name}}!"
                                    rows={3}
                                    className="w-full rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-red-500/30 focus:border-red-500/20 transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Telegram Form */}
                {enabledTools.has("send_message") && (
                    <div className="rounded-xl border border-sky-500/15 bg-sky-500/[0.03] p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2">
                            <Send className="size-4 text-sky-400" />
                            <h3 className="text-sm font-semibold text-sky-400">
                                Telegram Configuration
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Bot Token
                                </label>
                                <input
                                    type="text"
                                    value={telegramBotToken}
                                    onChange={(e) => setTelegramBotToken(e.target.value)}
                                    placeholder="1234567890:ABCDEFghijklmnop..."
                                    className="w-full rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30 focus:border-sky-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Chat ID
                                </label>
                                <input
                                    type="text"
                                    value={telegramChatId}
                                    onChange={(e) => setTelegramChatId(e.target.value)}
                                    placeholder="5697467097"
                                    className="w-full rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30 focus:border-sky-500/20 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Message Text
                                </label>
                                <textarea
                                    value={telegramText}
                                    onChange={(e) => setTelegramText(e.target.value)}
                                    placeholder="Hello {{payload.name}} from the automation workflow!"
                                    rows={3}
                                    className="w-full rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-sky-500/30 focus:border-sky-500/20 transition-all resize-none"
                                />
                            </div>

                            {/* Test Connection */}
                            <TelegramTestButton
                                botToken={telegramBotToken}
                                chatId={telegramChatId}
                            />
                        </div>
                    </div>
                )}

                {/* Notion Form */}
                {enabledTools.has("add_row") && (
                    <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.03] p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-2">
                            <Database className="size-4 text-violet-400" />
                            <h3 className="text-sm font-semibold text-violet-400">
                                Notion Database Configuration
                            </h3>
                        </div>

                        <div className="flex items-start gap-2 rounded-lg bg-violet-500/5 p-3 border border-violet-500/10">
                            <InfoIcon className="size-3.5 text-violet-400/60 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-violet-300/60">
                                Select a database from your Notion workspace or enter the ID manually. Map columns to payload fields using <code className="rounded bg-violet-500/10 px-1 py-0.5 font-mono text-violet-400">{"{{payload.field}}"}</code> syntax.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {/* Database ID (manual input) */}
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                                    Database ID
                                </label>
                                <input
                                    type="text"
                                    value={notionDatabaseId}
                                    onChange={(e) => setNotionDatabaseId(e.target.value)}
                                    placeholder="3b264b71-a6f6-80f7-8a45-deb96c23573c"
                                    className="w-full rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-violet-500/30 focus:border-violet-500/20 transition-all"
                                />
                            </div>

                            {/* Database Picker */}
                            <NotionDatabasePicker
                                databaseId={notionDatabaseId}
                                onDatabaseSelect={(id) => setNotionDatabaseId(id)}
                                columns={notionColumns}
                                onColumnsChange={setNotionColumns}
                            />

                            {/* Manual Column Mapping (when not using picker) */}
                            {notionColumns.length === 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-muted-foreground">
                                            Column Mappings
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNotionColumns([
                                                    ...notionColumns,
                                                    { columnName: "", payloadField: "" },
                                                ])
                                            }
                                            className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-1 text-[11px] font-medium text-violet-400 hover:bg-violet-500/20 transition-colors"
                                        >
                                            <PlusIcon className="size-3" />
                                            Add Column
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Add more columns button when columns exist */}
                            {notionColumns.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNotionColumns([
                                            ...notionColumns,
                                            { columnName: "", payloadField: "" },
                                        ])
                                    }
                                    className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-2.5 py-1.5 text-[11px] font-medium text-violet-400 hover:bg-violet-500/20 transition-colors"
                                >
                                    <PlusIcon className="size-3" />
                                    Add Column
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Save Button ─── */}
            <div className="flex justify-end pt-2">
                <button
                    onClick={handleSave}
                    disabled={createWorkflow.isPending || saveSuccess}
                    className={`
                        inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold
                        transition-all duration-300 ease-out
                        ${saveSuccess
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105"
                            : "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    `}
                >
                    {createWorkflow.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : saveSuccess ? (
                        <CheckCircle2 className="size-4 animate-in zoom-in duration-300" />
                    ) : (
                        <SparklesIcon className="size-4" />
                    )}
                    {createWorkflow.isPending
                        ? "Saving..."
                        : saveSuccess
                            ? "Saved!"
                            : "Save Workflow"
                    }
                </button>
            </div>
        </div>
    );
}
