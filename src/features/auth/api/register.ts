import axios from "axios";
import type { RegisterRequest, RegisterResponse } from "../types";
import { AUTH_ENDPOINTS } from "../constants";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export async function register(
    body: RegisterRequest
): Promise<RegisterResponse> {
    const { data } = await api.post<RegisterResponse>(
        AUTH_ENDPOINTS.REGISTER,
        body
    );

    return data;
}
