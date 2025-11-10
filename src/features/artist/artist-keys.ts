import { PaginationParams } from "@/features/shared/shared-types";
import { stableKey } from "@/utils/stable-keys";

export const artistKeys = {
  base: ["artists"] as const,
  hotArtists: (params?: Partial<PaginationParams>) =>
    [...artistKeys.base, "hot-artists", stableKey(params)] as const,
  detail: (artistId: string) => [...artistKeys.base, artistId] as const,
  followersCount: (artistId: string) =>
    [...artistKeys.detail(artistId), "followers-count"] as const,
  discography: (artistId: string, params?: Partial<PaginationParams>) =>
    [...artistKeys.detail(artistId), "discography", stableKey(params)] as const,
  related: (artistId: string, params?: Partial<PaginationParams>) =>
    [...artistKeys.detail(artistId), "related", stableKey(params)] as const,
} as const;
