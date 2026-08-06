"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, Wifi } from "lucide-react";

interface TelegramTestButtonProps {
    botToken: string;
    chatId: string;
}

type TestState = "idle" | "testing" | "success" | "error";

export function TelegramTestButton({ botToken, chatId }: TelegramTestButtonProps) {
    const [state, setState] = useState<TestState>("idle");
    const [botName, setBotName] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleTest = async () => {
        if (!botToken.trim() || !chatId.trim()) {
            setState("error");
            setErrorMsg("Bot token and Chat ID are required");
            setTimeout(() => setState("idle"), 3000);
            return;
        }

        setState("testing");
        setBotName("");
        setErrorMsg("");

        try {
            const response = await fetch(
                `https://api.telegram.org/bot${botToken}/getMe`
            );
            const data = await response.json();

            if (data.ok) {
                setBotName(data.result.first_name || data.result.username);
                setState("success");
                setTimeout(() => setState("idle"), 5000);
            } else {
                setErrorMsg(data.description || "Invalid bot token");
                setState("error");
                setTimeout(() => setState("idle"), 5000);
            }
        } catch {
            setErrorMsg("Network error — could not reach Telegram");
            setState("error");
            setTimeout(() => setState("idle"), 5000);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={handleTest}
                disabled={state === "testing"}
                className={`
                    inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium
                    transition-all duration-300 ease-out
                    ${state === "testing"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 cursor-wait"
                        : state === "success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : state === "error"
                                ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-[shake_0.5s_ease-in-out]"
                                : "bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/30"
                    }
                `}
            >
                {state === "testing" && (
                    <Loader2 className="size-4 animate-spin" />
                )}
                {state === "success" && (
                    <CheckCircle2 className="size-4 animate-in zoom-in duration-300" />
                )}
                {state === "error" && (
                    <XCircle className="size-4" />
                )}
                {state === "idle" && (
                    <Wifi className="size-4" />
                )}
                {state === "testing"
                    ? "Testing Connection..."
                    : state === "success"
                        ? `Connected — ${botName}`
                        : state === "error"
                            ? "Test Failed"
                            : "Test Connection"
                }
            </button>

            {state === "error" && errorMsg && (
                <p className="text-xs text-red-400/80 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errorMsg}
                </p>
            )}
        </div>
    );
}
