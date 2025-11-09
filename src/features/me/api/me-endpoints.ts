export const meEndpoints = {
  banner: () => `/me/banner` as const,
  likedPlaylists: () => `/me/like/playlists` as const,
  likedPlaylistStatus: (playlistId: string) =>
    `/me/like/playlists/${playlistId}` as const,
  likedAlbums: () => `/me/like/albums` as const,
  likedAlbumStatus: (albumId: string) => `/me/like/albums/${albumId}` as const,
  followedArtists: () => `/me/following` as const,
  myPlaylists: () => `/me/playlists` as const,
  toggleLikeAlbum: (albumId: string) => `/me/like/albums/${albumId}` as const,
  toggleLikePlaylist: (playlistId: string) =>
    `/me/like/playlists/${playlistId}` as const,
  toggleLikeTrack: (trackId: string) => `/me/like/tracks/${trackId}` as const,
  favoriteSongsPlaylist: () => `/me/favorite-songs-playlist` as const,
};
