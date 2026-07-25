"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
    InputOTPSeparator,
} from "@/components/ui/input-otp";
import { BotIcon, Loader2, ShieldCheck, Mail } from "lucide-react";
import { useVerify } from "../hooks/use-verify";
import { OTP_LENGTH } from "../constants";

interface OtpFormProps {
    email: string;
}

export function OtpForm({ email }: OtpFormProps) {
    const [otp, setOtp] = useState("");
    const { mutate, isPending } = useVerify();

    const handleComplete = (value: string) => {
        mutate({ email, otp: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length === OTP_LENGTH) {
            mutate({ email, otp });
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            {/* Decorative background elements */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <Card className="relative w-full max-w-md shadow-2xl border-border/50 overflow-hidden">
                {/* Top gradient accent bar */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

                <CardHeader className="space-y-6 items-center text-center pt-10 pb-2">
                    {/* Animated icon container */}
                    <div className="relative">
                        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse" />
                        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                            <ShieldCheck className="size-8" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            Verify your email
                        </CardTitle>
                        <CardDescription className="text-base max-w-xs mx-auto">
                            We&apos;ve sent a {OTP_LENGTH}-digit verification code to
                        </CardDescription>
                        <div className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5 mx-auto w-fit">
                            <Mail className="size-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                                {email}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8 px-8 pt-6 pb-10">
                        {/* OTP Input */}
                        <div className="flex flex-col items-center gap-4">
                            <label className="text-sm font-medium text-muted-foreground">
                                Enter verification code
                            </label>
                            <InputOTP
                                maxLength={OTP_LENGTH}
                                value={otp}
                                onChange={setOtp}
                                onComplete={handleComplete}
                                disabled={isPending}
                                className="gap-2"
                            >
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot
                                        index={0}
                                        className="size-14 rounded-xl border-2 text-xl font-semibold transition-all duration-200 data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20 data-[active=true]:scale-105"
                                    />
                                    <InputOTPSlot
                                        index={1}
                                        className="size-14 rounded-xl border-2 text-xl font-semibold transition-all duration-200 data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20 data-[active=true]:scale-105"
                                    />
                                    <InputOTPSlot
                                        index={2}
                                        className="size-14 rounded-xl border-2 text-xl font-semibold transition-all duration-200 data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20 data-[active=true]:scale-105"
                                    />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot
                                        index={3}
                                        className="size-14 rounded-xl border-2 text-xl font-semibold transition-all duration-200 data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20 data-[active=true]:scale-105"
                                    />
                                    <InputOTPSlot
                                        index={4}
                                        className="size-14 rounded-xl border-2 text-xl font-semibold transition-all duration-200 data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20 data-[active=true]:scale-105"
                                    />
                                    <InputOTPSlot
                                        index={5}
                                        className="size-14 rounded-xl border-2 text-xl font-semibold transition-all duration-200 data-[active=true]:border-primary data-[active=true]:ring-4 data-[active=true]:ring-primary/20 data-[active=true]:scale-105"
                                    />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {/* Submit button */}
                        <Button
                            className="w-full h-12 text-base font-medium"
                            type="submit"
                            disabled={isPending || otp.length < OTP_LENGTH}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="mr-2 size-4" />
                                    Verify Email
                                </>
                            )}
                        </Button>

                        {/* Helper text */}
                        <p className="text-center text-sm text-muted-foreground">
                            Didn&apos;t receive the code?{" "}
                            <button
                                type="button"
                                className="font-medium text-primary hover:underline hover:underline-offset-4 transition-colors"
                            >
                                Resend
                            </button>
                        </p>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
