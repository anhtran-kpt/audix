"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getBrowserQueryClient } from "@/lib/browser-query-client";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getBrowserQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
