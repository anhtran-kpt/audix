export const meKeys = {
  base: ["me"] as const,
  profile: () => [...meKeys.base, "profile"] as const,
  libraryPlaylists: () => [...meKeys.base, "library", "playlists"] as const,
  followedArtists: () => [...meKeys.base, "artists"] as const,
  likedAlbums: () => [...meKeys.base, "albums"] as const,
  myPlaylists: () => [...meKeys.base, "playlists"] as const,
  likeAlbum: (albumId: string) => [...meKeys.base, "albums", albumId] as const,
  likePlaylist: (playlistId: string) =>
    [...meKeys.base, "playlists", playlistId] as const,
} as const;
