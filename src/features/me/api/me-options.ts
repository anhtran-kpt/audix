import { queryOptions } from "@tanstack/react-query";
import { meKeys } from "./me-keys";
import { getApi } from "@/lib/http/request";
import { AlbumItem } from "@/features/album/contracts/album-dto";
import { meEndpoints } from "./me-endpoints";
import { ArtistItem } from "@/features/artist/contracts/artist-dto";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";

export const libraryAlbumsOptions = () => {
  return queryOptions({
    queryKey: meKeys.libraryAlbums(),
    queryFn: () => getApi<AlbumItem[]>(meEndpoints.libraryAlbums()),
  });
};

export const libraryArtistsOptions = () => {
  return queryOptions({
    queryKey: meKeys.libraryArtists(),
    queryFn: () => getApi<ArtistItem[]>(meEndpoints.libraryArtists()),
  });
};

export const libraryPlaylistsOptions = () => {
  return queryOptions({
    queryKey: meKeys.libraryPlaylists(),
    queryFn: () => getApi<PlaylistItem[]>(meEndpoints.libraryPlaylists()),
  });
};
