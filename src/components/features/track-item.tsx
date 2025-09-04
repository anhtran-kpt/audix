"use client";

import { ItemTitle } from "../ui/item-title";
import { useNowPlayingRefId } from "@/hooks/use-audio-player";
import { NavLink } from "../ui/nav-link";
import Explicit from "../ui/explicit";
import { CldImage } from "next-cloudinary";
import { ReactNode } from "react";
import { TrackItem as TrackItemType } from "@/features/track/contracts/track-dto";

export type TrackItemProps = {
  track: TrackItemType;
  playButton?: ReactNode;
  hideCoverImage?: boolean;
};

export default function TrackItem({
  track,
  playButton,
  hideCoverImage = false,
}: TrackItemProps) {
  const nowPlayingRefId = useNowPlayingRefId();

  return (
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {!hideCoverImage && (
        <div className="relative overflow-hidden rounded-sm aspect-square shrink-0 size-12">
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
        <ItemTitle
          title={track.title}
          isActive={nowPlayingRefId === track.id}
        />
        <div className="flex items-center text-sm gap-x-1 text-muted-foreground truncate">
          {track.isExplicit && <Explicit />}
          {track.artists.map(({ artist }, index, originalArr) => (
            <span key={artist.id}>
              <NavLink href={`/artists/${artist.id}`}>{artist.name}</NavLink>
              {index < originalArr.length - 1 && ", "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
