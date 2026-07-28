"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";
import { saveConnection } from "@/features/connections/actions";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasCalledRef = useRef(false);

    const service = searchParams.get("service");
    const payload = searchParams.get("payload");

    useEffect(() => {
        if (hasCalledRef.current) return;
        hasCalledRef.current = true;

        let timerId: NodeJS.Timeout | null = null;
        const error = searchParams.get("error");

        if (error) {
            toast.error(`Connection failed: ${error}`);
            timerId = setTimeout(() => {
                router.push("/connections");
            }, 1500);
        } else if (service && payload) {
            const save = async () => {
                try {
                    await saveConnection({
                        user_id: "none",
                        app: service,
                        access_token: JSON.parse(payload).access_token,
                        data: JSON.parse(payload),
                    });
                    toast.success("Connection successful!");
                } catch (err: any) {
                    console.error("Failed to save connection:", err);
                    toast.error(err.message || "Failed to save connection.");
                } finally {
                    timerId = setTimeout(() => {
                        router.push("/connections");
                    }, 1500);
                }
            };
            save();
        } else {
            router.push("/connections");
        }

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [router, searchParams, service, payload]);


    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="relative flex items-center justify-center size-16 rounded-full bg-primary/10">
                <Loader2 className="size-8 text-primary animate-spin" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Finishing up...</h2>
            <p className="text-muted-foreground">Please wait while we finalize your connection.</p>
        </div>
    );
}

export default function ConnectionsCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-[50vh] items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-muted-foreground" />
                </div>
            }
        >
            <CallbackContent />
        </Suspense>
    );
}
