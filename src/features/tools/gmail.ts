import type { ToolExecution } from "@/features/conversation/types";
import type { ConnectionStatus } from "@/features/connections/types";
import { executeGmailAction, executeGmailGetEmailIdsAction, executeGmailGetEmailsAction } from "./action";

interface ExecuteGmailParams {
    connection: ConnectionStatus;
    tool: ToolExecution;
    previousToolResult?: unknown;
}

export async function executeGmail({
    connection,
    tool,
    previousToolResult,
}: ExecuteGmailParams) {
    const args = tool.arguments as {
        recipient: string;
        subject: string;
        body: string;
    };

    return executeGmailAction({
        gmailAccessToken: connection.access_token!,
        recipient: args.recipient!,
        subject: args.subject!,
        body: args.body!,
    });
}

export async function executeGmailGetEmailIds({
    connection,
    tool,
    previousToolResult,
}: ExecuteGmailParams) {
    const args = tool.arguments as {
        query?: string;
        limit: number;
    };

    return executeGmailGetEmailIdsAction({
        gmailAccessToken: connection.access_token!,
        query: args.query || "",
        limit: args.limit,
    });
}

export async function executeGmailGetEmails({
    connection,
    tool,
    previousToolResult,
}: ExecuteGmailParams) {
    const args = tool.arguments as {
        email_ids: string[];
    };

    return executeGmailGetEmailsAction({
        gmailAccessToken: connection.access_token!,
        emailIds: args.email_ids,
    });
}