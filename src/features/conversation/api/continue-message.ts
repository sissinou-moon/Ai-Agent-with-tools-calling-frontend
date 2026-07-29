import axios from "axios";
import {
    ContinueMessageRequest,
    SendMessageResponse,
} from "../types";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

export async function continueMessage(
    conversationId: string,
    body: ContinueMessageRequest
): Promise<SendMessageResponse> {
    const { data } = await api.post<SendMessageResponse>(
        `/api/v1/message/${conversationId}/continue`,
        body
    );

    return data;
}