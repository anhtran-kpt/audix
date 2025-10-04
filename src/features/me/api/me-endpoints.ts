export const meEndpoints = {
  libraryPlaylists: () => `/me/library/playlists` as const,
  libraryAlbums: () => `/me/library/albums` as const,
  libraryArtists: () => `/me/library/artists` as const,
};
