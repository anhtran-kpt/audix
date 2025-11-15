import { PaginationParams } from "@/features/shared/shared-types";
import { stableKey } from "@/utils/stable-keys";

export const userKeys = {
  base: ["users"] as const,
  detail: (targetUserId: string) => [...userKeys.base, targetUserId] as const,
  overview: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "overview"] as const,
  playlists: (targetUserId: string, params?: Partial<PaginationParams>) =>
    [...userKeys.detail(targetUserId), "playlists", stableKey(params)] as const,
  followingArtists: (
    targetUserId: string,
    params?: Partial<PaginationParams>
  ) =>
    [
      ...userKeys.detail(targetUserId),
      "following",
      "artists",
      stableKey(params),
    ] as const,
} as const;
