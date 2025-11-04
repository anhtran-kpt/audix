"use client";

import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToggleFollowUser } from "@/features/user/hooks/use-toggle-follow-user";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { UserItem } from "@/features/user/contracts/user-dto";

export const ToggleFollowUserButton = ({ user }: { user: UserItem }) => {
  const { data: followStatus } = useQuery({
    ...userQueryOptions.followStatus(user.id),
    enabled: !!user.id,
  });

  const toggle = useToggleFollowUser(user);

  if (!followStatus) return null;

  return (
    <Button
      className="rounded-full"
      aria-pressed={followStatus.isFollowing}
      variant="outline"
      onClick={() =>
        toggle.mutate({ nextIsFollowing: !followStatus.isFollowing })
      }
      disabled={toggle.isPending}
    >
      {toggle.isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : followStatus.isFollowing ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
};
