import { zCuidType } from "@/features/shared/contracts/shared-dto";

export const playlistKeys = {
  detail: (playlistId: zCuidType) => ["playlists", playlistId] as const,
  sidebarPlaylists: () => ["me", "sidebar", "playlists"] as const,
  playlistsWithoutTrack: (trackId: zCuidType) =>
    ["playlists", "exclude", trackId] as const,
} as const;
