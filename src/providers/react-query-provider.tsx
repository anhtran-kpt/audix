"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, err: any) =>
        err?.code === "VALIDATION" ? false : count < 2,
    },
    mutations: {
      onError: (err: any) => {
        const msg = err?.isAppError ? err.message : "Something went wrong";
        toast.error(msg);
      },
    },
  },
});

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
