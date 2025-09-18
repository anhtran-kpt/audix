"use client";

import { CldImage, CldImageProps } from "next-cloudinary";
import { useState } from "react";
import { ContextPlayButton } from "../features/context-play-button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LargeMediaCoverProps extends CldImageProps {
  context: {
    type: "ALBUM" | "PLAYLIST" | "ARTIST";
    contextId: string;
  };
}

export default function LargeMediaCover({
  context,
  ...props
}: LargeMediaCoverProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  return (
    <div
      className={cn(
        "relative overflow-hidden aspect-square shrink-0 w-full cursor-pointer",
        context.type === "ARTIST" ? "rounded-full" : "rounded-sm"
      )}
      onClick={() =>
        router.push(`/${context.type.toLowerCase()}s/${context.contextId}`)
      }
    >
      <CldImage
        className="object-cover transition-all duration-400 group-hover/large-cover:brightness-65 group-hover/large-cover:scale-105"
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
      {context && (
        <ContextPlayButton
          context={context}
          className="absolute bottom-2 right-2 opacity-0 translate-y-2 scale-95 transition-all duration-400 group-hover/large-cover:opacity-100 group-hover/large-cover:translate-y-0 group-hover/large-cover:scale-100"
        />
      )}
    </div>
  );
}
