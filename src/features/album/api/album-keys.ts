import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { stableKey } from "@/utils/stable-keys";

export const albumKeys = {
  base: ["albums"] as const,
  newReleases: (params?: Partial<PaginationParams>) =>
    [...albumKeys.base, "new-releases", stableKey(params)] as const,
  popularAlbums: (params?: Partial<PaginationParams>) =>
    [...albumKeys.base, "popular-albums", stableKey(params)] as const,
  list: (params?: Partial<PaginationParams>) =>
    [...albumKeys.base, "list", stableKey(params)] as const,
  detail: (albumId: string) => [...albumKeys.base, albumId] as const,

  banner: (albumId: string) =>
    [...albumKeys.detail(albumId), "banner"] as const,
  tracks: (albumId: string) =>
    [...albumKeys.detail(albumId), "tracks"] as const,
  suggestions: (albumId: string, params?: Partial<PaginationParams>) =>
    [...albumKeys.detail(albumId), "suggestions", stableKey(params)] as const,
} as const;
