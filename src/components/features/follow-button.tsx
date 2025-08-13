"use client";

import { Button } from "../ui/button";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { setFollowAction } from "@/features/artist/actions/set-follow.action";
import { CheckIcon, Loader2Icon } from "lucide-react";

interface FollowButtonProps {
  artistId: string;
  initialFollowing: boolean;
}

export const FollowButton = ({
  artistId,
  initialFollowing,
}: FollowButtonProps) => {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [following, setFollowing] = useState(initialFollowing);

  const toggle = () => {
    const next = !following;

    setFollowing(next);

    startTransition(async () => {
      const res = await setFollowAction({ artistId, follow: next });
      if (!res.ok) {
        setFollowing(!next);
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
        <>
          <CheckIcon />
          Following
        </>
      ) : (
        "Follow"
      )}
    </Button>
  );
};
