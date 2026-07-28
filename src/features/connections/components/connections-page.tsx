"use client";

import { useConnectionStatus } from "../hooks/use-connection-status";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export function ConnectionsPage() {
    const { data: connections, isLoading } = useConnectionStatus();

    const gmailConnection = connections?.find((c) => c.app === "gmail");
    const isGmailConnected = !!gmailConnection;

    const handleConnectGmail = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/connection/gmail/oauth`;
    };

    const notionConnection = connections?.find((c) => c.app === "notion");
    const isNotionConnected = !!notionConnection;

    const handleConnectNotion = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/connection/notion/oauth`;
    };

    return (
        <div className="flex-1 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
                    <p className="text-muted-foreground">
                        Connect your favorite tools to unlock automation and workflows.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                {/* Simple Gmail Icon (using standard SVG or Lucide mail) */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="size-6 text-red-500"
                                    fill="currentColor"
                                >
                                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                                </svg>
                                Gmail
                            </CardTitle>
                            {isLoading ? (
                                <Loader2 className="size-5 animate-spin text-muted-foreground" />
                            ) : isGmailConnected ? (
                                <span className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="mr-1 size-4" /> Connected
                                </span>
                            ) : null}
                        </div>
                        <CardDescription className="pt-2">
                            Read, send, and organize your emails automatically with AI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {isGmailConnected && gmailConnection?.user_id && (
                            <div className="text-sm text-muted-foreground">
                                Connected as <span className="font-medium text-foreground">{gmailConnection.user_id}</span>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        {isLoading ? (
                            <Button disabled className="w-full">
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Loading...
                            </Button>
                        ) : isGmailConnected ? (
                            <Button variant="outline" className="w-full" disabled>
                                Configuration Active
                            </Button>
                        ) : (
                            <Button onClick={handleConnectGmail} className="w-full">
                                <LinkIcon className="mr-2 size-4" />
                                Connect Gmail
                            </Button>
                        )}
                    </CardFooter>
                </Card>
                
                <Card className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="size-6 text-foreground"
                                    fill="currentColor"
                                >
                                    <path d="M4.459 4.208c.746-.575 1.761-.92 3.14-.92h11.455c.787 0 1.258.487 1.258 1.15v14.47c0 .64-.325 1.13-1.026 1.13H7.832c-1.35 0-2.39-.364-3.11-.92-1.077-.828-1.554-2.146-1.554-4.57V8.583c0-2.22.42-3.488 1.29-4.375zm12.378 12.062v-9.45c0-.62-.43-1.06-1.05-1.06h-5.23c-.61 0-1.04.44-1.04 1.06v9.45c0 .63.43 1.06 1.04 1.06h5.23c.62 0 1.05-.43 1.05-1.06zm-7.9 0v-9.45c0-.62-.43-1.06-1.05-1.06H6.62c-.61 0-1.04.44-1.04 1.06v9.45c0 .63.43 1.06 1.04 1.06h1.267c.62 0 1.05-.43 1.05-1.06z" />
                                </svg>
                                Notion
                            </CardTitle>
                            {isLoading ? (
                                <Loader2 className="size-5 animate-spin text-muted-foreground" />
                            ) : isNotionConnected ? (
                                <span className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="mr-1 size-4" /> Connected
                                </span>
                            ) : null}
                        </div>
                        <CardDescription className="pt-2">
                            Connect your Notion workspace to manage pages and databases.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {isNotionConnected && notionConnection?.user_id && (
                            <div className="text-sm text-muted-foreground">
                                Connected as <span className="font-medium text-foreground">{notionConnection.user_id}</span>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        {isLoading ? (
                            <Button disabled className="w-full">
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Loading...
                            </Button>
                        ) : isNotionConnected ? (
                            <Button variant="outline" className="w-full" disabled>
                                Configuration Active
                            </Button>
                        ) : (
                            <Button onClick={handleConnectNotion} className="w-full">
                                <LinkIcon className="mr-2 size-4" />
                                Connect Notion
                            </Button>
                        )}
                    </CardFooter>
                </Card>
                
                {/* Add more integrations here in the future */}
            </div>
        </div>
    );
}
