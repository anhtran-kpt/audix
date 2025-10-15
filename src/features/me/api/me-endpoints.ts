export const meEndpoints = {
  banner: () => `/me/banner` as const,
  libraryPlaylists: () => `/me/library/playlists` as const,
  likedAlbums: () => `/me/albums` as const,
  followedArtists: () => `/me/artists` as const,
  myPlaylists: () => `/me/playlists` as const,
  toggleLikeAlbum: (albumId: string) => `/me/albums/${albumId}` as const,
  toggleLikePlaylist: (playlistId: string) =>
    `/me/playlists/${playlistId}` as const,
};
