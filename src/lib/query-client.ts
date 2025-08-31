import { QueryClient } from "@tanstack/react-query";
import { defaultOptions } from "./config/query-options";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions,
  });
}
