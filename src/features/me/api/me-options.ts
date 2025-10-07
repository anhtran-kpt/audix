import { queryOptions } from "@tanstack/react-query";
import { meKeys } from "./me-keys";
import { AlbumItem } from "@/features/album/contracts/album-dto";
import { meEndpoints } from "./me-endpoints";
import { ArtistItem } from "@/features/artist/contracts/artist-dto";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import { getApi } from "@/lib/http/api";

export const likedAlbumsOptions = () => {
  return queryOptions({
    queryKey: meKeys.likedAlbums(),
    queryFn: () => getApi<AlbumItem[]>(meEndpoints.likedAlbums()),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const followedArtistsOptions = () => {
  return queryOptions({
    queryKey: meKeys.followedArtists(),
    queryFn: () => getApi<ArtistItem[]>(meEndpoints.followedArtists()),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const libraryPlaylistsOptions = () => {
  return queryOptions({
    queryKey: meKeys.libraryPlaylists(),
    queryFn: () => getApi<PlaylistItem[]>(meEndpoints.libraryPlaylists()),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};

export const myPlaylistsOptions = () => {
  return queryOptions({
    queryKey: meKeys.myPlaylists(),
    queryFn: () => getApi<PlaylistItem[]>(meEndpoints.myPlaylists()),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
