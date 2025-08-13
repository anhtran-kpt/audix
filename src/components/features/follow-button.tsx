"use client";

import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { setFollowAction } from "@/features/artist/actions/set-follow.action";
import { Loader2Icon } from "lucide-react";

interface FollowButtonProps {
  artistId: string;
  initialFollowing: boolean;
  initialCount: number;
}

export const FollowButton = ({
  artistId,
  initialFollowing,
  initialCount,
}: FollowButtonProps) => {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useState(initialFollowing);
  const [_, setCount] = useState(initialCount);

  const toggle = () => {
    const next = !following;
    setCount((c) => c + (next ? 1 : -1));

    setFollowing(next);

    startTransition(async () => {
      const res = await setFollowAction({ artistId, follow: next });
      if (!res.ok) {
        setFollowing(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  };

  if (!session?.user.id) {
    return null;
  }

  return (
    <Button
      className="rounded-full"
      aria-pressed={following}
      variant="outline"
      onClick={toggle}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2Icon className="animate-spin" />
      ) : following ? (
        "Following"
      ) : (
        "Follow"
      )}
    </Button>
  );
};
