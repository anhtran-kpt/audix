"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { cn } from "@/lib/utils";
import { usePlayContext } from "@/hooks/use-play-context";
import WaveForm from "../ui/wave-form";

type MiniPlayContextButtonProps = {
  context: StartPlaybackInput;
  className?: string;
};

export const MiniPlayContextButton = ({
  context,
  className,
}: MiniPlayContextButtonProps) => {
  const { handlePlay, isThisContext, isPlaying, isThisTrack } =
    usePlayContext(context);

  let element;

  if (isThisContext) {
    if (isPlaying) {
      if (isThisTrack) {
        element = (
          <>
            <div className="">
              <WaveForm />
            </div>
            <PauseIcon className="hidden group-hover/item:hover:block size-4 fill-foreground stroke-0" />
          </>
        );
      } else {
        element = (
          <PlayIcon className="hidden group-hover/item:flex size-4 fill-foreground stroke-0" />
        );
      }
    } else {
      element = (
        <PlayIcon className="hidden group-hover/item:flex size-4 fill-foreground stroke-0" />
      );
    }
  } else {
    element = (
      <PlayIcon className="hidden group-hover/item:flex size-4 fill-foreground stroke-0" />
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      className={cn("cursor-pointer", className)}
    >
      {element}
      {/* {isThisContext && isPlaying ? (
        <PauseIcon className="size-4 fill-foreground stroke-0" />
      ) : (
        <PlayIcon className="size-4 fill-foreground stroke-0" />
      )} */}
    </button>
  );
};
