import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { artistKeys } from "./artist-keys";
import { ArtistItem } from "../contracts/artist-dto";
import { artistEndpoints } from "./artist-endpoints";
import {
  ArtistAboutReturn,
  ArtistBannerReturn,
  ArtistDiscographyReturn,
  ArtistPopularTracksReturn,
  ArtistSuggestionsReturn,
  FollowStatus,
} from "../data-access/artist-repo";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { getApi } from "@/lib/http/api";

export const artistQueryOptions = {
  list: () =>
    queryOptions({
      queryKey: artistKeys.list(),
      queryFn: () => getApi<ArtistItem[]>(artistEndpoints.list()),
    }),

  followStatus: (artistId: string) =>
    queryOptions({
      queryKey: artistKeys.followStatus(artistId),
      queryFn: () =>
        getApi<FollowStatus>(artistEndpoints.followStatus(artistId)),
      staleTime: 30_000,
      enabled: !!artistId,
    }),

  banner: (artistId: string) =>
    queryOptions({
      queryKey: artistKeys.banner(artistId),
      queryFn: () =>
        getApi<ArtistBannerReturn>(artistEndpoints.banner(artistId)),
      staleTime: Infinity,
      enabled: !!artistId,
    }),

  popularTracks: (artistId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: artistKeys.popularTracks(artistId, params),
      queryFn: () =>
        getApi<ArtistPopularTracksReturn>(
          artistEndpoints.popularTracks(artistId),
          { params }
        ),
      placeholderData: keepPreviousData,
      enabled: !!artistId,
    }),

  discography: (artistId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: artistKeys.discography(artistId, params),
      queryFn: () =>
        getApi<ArtistDiscographyReturn>(artistEndpoints.discography(artistId), {
          params,
        }),
      placeholderData: keepPreviousData,
      enabled: !!artistId,
    }),

  about: (artistId: string) =>
    queryOptions({
      queryKey: artistKeys.about(artistId),
      queryFn: () => getApi<ArtistAboutReturn>(artistEndpoints.about(artistId)),
      enabled: !!artistId,
      staleTime: Infinity,
    }),

  suggestions: (artistId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: artistKeys.suggestions(artistId, params),
      queryFn: () =>
        getApi<ArtistSuggestionsReturn>(artistEndpoints.suggestions(artistId), {
          params,
        }),
      placeholderData: keepPreviousData,
      enabled: !!artistId,
    }),
};
