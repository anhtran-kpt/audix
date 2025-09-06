import { zCuidType } from "@/features/shared/contracts/shared-dto";

export const playlistKeys = {
  detail: (playlistId: zCuidType) => ["playlists", playlistId] as const,
  sidebarPlaylists: () => ["me", "sidebar", "playlists"] as const,
} as const;
