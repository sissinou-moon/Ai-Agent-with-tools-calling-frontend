"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchWorkflows,
    createWorkflow,
    fetchWorkflowRuns,
    triggerWorkflow,
    fetchNotionDatabases,
    fetchNotionDatabaseSchema,
} from "../actions";
import type {
    Workflow,
    WorkflowRun,
    CreateWorkflowPayload,
    TriggerWorkflowResponse,
    NotionDatabase,
    NotionDatabaseSchema,
} from "../types";

// ─── Fetch Workflows ───
export function useWorkflows() {
    return useQuery<Workflow[]>({
        queryKey: ["workflows"],
        queryFn: () => fetchWorkflows(),
    });
}

// ─── Create / Update Workflow ───
export function useCreateWorkflow() {
    const queryClient = useQueryClient();

    return useMutation<Workflow, Error, CreateWorkflowPayload>({
        mutationFn: (payload) => createWorkflow(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workflows"] });
        },
    });
}

// ─── Workflow Runs ───
export function useWorkflowRuns() {
    return useQuery<WorkflowRun[]>({
        queryKey: ["workflowRuns"],
        queryFn: () => fetchWorkflowRuns(),
    });
}

// ─── Trigger Workflow ───
export function useTriggerWorkflow() {
    const queryClient = useQueryClient();

    return useMutation<
        TriggerWorkflowResponse,
        Error,
        { token: string; data: Record<string, unknown> }
    >({
        mutationFn: ({ token, data }) => triggerWorkflow(token, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workflowRuns"] });
        },
    });
}

// ─── Notion Databases ───
export function useNotionDatabases() {
    return useMutation<NotionDatabase[], Error, void>({
        mutationFn: () => fetchNotionDatabases(),
    });
}

// ─── Notion Database Schema ───
export function useNotionDatabaseSchema() {
    return useMutation<NotionDatabaseSchema, Error, string>({
        mutationFn: (databaseId) => fetchNotionDatabaseSchema(databaseId),
    });
}
