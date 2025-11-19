import { PaginationParams } from "@/features/shared/shared-types";
import { stableKey } from "@/utils/stable-keys";

export const artistKeys = {
  all: ["artists"] as const,
  hotArtists: (params?: Partial<PaginationParams>) =>
    [...artistKeys.all, "hot-artists", stableKey(params)] as const,
  detail: (artistId: string) => [...artistKeys.all, artistId] as const,
  followersCount: (artistId: string) =>
    [...artistKeys.detail(artistId), "followers-count"] as const,
} as const;
