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