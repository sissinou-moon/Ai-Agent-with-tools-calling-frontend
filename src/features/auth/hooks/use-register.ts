"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register as registerApi } from "../api/register";
import type { RegisterRequest } from "../types";
import { AxiosError } from "axios";

export function useRegister() {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: (body: RegisterRequest) => registerApi(body),
        onSuccess: (data, variables) => {
            toast.success(data.message);
            router.push(`/verify?email=${encodeURIComponent(variables.email)}`);
        },
        onError: (error: AxiosError<{ detail?: string }>) => {
            const message =
                error.response?.data?.detail ?? "Registration failed. Please try again.";
            toast.error(message);
        },
    });

    return mutation;
}
