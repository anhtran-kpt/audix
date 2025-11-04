"use client";

import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToggleFollowArtist } from "@/features/artist/hooks/use-toggle-follow-artist";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { ArtistItem } from "@/features/artist/contracts/artist-dto";
import { Skeleton } from "../ui/skeleton";

export const ToggleFollowArtistButton = ({
  artist,
}: {
  artist: ArtistItem;
}) => {
  const { data: followStatus } = useQuery({
    ...artistQueryOptions.followStatus(artist.id),
    enabled: !!artist.id,
  });

  const toggle = useToggleFollowArtist(artist);

  if (!followStatus) return <Skeleton className="w-20 h-9" />;

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
