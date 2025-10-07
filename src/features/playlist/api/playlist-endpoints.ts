export const playlistEndpoints = {
  list: () => `/playlists` as const,
  detail: (playlistId: string) => `/playlists/${playlistId}` as const,

  banner: (playlistId: string) => `/playlists/${playlistId}/banner` as const,
  tracks: (playlistId: string) => `/playlists/${playlistId}/tracks` as const,
} as const;
