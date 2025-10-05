"use client";

import { TrackItem } from "@/features/track/contracts/track-dto";
import { Button } from "../ui/button";
import { useAddTrackToPlaylist } from "@/features/playlist/hooks/use-add-track-to-playlist";

type AddToPlaylistButtonProps = {
  track: TrackItem;
  playlistId: string;
};

export default function AddToPlaylistButton({
  track,
  playlistId,
}: AddToPlaylistButtonProps) {
  const { mutate, isPending } = useAddTrackToPlaylist();

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
