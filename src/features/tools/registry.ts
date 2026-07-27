import { executeGmail } from "./gmail";

export const toolRegistry = {
    gmail_send_email: {
        app: "gmail",
        execute: executeGmail,
    },
};