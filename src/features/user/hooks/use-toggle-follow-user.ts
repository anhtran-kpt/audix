"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FollowStatus,
  UserBanner,
  UserFollowers,
} from "../data-access/user-repo";
import { userKeys } from "../api/user-keys";
import { deleteApi, postApi } from "@/lib/http/api";
import { meKeys } from "@/features/me/api/me-keys";
import { UserItem } from "../contracts/user-dto";
import { userEndpoints } from "../api/user-endpoints";
import { MyFollowedUsers } from "@/lib/data/me-data";

export function useToggleFollowUser(user: UserItem) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ nextIsFollowing }: { nextIsFollowing: boolean }) => {
      const res = nextIsFollowing
        ? await postApi<FollowStatus>(userEndpoints.follow(user.id))
        : await deleteApi<FollowStatus>(userEndpoints.follow(user.id));
      return res;
    },

    onMutate: async ({ nextIsFollowing }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: userKeys.followStatus(user.id) }),
        qc.cancelQueries({ queryKey: userKeys.followers(user.id) }),
        qc.cancelQueries({ queryKey: userKeys.banner(user.id) }),
        qc.cancelQueries({ queryKey: meKeys.followedUsers() }),
      ]);

      const prevData = {
        followStatus: qc.getQueryData<FollowStatus>(
          userKeys.followStatus(user.id)
        ),
        followers: qc.getQueryData<UserFollowers>(userKeys.followers(user.id)),
        userBanner: qc.getQueryData<UserBanner>(userKeys.banner(user.id)),
        followedUsers: qc.getQueryData<MyFollowedUsers>(meKeys.followedUsers()),
        // myBanner: qc.getQueryData<MyBanner>(meKeys.banner()),
      };

      qc.setQueryData<FollowStatus>(userKeys.followStatus(user.id), () => {
        return { isFollowing: nextIsFollowing };
      });

      qc.setQueryData<UserFollowers>(userKeys.followers(user.id), (old) => {
        if (!old)
          return nextIsFollowing
            ? {
                pagination: { limit: 5, offset: 0, total: 1, hasMore: false },
                items: [user],
              }
            : {
                pagination: { limit: 5, offset: 0, total: 1, hasMore: false },
                items: [],
              };

        if (nextIsFollowing) {
          const exists = old.items.some((item) => item.id === user.id);
          return exists
            ? old
            : {
                ...old,
                pagination: {
                  ...old.pagination,
                  total: old.pagination.total + 1,
                },
                items: [user, ...old.items],
              };
        }

        return {
          ...old,
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
          items: old.items.filter((item) => item.id !== user.id),
        };
      });

      qc.setQueryData<MyFollowedUsers>(meKeys.followedUsers(), (old) => {
        if (!old)
          return nextIsFollowing
            ? {
                pagination: { limit: 5, offset: 0, total: 1, hasMore: false },
                items: [user],
              }
            : {
                pagination: { limit: 5, offset: 0, total: 1, hasMore: false },
                items: [],
              };

        if (nextIsFollowing) {
          const exists = old.items.some((item) => item.id === user.id);
          return exists
            ? old
            : {
                ...old,
                pagination: {
                  ...old.pagination,
                  total: old.pagination.total + 1,
                },
                items: [user, ...old.items],
              };
        }

        return {
          ...old,
          pagination: {
            ...old.pagination,
            total: old.pagination.total - 1,
          },
          items: old.items.filter((item) => item.id !== user.id),
        };
      });

      qc.setQueryData<UserBanner>(userKeys.banner(user.id), (old) => {
        if (!old) return;

        return {
          ...old,
          _count: {
            ...old._count,
            followers: nextIsFollowing
              ? old._count.followers + 1
              : old._count.followers - 1,
          },
        };
      });

      // qc.setQueryData<MyBanner>(meKeys.banner(), (old) => {
      //   if (!old) return;

      //   return {
      //     ...old,
      //     _count: {
      //       ...old._count,
      //       followers: nextIsFollowing
      //         ? old._count.followers + 1
      //         : old._count.followers - 1,
      //     },
      //   };
      // });

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;

      qc.setQueryData(
        userKeys.followStatus(user.id),
        ctx.prevData.followStatus
      );
      qc.setQueryData(userKeys.banner(user.id), ctx.prevData.userBanner);
      // qc.setQueryData(meKeys.banner(), ctx.prevData.myBanner);
      qc.setQueryData(userKeys.followers(user.id), ctx.prevData.followers);
      qc.setQueryData(meKeys.followedUsers(), ctx.prevData.followedUsers);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: userKeys.followStatus(user.id) });
      qc.invalidateQueries({ queryKey: userKeys.banner(user.id) });
      qc.invalidateQueries({ queryKey: userKeys.followers(user.id) });
      qc.invalidateQueries({ queryKey: meKeys.followedUsers() });
      qc.invalidateQueries({ queryKey: meKeys.banner() });
    },
  });
}
