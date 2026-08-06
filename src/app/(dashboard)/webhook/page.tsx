"use client";

import { useEffect, useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CopyIcon, WebhookIcon } from "lucide-react";
import { fetchWebhookEvents, fetchWebhookToken } from "@/features/webhook/actions";
import type { WebhookEvent } from "@/features/webhook/types";
import { toast } from "sonner";

export default function WebhookPage() {
    const [events, setEvents] = useState<WebhookEvent[]>([]);
    const [token, setToken] = useState<string>("");
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const webhookUrl = token ? `${API_URL}/api/v1/webhook/events/save/${token}` : "";

    useEffect(() => {
        const loadData = async () => {
            try {
                const [eventsRes, tokenRes] = await Promise.all([
                    fetchWebhookEvents(),
                    fetchWebhookToken(),
                ]);
                
                if (eventsRes.success && eventsRes.data) {
                    setEvents(eventsRes.data);
                }
                
                if (tokenRes.success && tokenRes.token) {
                    setToken(tokenRes.token);
                }
            } catch (err) {
                console.error("Failed to load webhook data", err);
                toast.error("Failed to load webhook data");
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, []);

    const copyUrl = () => {
        if (!webhookUrl) return;
        navigator.clipboard.writeText(webhookUrl);
        toast.success("Webhook URL copied to clipboard");
    };

    return (
        <div className="flex h-full flex-col">
            <header className="flex h-14 shrink-0 items-center border-b border-border/40 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <h1 className="text-sm font-semibold">Webhooks</h1>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="mx-auto max-w-4xl space-y-4">
                    
                    {/* Webhook Configuration */}
                    <div className="rounded-xl border border-border/40 bg-card/50 p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <WebhookIcon className="size-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-medium">Your Webhook URL</h2>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Send POST requests to this URL to trigger events in your workspace.
                        </p>
                        
                        <div className="flex items-center gap-2 mt-4">
                            <code className="flex-1 rounded-md bg-muted px-4 py-3 text-sm border font-mono break-all text-muted-foreground">
                                {loading ? "Loading..." : webhookUrl}
                            </code>
                            <button 
                                onClick={copyUrl}
                                disabled={!webhookUrl}
                                className="shrink-0 p-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                <CopyIcon className="size-4" />
                            </button>
                        </div>
                        
                        <div className="mt-4 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md border">
                            <strong>Expected Payload format:</strong>
                            <pre className="mt-2 text-[11px] font-mono whitespace-pre-wrap">
{`{
    "type": "order.created",
    "data": {
        "orderId": "123",
        "amount": 99.99
    }
}`}
                            </pre>
                        </div>
                    </div>

                    {/* Events List */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-medium">Recent Events</h2>
                        
                        {loading ? (
                            <div className="text-sm text-muted-foreground text-center py-8">Loading events...</div>
                        ) : events.length === 0 ? (
                            <div className="rounded-xl border border-border/40 border-dashed bg-card/20 p-8 text-center text-sm text-muted-foreground">
                                No events received yet. Send a request to your webhook URL to see them here.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {events.map((event) => (
                                    <div key={event.id} className="rounded-xl border border-border/40 bg-card/30 p-4 hover:bg-card/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-mono text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-md">
                                                {event.type}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(event.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <pre className="text-xs bg-muted/30 p-3 rounded-md overflow-x-auto text-muted-foreground font-mono mt-2">
                                            {JSON.stringify(event.data, null, 2)}
                                        </pre>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
