export const meKeys = {
  libraryPlaylists: () => ["me", "library", "playlists"] as const,
  libraryArtists: () => ["me", "library", "artists"] as const,
  libraryAlbums: () => ["me", "library", "albums"] as const,
  likeAlbum: (albumId: string) => ["me", "albums", albumId] as const,
  likePlaylist: (playlistId: string) =>
    ["me", "playlists", playlistId] as const,
} as const;
