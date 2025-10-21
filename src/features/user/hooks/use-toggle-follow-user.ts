"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FollowStatus,
  UserBanner,
  UserFollower,
} from "../data-access/user-repo";
import { userKeys } from "../api/user-keys";
import { deleteApi, postApi } from "@/lib/http/api";
import { meKeys } from "@/features/me/api/me-keys";
import { UserItem } from "../contracts/user-dto";
import { userEndpoints } from "../api/user-endpoints";
import { MyBanner, MyFollowedUser } from "@/features/me/data-access/me-repo";

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
        followers: qc.getQueryData<UserFollower[]>(userKeys.followers(user.id)),
        userBanner: qc.getQueryData<UserBanner>(userKeys.banner(user.id)),
        followedUsers: qc.getQueryData<MyFollowedUser[]>(
          meKeys.followedUsers()
        ),
        myBanner: qc.getQueryData<MyBanner>(meKeys.banner()),
      };

      qc.setQueryData<FollowStatus>(userKeys.followStatus(user.id), () => {
        return { isFollowing: nextIsFollowing };
      });

      qc.setQueryData<UserFollower[]>(userKeys.followers(user.id), (old) => {
        if (!old) return nextIsFollowing ? [user] : [];

        if (nextIsFollowing) {
          const exists = old.some((a) => a.id === user.id);
          return exists ? old : [user, ...old];
        }

        return old.filter((a) => a.id !== user.id);
      });

      qc.setQueryData<MyFollowedUser[]>(meKeys.followedUsers(), (old) => {
        if (!old) return nextIsFollowing ? [user] : [];

        if (nextIsFollowing) {
          const exists = old.some((a) => a.id === user.id);
          return exists ? old : [user, ...old];
        }

        return old.filter((a) => a.id !== user.id);
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

      qc.setQueryData<MyBanner>(meKeys.banner(), (old) => {
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

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;

      qc.setQueryData(
        userKeys.followStatus(user.id),
        ctx.prevData.followStatus
      );
      qc.setQueryData(userKeys.banner(user.id), ctx.prevData.userBanner);
      qc.setQueryData(meKeys.banner(), ctx.prevData.myBanner);
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
