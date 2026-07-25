import axios from "axios";
import {
    SendMessageRequest,
    SendMessageResponse,
} from "../types";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export async function sendMessage(
    body: SendMessageRequest
): Promise<SendMessageResponse> {
    const { data } = await api.post<SendMessageResponse>(
        "/api/v1/message/test78392",
        body
    );

    return data;
}