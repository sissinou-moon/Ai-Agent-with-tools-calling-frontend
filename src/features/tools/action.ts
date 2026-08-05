"use server";

import { cookies } from "next/headers";
import { COOKIE_NAMES } from "../auth/constants";

export async function executeGmailAction(body: {
    gmailAccessToken: string;
    recipient: string;
    subject: string;
    body: string;
}) {
    const accessToken = (await cookies())
        .get(COOKIE_NAMES.ACCESS_TOKEN)
        ?.value;

    if (!accessToken) {
        throw new Error("User not authenticated.");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/connection/gmail/send`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: body.gmailAccessToken,
                to: body.recipient,
                subject: body.subject,
                body: body.body,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

export async function executeGmailGetEmailIdsAction(body: {
    gmailAccessToken: string;
    query: string;
    limit: number;
}) {
    const accessToken = (await cookies())
        .get(COOKIE_NAMES.ACCESS_TOKEN)
        ?.value;

    if (!accessToken) {
        throw new Error("User not authenticated.");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/connection/gmail/emails`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: body.gmailAccessToken,
                query: body.query,
                limit: body.limit,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}

export async function executeGmailGetEmailsAction(body: {
    gmailAccessToken: string;
    emailIds: string[];
}) {
    const accessToken = (await cookies())
        .get(COOKIE_NAMES.ACCESS_TOKEN)
        ?.value;

    if (!accessToken) {
        throw new Error("User not authenticated.");
    }

    const results = [];
    for (const messageId of body.emailIds) {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/connection/gmail/email/details`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        access_token: body.gmailAccessToken,
                        message_id: messageId,
                    }),
                }
            );

            if (!response.ok) {
                console.error(`Failed to fetch email details for ${messageId}:`, await response.text());
                continue;
            }

            results.push(await response.json());
        } catch (error) {
            console.error(`Error fetching email details for ${messageId}:`, error);
        }
    }

    return results;
}

export async function executeNotionNewDatabaseRow(body:
    {
        notionAccessToken: string;
        database_id: string;
        properties: Record<string, unknown>
        schema: Record<string, unknown>
    }
) {
    const accessToken = (await cookies())
        .get(COOKIE_NAMES.ACCESS_TOKEN)
        ?.value;

    if (!accessToken) {
        throw new Error("User not authenticated.");
    }

    console.log(body.schema)

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/connection/notion/add_row`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: body.notionAccessToken,
                database_id: body.database_id,
                properties: body.properties,
                schema: body.schema,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();

}

export async function executeNotionListDatabases(body:
    {
        notionAccessToken: string;
    }
) {
    const accessToken = (await cookies())
        .get(COOKIE_NAMES.ACCESS_TOKEN)
        ?.value;

    if (!accessToken) {
        throw new Error("User not authenticated.");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/connection/notion/databases`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: body.notionAccessToken,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();

}

export async function executeNotionDBSchema(
    body:
        {
            notionAccessToken: string;
            database_id: string;
        }
) {
    const accessToken = (await cookies())
        .get(COOKIE_NAMES.ACCESS_TOKEN)
        ?.value;

    if (!accessToken) {
        throw new Error("User not authenticated.");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/connection/notion/database/schema`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: body.notionAccessToken,
                database_id: body.database_id,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();

}

export async function executeBusinessEventsAction() {
    const accessToken = (await cookies())
        .get(COOKIE_NAMES.ACCESS_TOKEN)
        ?.value;

    if (!accessToken) {
        throw new Error("User not authenticated.");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/connection/events`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return response.json();
}