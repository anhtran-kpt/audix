import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { stableKey } from "@/utils/stable-keys";

export const userKeys = {
  base: ["users"] as const,
  detail: (targetUserId: string) => [...userKeys.base, targetUserId] as const,
  banner: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "banner"] as const,
  playlists: (targetUserId: string, params?: Partial<PaginationParams>) =>
    [...userKeys.detail(targetUserId), "playlists", stableKey(params)] as const,
  follow: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "follow"] as const,
  followStatus: (targetUserId: string) =>
    [...userKeys.detail(targetUserId), "follow"] as const,
  followers: (targetUserId: string, params?: Partial<PaginationParams>) =>
    [...userKeys.detail(targetUserId), "followers", stableKey(params)] as const,
  followingUsers: (targetUserId: string, params?: Partial<PaginationParams>) =>
    [
      ...userKeys.detail(targetUserId),
      "following",
      "users",
      stableKey(params),
    ] as const,
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
