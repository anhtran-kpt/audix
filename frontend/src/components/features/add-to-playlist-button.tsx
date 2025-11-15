"use client";

import { TrackItem } from "@/features/track/track-types";
import { Button } from "../ui/button";
import { useAddRecommendedTrackToPlaylist } from "@/features/playlist/hooks/use-add-recommended-track-to-playlist";

type AddToPlaylistButtonProps = {
  track: TrackItem;
  playlistId: string;
};

export default function AddToPlaylistButton({
  track,
  playlistId,
}: AddToPlaylistButtonProps) {
  const { mutate, isPending } = useAddRecommendedTrackToPlaylist();

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => mutate({ playlistId, track })}
      className="text-foreground rounded-full"
    >
      Add
    </Button>
  );
}
