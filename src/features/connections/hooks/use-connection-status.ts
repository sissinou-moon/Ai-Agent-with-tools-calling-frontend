"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchConnectionStatus } from "../actions";
import type { ConnectionStatus } from "../types";

export function useConnectionStatus() {
    return useQuery<ConnectionStatus[]>({
        queryKey: ["connectionStatus"],
        queryFn: async () => {
            return await fetchConnectionStatus();
        },
    });
}
