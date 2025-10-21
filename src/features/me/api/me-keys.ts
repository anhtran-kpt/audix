export const meKeys = {
  base: ["me"] as const,
  banner: () => [...meKeys.base, "banner"] as const,
  followers: () => [...meKeys.base, "followers"] as const,
  followedArtists: () => [...meKeys.base, "artists"] as const,
  followedUsers: () => [...meKeys.base, "users"] as const,
  likedPlaylists: () => [...meKeys.base, "like", "playlists"] as const,
  likedPlaylistStatus: (playlistId: string) =>
    [...meKeys.likedPlaylists(), playlistId] as const,
  likedAlbums: () => [...meKeys.base, "like", "albums"] as const,
  likedAlbumStatus: (albumId: string) =>
    [...meKeys.likedAlbums(), albumId] as const,
  myPlaylists: () => [...meKeys.base, "playlists"] as const,
  likeAlbum: (albumId: string) => [...meKeys.base, "albums", albumId] as const,
  likePlaylist: (playlistId: string) =>
    [...meKeys.base, "playlists", playlistId] as const,
} as const;
