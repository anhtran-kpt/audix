export const meKeys = {
  base: ["me"] as const,
  profile: () => [...meKeys.base, "profile"] as const,
  followedArtists: () => [...meKeys.base, "artists"] as const,
  likedPlaylists: () => [...meKeys.base, "likes", "playlists"] as const,
  likedPlaylistStatus: (playlistId: string) =>
    [...meKeys.likedPlaylists(), playlistId] as const,
  likedAlbums: () => [...meKeys.base, "likes", "albums"] as const,
  likedAlbumStatus: (albumId: string) =>
    [...meKeys.likedAlbums(), albumId] as const,
  myPlaylists: () => [...meKeys.base, "playlists"] as const,
  likeAlbum: (albumId: string) => [...meKeys.base, "albums", albumId] as const,
  likePlaylist: (playlistId: string) =>
    [...meKeys.base, "playlists", playlistId] as const,
} as const;
