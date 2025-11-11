"use client";

import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | null = null;

export function getBrowserQueryClient() {
  if (!browserQueryClient) {
    browserQueryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
          gcTime: 5 * 60_000,
          refetchOnWindowFocus: false,
          refetchOnReconnect: "always",
          retry: 1,
        },
        mutations: { retry: 0 },
      },
    });
  }

  return browserQueryClient;
}
