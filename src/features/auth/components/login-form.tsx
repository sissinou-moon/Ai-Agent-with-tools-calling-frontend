"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BotIcon, Loader2 } from "lucide-react";
import { useLogin } from "../hooks/use-login";
import { getRefreshToken } from "../actions";

export function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [refreshToken, setRefreshToken] = useState("");

    const { mutate, isPending } = useLogin();

    useEffect(() => {
        getRefreshToken().then((token) => {
            if (token) setRefreshToken(token);
        });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate({ email, password, refresh_token: refreshToken });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-2xl border-border/50">
                <CardHeader className="space-y-4 items-center text-center pt-8">
                    <div className="flex size-14 items-center justify-center rounded-[var(--radius)] bg-primary text-primary-foreground shadow-sm">
                        <BotIcon className="size-7" />
                    </div>
                    <div className="space-y-1.5">
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-base">
                            Enter your credentials to access your account
                        </CardDescription>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 px-8 pt-4">
                        <div className="space-y-2.5">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="h-12"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="#"
                                    className="text-sm font-medium text-primary hover:underline hover:underline-offset-4"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                className="h-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                        <Button
                            className="w-full h-12 text-base font-medium mt-2"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </CardContent>
                </form>
                <CardFooter className="flex justify-center pb-8">
                    <div className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:underline hover:underline-offset-4 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
