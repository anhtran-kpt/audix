"use client";

import { cn } from "@/lib/utils";
import WaveForm from "../ui/wave-form";
import { RowPlayButton } from "./row-play-button";
import { PlaybackContextSnapshot } from "@/features/playback/contracts/playback-dto";

export default function TrackIndexCell({
  isPlaying,
  isThisTrack,
  index,
  context,
}: {
  isPlaying: boolean;
  isThisTrack: boolean;
  index: number;
  context: PlaybackContextSnapshot;
}) {
  if (isPlaying && isThisTrack) {
    return (
      <>
        <div className="group-hover:hidden">
          <WaveForm />
        </div>
        <div className="hidden group-hover:block">
          <RowPlayButton
            context={context}
            className="hidden group-hover:block"
          />
        </div>
      </>
    );
  }
  return (
    <>
      <span className={cn("group-hover:hidden", isThisTrack && "text-primary")}>
        {index + 1}
      </span>
      <RowPlayButton context={context} className="hidden group-hover:block" />
    </>
  );
}
