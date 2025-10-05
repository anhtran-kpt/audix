export const meKeys = {
  libraryPlaylists: () => ["me", "library", "playlists"] as const,
  followedArtists: () => ["me", "artists"] as const,
  likedAlbums: () => ["me", "albums"] as const,
  myPlaylists: () => ["me", "playlists"] as const,
  likeAlbum: (albumId: string) => ["me", "albums", albumId] as const,
  likePlaylist: (playlistId: string) =>
    ["me", "playlists", playlistId] as const,
} as const;
