export const playlistKeys = {
  detail: (playlistId: string) => ["playlists", playlistId] as const,
  list: () => ["me", "playlists"] as const,
} as const;
