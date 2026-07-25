"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // The backend might pass error=something or success=true
        const error = searchParams.get("error");
        
        if (error) {
            toast.error(`Connection failed: ${error}`);
        } else {
            toast.success("Connection successful!");
        }

        // Redirect back to connections page after a brief delay
        const timer = setTimeout(() => {
            router.push("/connections");
        }, 1500);

        return () => clearTimeout(timer);
    }, [router, searchParams]);

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
