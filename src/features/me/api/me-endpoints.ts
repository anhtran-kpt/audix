export const meEndpoints = {
  banner: () => `/me/banner` as const,
  likedPlaylists: () => `/me/likes/playlists` as const,
  likedPlaylistStatus: (playlistId: string) =>
    `/me/likes/playlists/${playlistId}` as const,
  likedAlbums: () => `/me/likes/albums` as const,
  likedAlbumStatus: (albumId: string) => `/me/likes/albums/${albumId}` as const,
  followedArtists: () => `/me/artists` as const,
  myPlaylists: () => `/me/playlists` as const,
  toggleLikeAlbum: (albumId: string) => `/me/likes/albums/${albumId}` as const,
  toggleLikePlaylist: (playlistId: string) =>
    `/me/likes/playlists/${playlistId}` as const,
};
