"use client";

import { cn } from "@/lib/utils";
import { CldImage, CldImageProps } from "next-cloudinary";
import { ReactNode, useState } from "react";
import { ContextPlayButton } from "./context-play-button";
import { RowPlayButton } from "./row-play-button";

interface SquareImageProps extends CldImageProps {
  variant: "large" | "small";
  context: {
    type: "ALBUM" | "PLAYLIST";
    contextId: string;
  };
  playBtn?: ReactNode;
}

export default function SquareImage({
  context,
  variant,
  onLoad,
  ...props
}: SquareImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad: NonNullable<CldImageProps["onLoad"]> = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  if (variant === "small") {
    return (
      <div className="relative overflow-hidden rounded-sm aspect-square shrink-0 size-12">
        <CldImage
          className={cn(
            "object-cover transition-opacity duration-400 group-hover/square-image:brightness-75"
          )}
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          style={{ opacity: isLoaded ? 1 : 0 }}
          onLoad={handleLoad}
          {...props}
        />
        {context && <RowPlayButton context={context} buttonType="outside" />}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-sm aspect-square shrink-0 size-56">
      <CldImage
        className={cn(
          "object-cover transition-opacity duration-400 group-hover/square-image:brightness-75"
        )}
        fill
        sizes="(max-width: 640px) 100vw, 640px"
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={handleLoad}
        {...props}
      />
      {context && (
        <ContextPlayButton
          context={context}
          className={cn(
            "absolute bottom-2 right-2",
            "opacity-0 translate-y-2 scale-95",
            "transition-all duration-300",
            "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          )}
        />
      )}
    </div>
  );
}
