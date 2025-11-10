import { PaginationParams } from "@/features/shared/shared-types";
import { stableKey } from "@/utils/stable-keys";

export const albumKeys = {
  base: ["albums"] as const,
  list: (params?: Partial<PaginationParams>) =>
    [...albumKeys.base, "list", stableKey(params)] as const,
  detail: (albumId: string) => [...albumKeys.base, albumId] as const,
} as const;
