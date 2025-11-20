import { queryOptions } from "@tanstack/react-query";
import { userKeys } from "./user-keys";
import { userEndpoints } from "./user-endpoints";
import { getApi } from "@/lib/axios";
import { PaginationParams } from "@/features/shared/shared-types";
import {
  UserFollowedArtists,
  UserOverview,
  UserPlaylists,
} from "@/features/user/user-data";

export const userQueryOptions = {
  overview: (targetUserId: string) =>
    queryOptions({
      queryKey: userKeys.overview(targetUserId),
      queryFn: () => getApi<UserOverview>(userEndpoints.overview(targetUserId)),
    }),

  playlists: (targetUserId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: userKeys.playlists(targetUserId, params),
      queryFn: () =>
        getApi<UserPlaylists>(userEndpoints.playlists(targetUserId)),
    }),

  followingArtists: (
    targetUserId: string,
    params?: Partial<PaginationParams>
  ) =>
    queryOptions({
      queryKey: userKeys.followingArtists(targetUserId, params),
      queryFn: () =>
        getApi<UserFollowedArtists>(
          userEndpoints.followingArtists(targetUserId)
        ),
    }),
} as const;
