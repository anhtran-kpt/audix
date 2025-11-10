import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { artistKeys } from "./artist-keys";
import { artistEndpoints } from "./artist-endpoints";
import { PaginationParams } from "@/features/shared/shared-types";
import { getApi } from "@/lib/api";
import {
  ArtistDiscography,
  ArtistFollowersCount,
  HotArtists,
  RelatedArtists,
} from "@/features/artist/artist-data";

export const artistQueryOptions = {
  followersCount: (artistId: string) =>
    queryOptions({
      queryKey: artistKeys.followersCount(artistId),
      queryFn: () =>
        getApi<ArtistFollowersCount>(artistEndpoints.followersCount(artistId)),
      staleTime: 30_000,
      enabled: !!artistId,
    }),

  discography: (artistId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: artistKeys.discography(artistId, params),
      queryFn: () =>
        getApi<ArtistDiscography>(artistEndpoints.discography(artistId), {
          params,
        }),
      placeholderData: keepPreviousData,
      enabled: !!artistId,
    }),

  related: (artistId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: artistKeys.related(artistId, params),
      queryFn: () =>
        getApi<RelatedArtists>(artistEndpoints.related(artistId), {
          params,
        }),
      placeholderData: keepPreviousData,
      enabled: !!artistId,
    }),

  hotArtists: (params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: artistKeys.hotArtists(params),
      queryFn: () =>
        getApi<HotArtists>(artistEndpoints.hotArtists(), {
          params,
        }),
      placeholderData: keepPreviousData,
    }),
};
