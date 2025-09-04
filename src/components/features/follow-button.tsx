"use client";

import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { followStatusOptions } from "@/features/artist/query/artist-options";
import { useToggleFollow } from "@/features/artist/hooks/use-toggle-follow";
import { zCuidType } from "@/features/shared/contracts/shared-dto";

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
