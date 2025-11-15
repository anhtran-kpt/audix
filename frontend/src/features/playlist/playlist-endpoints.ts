export const playlistEndpoints = {
  list: () => `/playlists` as const,
  detail: (playlistId: string) => `/playlists/${playlistId}` as const,

  overview: (playlistId: string) =>
    `/playlists/${playlistId}/overview` as const,
  tracks: (playlistId: string) => `/playlists/${playlistId}/tracks` as const,
} as const;
