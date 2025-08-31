import type { DefaultOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

const retry = (failureCount: number, error: unknown) => {
  const status = (error as AxiosError)?.response?.status;
  if (!status) return failureCount < 2;
  if ([400, 401, 403, 404].includes(status)) return false;
  if (status === 429) return failureCount < 3;
  return failureCount < 2;
};

export const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: "always",
    refetchOnMount: false,
    retry,
  },
  mutations: {
    retry: 0,
  },
};
