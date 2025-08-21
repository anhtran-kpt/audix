import { QueryClient } from "@tanstack/react-query";
import { defaultOptions } from "./defaults";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions,
  });
}
