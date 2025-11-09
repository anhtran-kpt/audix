import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { stableKey } from "@/utils/stable-keys";

export const meKeys = {
  base: ["me"] as const,
  banner: () => [...meKeys.base, "banner"] as const,
  followedArtists: (params?: Partial<PaginationParams>) =>
    [...meKeys.base, "artists", stableKey(params)] as const,
  likedPlaylists: (params?: Partial<PaginationParams>) =>
    [...meKeys.base, "like", "playlists", stableKey(params)] as const,
  likedPlaylistStatus: (playlistId: string) =>
    [...meKeys.likedPlaylists(), playlistId] as const,
  likedAlbums: (params?: Partial<PaginationParams>) =>
    [...meKeys.base, "like", "albums", stableKey(params)] as const,
  likedAlbumStatus: (albumId: string) =>
    [...meKeys.likedAlbums(), albumId] as const,
  myPlaylists: (params?: Partial<PaginationParams>) =>
    [...meKeys.base, "playlists", stableKey(params)] as const,
  likeAlbum: (albumId: string) => [...meKeys.base, "albums", albumId] as const,
  likePlaylist: (playlistId: string) =>
    [...meKeys.base, "playlists", playlistId] as const,
  favoriteSongsPlaylist: () =>
    [...meKeys.base, "playlists", "favorite-songs"] as const,
} as const;
