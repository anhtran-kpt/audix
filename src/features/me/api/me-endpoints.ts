export const meEndpoints = {
  libraryPlaylists: () => `/me/playlists` as const,
  libraryAlbums: () => `/me/albums` as const,
  libraryArtists: () => `/me/artists` as const,
  toggleLikeAlbum: (albumId: string) => `/me/albums/${albumId}` as const,
  toggleLikePlaylist: (playlistId: string) =>
    `/me/playlists/${playlistId}` as const,
};
