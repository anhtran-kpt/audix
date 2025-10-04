"use client";

import { TrackItem } from "@/features/track/contracts/track-dto";
import { Button } from "../ui/button";
import { useOptimisticTrackAdd } from "@/features/playlist/hooks/use-optimistic-track-add";

type AddToPlaylistButtonProps = {
  track: TrackItem;
  playlistId: string;
};

export default function AddToPlaylistButton({
  track,
  playlistId,
}: AddToPlaylistButtonProps) {
  const { mutate, isPending } = useOptimisticTrackAdd();

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
