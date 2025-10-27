"use client";

import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useToggleFollowArtist } from "@/features/artist/hooks/use-toggle-follow-artist";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { ArtistItem } from "@/features/artist/contracts/artist-dto";

export const ToggleFollowArtistButton = ({
  artist,
}: {
  artist: ArtistItem;
}) => {
  const { status } = useSession();

  const { data: followStatus } = useQuery({
    ...artistQueryOptions.followStatus(artist.id),
    enabled: !!artist.id && status === "authenticated",
  });

  const toggle = useToggleFollowArtist(artist);

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
      {followStatus.isFollowing ? "Following" : "Follow"}
    </Button>
  );
};
