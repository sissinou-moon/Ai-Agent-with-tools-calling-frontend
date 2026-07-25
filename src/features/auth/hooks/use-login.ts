"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { login as loginApi } from "../api/login";
import { setAuthCookies } from "../actions";
import type { LoginRequest } from "../types";
import { AxiosError } from "axios";

export function useLogin() {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (body: LoginRequest) => loginApi(body),
        onSuccess: async (data) => {
            await setAuthCookies(data.access_token, data.refresh_token);
            toast.success(data.message);
            router.push("/");
        },
        onError: (error: AxiosError<{ detail?: string }>, variables: LoginRequest) => {
            const detail = error.response?.data?.detail;
            if (error.response?.status === 401 && detail === "Refresh Token Invalid") {
                toast.error("Verification required. Redirecting to verify page...");
                router.push(`/verify?email=${encodeURIComponent(variables.email)}`);
                return;
            }
            const message = detail ?? "Login failed. Please try again.";
            toast.error(message);
        },

    });

    return mutation;
}
