import { queryOptions } from "@tanstack/react-query";
import { meKeys } from "./me-keys";
import { AlbumItem } from "@/features/album/contracts/album-dto";
import { meEndpoints } from "./me-endpoints";
import { ArtistItem } from "@/features/artist/contracts/artist-dto";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";
import { getApi } from "@/lib/http/api";
import { MyBanner, MyPlaylists } from "../data-access/me-repo";

export const meQueryOptions = {
  banner: () =>
    queryOptions({
      queryKey: meKeys.profile(),
      queryFn: () => getApi<MyBanner>(meEndpoints.banner()),
    }),

  myPlaylists: () =>
    queryOptions({
      queryKey: meKeys.myPlaylists(),
      queryFn: () => getApi<MyPlaylists>(meEndpoints.myPlaylists()),
    }),

  likedPlaylists: () =>
    queryOptions({
      queryKey: meKeys.likedPlaylists(),
      queryFn: () => getApi<PlaylistItem[]>(meEndpoints.likedPlaylists()),
    }),

  likedAlbums: () =>
    queryOptions({
      queryKey: meKeys.likedAlbums(),
      queryFn: () => getApi<AlbumItem[]>(meEndpoints.likedAlbums()),
    }),

  followedArtists: () =>
    queryOptions({
      queryKey: meKeys.followedArtists(),
      queryFn: () => getApi<ArtistItem[]>(meEndpoints.followedArtists()),
    }),
} as const;
