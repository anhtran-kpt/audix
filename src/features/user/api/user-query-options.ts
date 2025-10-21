import { queryOptions } from "@tanstack/react-query";
import { userKeys } from "./user-keys";
import { userEndpoints } from "./user-endpoints";
import { getApi } from "@/lib/http/api";
import {
  FollowStatus,
  UserBanner,
  UserFollowedArtists,
  UserFollowedUsers,
  UserFollowers,
  UserPlaylists,
} from "../data-access/user-repo";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";

export const userQueryOptions = {
  banner: (targetUserId: string) =>
    queryOptions({
      queryKey: userKeys.banner(targetUserId),
      queryFn: () => getApi<UserBanner>(userEndpoints.banner(targetUserId)),
    }),

  playlists: (targetUserId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: userKeys.playlists(targetUserId, params),
      queryFn: () =>
        getApi<UserPlaylists>(userEndpoints.playlists(targetUserId)),
    }),

  followers: (targetUserId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: userKeys.followers(targetUserId, params),
      queryFn: () =>
        getApi<UserFollowers>(userEndpoints.followers(targetUserId)),
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

  followingUsers: (targetUserId: string, params?: Partial<PaginationParams>) =>
    queryOptions({
      queryKey: userKeys.followingUsers(targetUserId, params),
      queryFn: () =>
        getApi<UserFollowedUsers>(userEndpoints.followingUsers(targetUserId)),
    }),

  followStatus: (targetUserId: string) =>
    queryOptions({
      queryKey: userKeys.followStatus(targetUserId),
      queryFn: () =>
        getApi<FollowStatus>(userEndpoints.followStatus(targetUserId)),
    }),
} as const;
