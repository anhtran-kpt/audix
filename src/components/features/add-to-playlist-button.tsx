"use client";

import { Button } from "../ui/button";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { RecommendedTrackItem } from "@/features/track/contracts/track-dto";
import { useOptimisticTrackAdd } from "@/hooks/use-optimistic-track-add";

type AddToPlaylistButtonProps = {
  track: RecommendedTrackItem;
  playlistId: zCuidType;
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
