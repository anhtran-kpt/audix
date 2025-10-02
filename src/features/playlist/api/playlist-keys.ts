export const playlistKeys = {
  detail: (playlistId: string) => ["playlists", playlistId] as const,
  list: () => ["playlists", "list"] as const,
} as const;
