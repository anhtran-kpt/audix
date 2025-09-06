"use client";

import { ItemTitle } from "../ui/item-title";
import { NavLink } from "../ui/nav-link";
import Explicit from "../ui/explicit";
import { CldImage } from "next-cloudinary";
import { ReactNode } from "react";
import { TrackItem as TrackItemType } from "@/features/track/contracts/track-dto";
import { cn } from "@/lib/utils";

export type TrackItemProps = {
  track: TrackItemType;
  playButton?: ReactNode;
  hasCover?: boolean;
  canHover?: boolean;
  coverSize?: "md" | "lg";
  isActive?: boolean;
};

export default function TrackItem({
  track,
  playButton,
  hasCover = true,
  coverSize = "md",
  isActive = false,
  canHover = true,
}: TrackItemProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3 flex-1 min-w-0",
        canHover && "p-2 group hover:bg-muted rounded-md"
      )}
    >
      {hasCover && (
        <div
          className={cn(
            "relative overflow-hidden rounded-sm aspect-square shrink-0",
            coverSize === "md" ? "size-12" : "size-14"
          )}
        >
          <CldImage
            className={`object-cover ${
              playButton ? "group-hover:brightness-65" : ""
            }`}
            alt={track.title}
            src={track.album.imageId}
            fill
            sizes="48px"
          />
          {playButton}
        </div>
      )}
      <div className="flex flex-col gap-0.5 w-full overflow-hidden">
        <ItemTitle title={track.title} isActive={isActive} />
        <div className="flex items-center text-sm gap-x-1 text-muted-foreground truncate">
          {track.isExplicit && <Explicit />}
          {track.artists.map(({ artist }, index, originalArr) => (
            <span key={artist.id} className="truncate">
              <NavLink href={`/artists/${artist.id}`}>{artist.name}</NavLink>
              {index < originalArr.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
