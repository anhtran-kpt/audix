export const playlistKeys = {
  detail: (playlistId: string) => ["playlists", playlistId] as const,
} as const;
