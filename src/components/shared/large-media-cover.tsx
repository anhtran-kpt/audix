"use client";

import { CldImageProps } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import CoverImage from "./cover-image";
import { usePlayTrackButton } from "@/hooks/use-play-track-button";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";
import { Button } from "../ui/button";
import { PauseIcon, PlayIcon } from "lucide-react";

interface LargeMediaCoverProps extends CldImageProps {
  context: StartPlaybackInput;
}

export default function LargeMediaCover({
  context,
  ...props
}: LargeMediaCoverProps) {
  const router = useRouter();
  const { handlePlay, isPlaying } = usePlayTrackButton();

  return (
    <div
      className={cn(
        "relative overflow-hidden aspect-square shrink-0 w-full cursor-pointer",
        context.contextType === "ARTIST" ? "rounded-full" : "rounded-sm"
      )}
      // onClick={() =>
      //   router.push(
      //     `/${context.contextType.toLowerCase()}s/${context.contextIdOrQuery}`
      //   )
      // }
    >
      <CoverImage
        className="transition-all group-hover/large-cover:brightness-65 group-hover/large-cover:scale-105"
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        {...props}
      />
      {/* {context && (
        <ContextPlayButton
          context={context}
          className="absolute bottom-2 right-2 opacity-0 translate-y-2 scale-95 transition-all duration-400 group-hover/large-cover:opacity-100 group-hover/large-cover:translate-y-0 group-hover/large-cover:scale-100"
        />
      )} */}
      <Button
        onClick={() => handlePlay(context)}
        className="absolute bottom-2 right-2 opacity-0 translate-y-2 scale-95 transition-all duration-400 group-hover/large-cover:opacity-100 group-hover/large-cover:translate-y-0 group-hover/large-cover:scale-100"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </div>
  );
}
