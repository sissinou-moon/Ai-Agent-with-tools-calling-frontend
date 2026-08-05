import { executeGmail, executeGmailGetEmailIds, executeGmailGetEmails } from "./gmail";
import { executeNotion, executeNotionDatabases, executeNotionDatabaseSchema } from "./notion";
import { executeBusinessEvents } from "./events";

export const toolRegistry = {
    gmail_send_email: {
        app: "gmail",
        execute: executeGmail,
        usePreviousToolResult: true,
    },
    gmail_get_email_ids: {
        app: "gmail",
        execute: executeGmailGetEmailIds,
        usePreviousToolResult: false,
    },
    gmail_get_emails: {
        app: "gmail",
        execute: executeGmailGetEmails,
        usePreviousToolResult: false,
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
    get_business_events: {
        app: "core",
        execute: executeBusinessEvents,
        usePreviousToolResult: false,
    }
};