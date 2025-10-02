export const playlistKeys = {
  detail: (playlistId: string) => ["playlists", playlistId] as const,
  sidebarPlaylists: () => ["me", "sidebar", "playlists"] as const,
  userPlaylists: (trackId: string) =>
    ["playlists", "trackInclude", trackId] as const,
} as const;
