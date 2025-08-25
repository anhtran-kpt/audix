"use client";

import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { zCuidType } from "@/contracts/common";
import { followStatusOptions } from "@/react-query/query-options/follow";
import { useToggleFollow } from "@/hooks/use-toggle-follow";
import { useSession } from "next-auth/react";

export const FollowButton = ({ artistId }: { artistId: zCuidType }) => {
  const { status } = useSession();

  const { data: followStatus } = useQuery({
    ...followStatusOptions(artistId),
    enabled: !!artistId && status === "authenticated",
  });

  const toggle = useToggleFollow(artistId);

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
