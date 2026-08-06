"use client";

import { useState } from "react";
import {
    useNotionDatabases,
    useNotionDatabaseSchema,
} from "../hooks/use-workflows";
import type {
    NotionDatabase,
    NotionDatabaseSchema,
    NotionColumnMapping,
} from "../types";
import {
    Loader2,
    Database,
    ChevronRight,
    CheckCircle2,
    ArrowLeft,
    TableIcon,
    XIcon,
} from "lucide-react";

interface NotionDatabasePickerProps {
    databaseId: string;
    onDatabaseSelect: (id: string, title: string) => void;
    columns: NotionColumnMapping[];
    onColumnsChange: (columns: NotionColumnMapping[]) => void;
}

export function NotionDatabasePicker({
    databaseId,
    onDatabaseSelect,
    columns,
    onColumnsChange,
}: NotionDatabasePickerProps) {
    const [databases, setDatabases] = useState<NotionDatabase[]>([]);
    const [schema, setSchema] = useState<NotionDatabaseSchema | null>(null);
    const [selectedDbTitle, setSelectedDbTitle] = useState("");
    const [view, setView] = useState<"idle" | "list" | "schema">("idle");

    const fetchDatabases = useNotionDatabases();
    const fetchSchema = useNotionDatabaseSchema();

    const handleFetchDatabases = () => {
        fetchDatabases.mutate(undefined, {
            onSuccess: (data) => {
                setDatabases(data);
                setView("list");
            },
        });
    };

    const handleSelectDatabase = (db: NotionDatabase) => {
        onDatabaseSelect(db.id, db.title);
        setSelectedDbTitle(db.title);

        fetchSchema.mutate(db.id, {
            onSuccess: (schemaData) => {
                setSchema(schemaData);
                setView("schema");

                // Auto-populate columns from schema (exclude title type as it's special)
                const autoColumns: NotionColumnMapping[] = Object.values(schemaData)
                    .map((prop) => ({
                        columnName: prop.name,
                        payloadField: "",
                    }));

                onColumnsChange(autoColumns);
            },
        });
    };

    const handleBack = () => {
        setView("list");
        setSchema(null);
    };

    const handleColumnPayloadChange = (index: number, value: string) => {
        const updated = [...columns];
        updated[index] = { ...updated[index], payloadField: value };
        onColumnsChange(updated);
    };

    const handleRemoveColumn = (index: number) => {
        onColumnsChange(columns.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            {/* Fetch Databases Button */}
            {view === "idle" && (
                <button
                    type="button"
                    onClick={handleFetchDatabases}
                    disabled={fetchDatabases.isPending}
                    className="inline-flex items-center gap-2 rounded-lg bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-400 border border-violet-500/20 transition-all hover:bg-violet-500/20 hover:border-violet-500/30 disabled:opacity-50 disabled:cursor-wait"
                >
                    {fetchDatabases.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Database className="size-4" />
                    )}
                    {fetchDatabases.isPending
                        ? "Fetching databases..."
                        : "Get My Databases"
                    }
                </button>
            )}

            {fetchDatabases.isError && view === "idle" && (
                <p className="text-xs text-red-400 animate-in fade-in duration-200">
                    {fetchDatabases.error.message}
                </p>
            )}

            {/* Database List */}
            {view === "list" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Select a database
                        </h4>
                        <button
                            type="button"
                            onClick={() => setView("idle")}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Close
                        </button>
                    </div>

                    <div className="rounded-xl border border-border/50 bg-background/50 overflow-hidden divide-y divide-border/30">
                        {databases.map((db, index) => (
                            <button
                                type="button"
                                key={db.id}
                                onClick={() => handleSelectDatabase(db)}
                                disabled={fetchSchema.isPending}
                                className={`
                                    w-full flex items-center justify-between px-4 py-3 text-left
                                    transition-all duration-200 hover:bg-accent/50 group
                                    disabled:opacity-50 disabled:cursor-wait
                                    ${databaseId === db.id ? "bg-violet-500/5 border-l-2 border-l-violet-500" : ""}
                                `}
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        flex size-8 items-center justify-center rounded-lg
                                        ${databaseId === db.id
                                            ? "bg-violet-500/15 text-violet-400"
                                            : "bg-muted/50 text-muted-foreground group-hover:bg-violet-500/10 group-hover:text-violet-400"
                                        }
                                        transition-colors
                                    `}>
                                        <TableIcon className="size-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{db.title}</p>
                                        <p className="text-[11px] text-muted-foreground/60 font-mono">
                                            {db.id.slice(0, 8)}...
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {databaseId === db.id && (
                                        <CheckCircle2 className="size-4 text-violet-400" />
                                    )}
                                    {fetchSchema.isPending && databaseId === db.id ? (
                                        <Loader2 className="size-4 animate-spin text-violet-400" />
                                    ) : (
                                        <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                                    )}
                                </div>
                            </button>
                        ))}

                        {databases.length === 0 && (
                            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                                No databases found in your Notion workspace.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Schema / Column Mapping */}
            {view === "schema" && schema && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="flex size-6 items-center justify-center rounded bg-violet-500/15">
                                <TableIcon className="size-3.5 text-violet-400" />
                            </div>
                            <h4 className="text-sm font-medium">{selectedDbTitle}</h4>
                        </div>
                        <span className="text-[11px] text-muted-foreground/60 font-mono ml-auto">
                            {databaseId.slice(0, 8)}...
                        </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Map each column to a payload field using <code className="rounded bg-muted px-1 py-0.5 text-[11px] font-mono text-violet-400">{"{{payload.field}}"}</code> syntax.
                    </p>

                    <div className="space-y-2">
                        {columns.map((col, index) => {
                            const schemaProp = schema[col.columnName];
                            return (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200"
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >
                                    {/* Column name (read-only from schema) */}
                                    <div className="flex-1 flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                                        <span className="text-sm font-medium truncate">{col.columnName}</span>
                                        {schemaProp && (
                                            <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground shrink-0">
                                                {schemaProp.type}
                                            </span>
                                        )}
                                    </div>

                                    <ChevronRight className="size-4 text-muted-foreground/40 shrink-0" />

                                    {/* Payload field input */}
                                    <input
                                        type="text"
                                        value={col.payloadField}
                                        onChange={(e) =>
                                            handleColumnPayloadChange(index, e.target.value)
                                        }
                                        placeholder="{{payload.field_name}}"
                                        className="flex-1 rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveColumn(index)}
                                        className="rounded-md p-1.5 text-muted-foreground/40 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                                    >
                                        <XIcon className="size-3.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
