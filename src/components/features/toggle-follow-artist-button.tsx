"use client";

import { Button } from "../ui/button";
import { useToggleFollowArtist } from "@/features/artist/hooks/use-toggle-follow-artist";
import { ArtistItem } from "@/features/artist/contracts/artist-dto";

export const ToggleFollowArtistButton = ({
  artist,
}: {
  artist: ArtistItem;
}) => {
  const { isFollowed, isPending, toggleFollow } = useToggleFollowArtist();

  const isFollowing = isFollowed(artist.id);

  return (
    <Button
      className="rounded-full "
      aria-pressed={isFollowing}
      variant="outline"
      onClick={() => toggleFollow(artist)}
      disabled={isPending}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
};
