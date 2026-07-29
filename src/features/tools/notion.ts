import type { ToolExecution } from "@/features/conversation/types";
import type { ConnectionStatus } from "@/features/connections/types";
import { executeNotionNewDatabaseRow, executeNotionListDatabases, executeNotionDBSchema } from "./action";

interface ExecuteNotionParams {
    connection: ConnectionStatus;
    tool: ToolExecution;
    previousToolResult?: Map<string, unknown>;
}

export async function executeNotion({
    connection,
    tool,
    previousToolResult,
}: ExecuteNotionParams) {
    const args = tool.arguments as {
        database_id: string;
        properties: Record<string, unknown>;
    };

    const schema = previousToolResult?.get(
        "notion_get_database_schema"
    ) as Record<string, unknown>;

    return executeNotionNewDatabaseRow({
        notionAccessToken: connection.access_token!,
        database_id: args.database_id!,
        properties: args.properties!,
        schema: schema,
    });
}

export async function executeNotionDatabases({
    connection,
}: ExecuteNotionParams) {
    return executeNotionListDatabases({
        notionAccessToken: connection.access_token!,
    });
}

export async function executeNotionDatabaseSchema({
    connection,
    tool,
}: ExecuteNotionParams) {
    const args = tool.arguments as {
        database_id: string;
    };

    return executeNotionDBSchema({
        notionAccessToken: connection.access_token!,
        database_id: args.database_id,
    });
}