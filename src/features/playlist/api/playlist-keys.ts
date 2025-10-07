import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { stableKey } from "@/utils/stable-keys";

export const playlistKeys = {
  base: ["playlists"] as const,
  list: (params?: Partial<PaginationParams>) =>
    [...playlistKeys.base, "list", stableKey(params)] as const,
  detail: (playlistId: string) => [...playlistKeys.base, playlistId] as const,

  banner: (playlistId: string) =>
    [...playlistKeys.detail(playlistId), "banner"] as const,
  tracks: (playlistId: string) =>
    [...playlistKeys.detail(playlistId), "tracks"] as const,
} as const;
