import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";
import { AppError } from "./errors";

export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (error instanceof AppError) {
          console.error(
            "[Query Error]",
            query.queryKey,
            error.code,
            error.message
          );
        } else {
          console.error("[Query Unexpected Error]", query.queryKey, error);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        if (error instanceof AppError) {
          console.error(
            "[Mutation Error]",
            mutation.options.mutationKey,
            error.code,
            error.message,
            { variables, context }
          );
        } else {
          console.error(
            "[Mutation Unexpected Error]",
            mutation.options.mutationKey,
            error,
            { variables, context }
          );
        }
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: "always",
        refetchOnMount: false,
        retry: (failureCount, error) => {
          if (error instanceof AppError) {
            if (["VALIDATION", "FORBIDDEN"].includes(error.code)) {
              return false;
            }
          }
          return failureCount < 3;
        },
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
