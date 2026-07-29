import { executeGmail } from "./gmail";
import { executeNotion, executeNotionDatabases, executeNotionDatabaseSchema } from "./notion";

export const toolRegistry = {
    gmail_send_email: {
        app: "gmail",
        execute: executeGmail,
        usePreviousToolResult: true,
    },
    notion_add_row_database: {
        app: "notion",
        execute: executeNotion,
        usePreviousToolResult: true,
    },
    notion_list_databases: {
        app: "notion",
        execute: executeNotionDatabases,
        usePreviousToolResult: false,
    },
    notion_get_database_schema: {
        app: "notion",
        execute: executeNotionDatabaseSchema,
        usePreviousToolResult: false,
    },
};