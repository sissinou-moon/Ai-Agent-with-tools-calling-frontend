// ─── Tool Names ───
export type ToolName = "send_email" | "send_message" | "add_row";

// ─── Tool Arguments ───
export interface EmailArgs {
    to: string;
    subject: string;
    body: string;
}

export interface TelegramArgs {
    text: string;
    chat_id: string;
    bot_token: string;
    parse_mode: string;
}

export interface NotionArgs {
    database_id: string;
    [columnName: string]: string; // dynamic columns mapped to {{payload.xxx}}
}

// ─── Workflow Step ───
export interface WorkflowStep {
    tool_name: ToolName;
    tool_arguments: EmailArgs | TelegramArgs | NotionArgs;
}

// ─── Create Workflow Payload (POST body) ───
export interface CreateWorkflowPayload {
    name: string;
    steps: WorkflowStep[];
}

// ─── Workflow (GET response) ───
export interface Workflow {
    id: string;
    name: string;
    webhook_token: string;
    is_active: boolean;
    user_id: string;
    created_at: string;
    updated_at: string;
}

// ─── Trigger Workflow ───
export interface TriggerWorkflowResponse {
    success: boolean;
    run_id: string;
}

// ─── Workflow Run ───
export interface WorkflowRun {
    id: string;
    workflow_id: string;
    status: "success" | "failed" | "running" | "pending";
    error: string;
    trigger_payload: Record<string, unknown>;
    started_at: string;
    finished_at: string;
}

// ─── Notion Database ───
export interface NotionDatabase {
    title: string;
    id: string;
}

// ─── Notion Database Schema Property ───
export interface NotionSchemaProperty {
    id: string;
    name: string;
    description: string | null;
    type: string;
    [key: string]: unknown; // type-specific config (number, date, status, etc.)
}

export type NotionDatabaseSchema = Record<string, NotionSchemaProperty>;

// ─── Column Mapping (for builder UI state) ───
export interface NotionColumnMapping {
    columnName: string;
    payloadField: string;
}
