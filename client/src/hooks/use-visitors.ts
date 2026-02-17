import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type VisitorInput } from "@shared/routes";
import { z } from "zod";

// Fetch list of visitors
export function useVisitors(search?: string) {
  return useQuery({
    queryKey: [api.visitors.list.path, search],
    queryFn: async () => {
      const url = search 
        ? `${api.visitors.list.path}?search=${encodeURIComponent(search)}` 
        : api.visitors.list.path;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch visitors");
      return api.visitors.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch stats
export function useVisitorStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.stats.get.responses[200].parse(await res.json());
    },
    refetchInterval: 5000, // Live updates every 5s
  });
}

// Create new visitor
export function useCreateVisitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: VisitorInput) => {
      const res = await fetch(api.visitors.create.path, {
        method: api.visitors.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to create visitor");
      }
      return api.visitors.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.visitors.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}

// Update visitor
export function useUpdateVisitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<VisitorInput>) => {
      const url = buildUrl(api.visitors.update.path, { id });
      const res = await fetch(url, {
        method: api.visitors.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update visitor");
      return api.visitors.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.visitors.list.path] });
    },
  });
}

// Mark visitor exit
export function useVisitorExit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.visitors.exit.path, { id });
      const res = await fetch(url, { method: api.visitors.exit.method });
      
      if (!res.ok) throw new Error("Failed to process exit");
      return api.visitors.exit.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.visitors.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}

// Delete visitor
export function useDeleteVisitor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.visitors.delete.path, { id });
      const res = await fetch(url, { method: api.visitors.delete.method });
      
      if (!res.ok) throw new Error("Failed to delete visitor");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.visitors.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
    },
  });
}
