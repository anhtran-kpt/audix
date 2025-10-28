import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { stableKey } from "@/utils/stable-keys";

export const artistKeys = {
  base: ["artists"] as const,
  list: () => [...artistKeys.base, "list"] as const,
  hotArtists: (params?: Partial<PaginationParams>) =>
    [...artistKeys.base, "hot-artists", stableKey(params)] as const,
  detail: (artistId: string) => [...artistKeys.base, artistId] as const,

  followStatus: (artistId: string) =>
    [...artistKeys.detail(artistId), "follow"] as const,

  banner: (artistId: string) =>
    [...artistKeys.detail(artistId), "banner"] as const,
  popularTracks: (artistId: string, params?: Partial<PaginationParams>) =>
    [
      ...artistKeys.detail(artistId),
      "popular-tracks",
      stableKey(params),
    ] as const,
  discography: (artistId: string, params?: Partial<PaginationParams>) =>
    [...artistKeys.detail(artistId), "discography", stableKey(params)] as const,
  about: (artistId: string) =>
    [...artistKeys.detail(artistId), "about"] as const,
  suggestions: (artistId: string, params?: Partial<PaginationParams>) =>
    [...artistKeys.detail(artistId), "suggestions", stableKey(params)] as const,
} as const;
