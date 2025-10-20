"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FollowStatus } from "../data-access/user-repo";
import { userKeys } from "../api/user-keys";
import { deleteApi, postApi } from "@/lib/http/api";
import { meKeys } from "@/features/me/api/me-keys";
import { UserItem } from "../data-access/user-dto";

export function useToggleFollowUser(user: UserItem) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ nextIsFollowing }: { nextIsFollowing: boolean }) => {
      const res = nextIsFollowing
        ? await postApi<FollowStatus>(`/users/${user.id}/follows`)
        : await deleteApi<FollowStatus>(`/users/${user.id}/follows`);
      return res;
    },

    onMutate: async ({ nextIsFollowing }) => {
      await Promise.all([
        qc.cancelQueries({ queryKey: userKeys.followStatus(user.id) }),
        qc.cancelQueries({ queryKey: meKeys.followedUsers() }),
      ]);

      const prevData = {
        followStatus: qc.getQueryData<FollowStatus>(
          userKeys.followStatus(user.id)
        ),
        followedUsers: qc.getQueryData<MyFollowedUsers>(meKeys.followedUsers()),
      };

      qc.setQueryData<FollowStatus>(userKeys.followStatus(user.id), (old) => {
        const base = old ?? { isFollowing: false, followersCount: 0 };
        const delta = nextIsFollowing
          ? base.isFollowing
            ? 0
            : 1
          : base.isFollowing
          ? -1
          : 0;

        return {
          isFollowing: nextIsFollowing,
          followersCount: Math.max(0, (base.followersCount ?? 0) + delta),
        };
      });

      qc.setQueryData<MyFollowedUsers>(meKeys.followedUsers(), (old) => {
        if (!old) return nextIsFollowing ? [user] : [];

        if (nextIsFollowing) {
          const exists = old.some((a) => a.id === user.id);
          return exists ? old : [user, ...old];
        }

        return old.filter((a) => a.id !== user.id);
      });

      return { prevData };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      qc.setQueryData(
        userKeys.followStatus(user.id),
        ctx.prevData.followStatus
      );
      qc.setQueryData(meKeys.followedUsers(), ctx.prevData.followedUsers);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: userKeys.followStatus(user.id) });
      qc.invalidateQueries({ queryKey: meKeys.followedUsers() });
    },
  });
}
