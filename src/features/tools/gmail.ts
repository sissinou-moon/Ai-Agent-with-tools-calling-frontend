import type { ToolExecution } from "@/features/conversation/types";
import type { ConnectionStatus } from "@/features/connections/types";
import { executeGmailAction } from "./action";

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