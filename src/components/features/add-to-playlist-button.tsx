import { Button } from "../ui/button";
import { zCuidType } from "@/features/shared/contracts/shared-dto";
import { useOptimisticTrackAdd } from "@/hooks/use-optimistic-track-add";

type AddToPlaylistButtonProps = {
  trackId: zCuidType;
  playlistId: zCuidType;
};

export default function AddToPlaylistButton({
  trackId,
  playlistId,
}: AddToPlaylistButtonProps) {
  const { mutate, isPending } = useOptimisticTrackAdd();

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => mutate({ playlistId, trackId })}
      className="text-foreground rounded-full"
    >
      Add
    </Button>
  );
}
