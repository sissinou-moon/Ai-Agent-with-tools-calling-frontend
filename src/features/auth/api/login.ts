import axios from "axios";
import type { LoginRequest, LoginResponse } from "../types";
import { AUTH_ENDPOINTS } from "../constants";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export async function login(
    body: LoginRequest
): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        body
    );

    return data;
}
