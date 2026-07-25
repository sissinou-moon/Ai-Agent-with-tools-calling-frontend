"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { verify as verifyApi } from "../api/verify";
import { setAuthCookies } from "../actions";
import type { VerifyRequest } from "../types";
import { AxiosError } from "axios";

export function useVerify() {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (body: VerifyRequest) => verifyApi(body),
        onSuccess: async (data) => {
            await setAuthCookies(data.access_token, data.refresh_token);
            toast.success(data.message);
            router.push("/");
        },
        onError: (error: AxiosError<{ detail?: string }>) => {
            const message =
                error.response?.data?.detail ?? "Verification failed. Please try again.";
            toast.error(message);
        },
    });

    return mutation;
}
