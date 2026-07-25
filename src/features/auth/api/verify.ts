import axios from "axios";
import type { VerifyRequest, VerifyResponse } from "../types";
import { AUTH_ENDPOINTS } from "../constants";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export async function verify(
    body: VerifyRequest
): Promise<VerifyResponse> {
    const { data } = await api.post<VerifyResponse>(
        AUTH_ENDPOINTS.VERIFY,
        body
    );

    return data;
}
