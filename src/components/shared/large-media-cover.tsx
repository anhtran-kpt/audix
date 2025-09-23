"use client";

import { CldImageProps } from "next-cloudinary";
import { cn } from "@/lib/utils";
import CoverImage from "./cover-image";
import { PlaybackContextSnapshot } from "@/features/playback/contracts/playback-dto";
import { ContextPlayButton } from "./context-play-button";
import { useRouter } from "next/navigation";

interface LargeMediaCoverProps extends CldImageProps {
  context: PlaybackContextSnapshot;
}

export default function LargeMediaCover({
  context,
  ...props
}: LargeMediaCoverProps) {
  const router = useRouter();

  const isArtist = context.contextType === "ARTIST";

  return (
    <div
      className="relative aspect-square shrink-0 w-full cursor-pointer group/large-cover"
      onClick={() =>
        router.push(
          `/${context.contextType.toLowerCase()}s/${context.contextIdOrQuery}`
        )
      }
    >
      <div
        className={cn(
          "size-full overflow-hidden relative",
          isArtist ? "rounded-full" : "rounded-sm"
        )}
      >
        <CoverImage
          className="transition-all duration-400 group-hover/large-cover:brightness-65 group-hover/large-cover:scale-105"
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          {...props}
        />
      </div>

      <ContextPlayButton
        context={context}
        className="absolute opacity-0 bottom-2 right-2 translate-y-2 scale-95 transition-all duration-400 group-hover/large-cover:opacity-100 group-hover/large-cover:translate-y-0 group-hover/large-cover:scale-100"
      />
    </div>
  );
}
