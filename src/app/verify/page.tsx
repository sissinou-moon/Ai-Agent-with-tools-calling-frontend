"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { OtpForm } from "@/features/auth/components/otp-form";

function VerifyContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    if (!email) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <p className="text-muted-foreground">
                    No email provided. Please register first.
                </p>
            </div>
        );
    }

    return <OtpForm email={email} />;
}

export default function VerifyPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-background">
                    <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
            }
        >
            <VerifyContent />
        </Suspense>
    );
}
