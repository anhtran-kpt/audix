"use client";

import { cn } from "@/lib/utils";
import { RowPlayButton } from "../features/row-play-button";
import WaveForm from "../ui/wave-form";
import { PlaybackContextType } from "@/features/shared/contracts/shared-enum";

export default function TrackIndexCell({
  isPlaying,
  isThisTrack,
  index,
  context,
}: {
  isPlaying: boolean;
  isThisTrack: boolean;
  index: number;
  context: { type: PlaybackContextType; contextId?: string; name?: string };
}) {
  if (isPlaying && isThisTrack) {
    return (
      <>
        <div className="group-hover:hidden">
          <WaveForm />
        </div>
        <div className="hidden group-hover:block">
          <RowPlayButton context={context} buttonType="outside" />
        </div>
      </>
    );
  }
  return (
    <>
      <span className={cn("group-hover:hidden", isThisTrack && "text-primary")}>
        {index + 1}
      </span>
      <RowPlayButton context={context} buttonType="outside" />
    </>
  );
}
