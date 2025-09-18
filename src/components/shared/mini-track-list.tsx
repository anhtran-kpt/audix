"use client";

import { MiniTrackItem } from "@/features/track/contracts/track-dto";
import TrackArtists from "./track-artists";
import { ItemTitle } from "../ui/item-title";
import CoverImage from "./cover-image";
import { TrackDropdown } from "../features/track-dropdown";
import { IconButton } from "../ui/icon-button";
import { useIsPlaying, useNowPlayingRefId } from "@/hooks/use-audio-player";
import { PauseIcon, PlayIcon } from "lucide-react";
import { zCuidType } from "@/features/shared/contracts/shared-dto";

type MiniTrackListProps = {
  tracks: MiniTrackItem[];
  handlePlay: (trackId: zCuidType) => void;
};

export default function MiniTrackList({
  tracks,
  handlePlay,
}: MiniTrackListProps) {
  const isPlaying = useIsPlaying();
  const nowPlayingRefId = useNowPlayingRefId();

  return (
    <ol role="list" className="flex flex-col">
      {tracks.map((track) => (
        <li
          key={track.id}
          className="group/mini-track hover:bg-muted rounded-md flex justify-between p-2 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="relative overflow-hidden rounded-sm aspect-square shrink-0 size-12">
              <CoverImage
                className="group-hover/mini-track:brightness-65"
                alt={track.title}
                src={track.album.imageId}
                fill
                sizes="48px"
              />
              <IconButton
                aria-pressed={nowPlayingRefId === track.id && isPlaying}
                icon={
                  nowPlayingRefId === track.id && isPlaying
                    ? PauseIcon
                    : PlayIcon
                }
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlay(track.id);
                }}
                iconClassName="fill-foreground stroke-0"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover/mini-track:visible"
              />
            </div>
            <div className="flex flex-col gap-0.5 w-full overflow-hidden">
              <ItemTitle
                title={track.title}
                isActive={nowPlayingRefId === track.id}
              />
              <TrackArtists
                isExplicit={track.isExplicit}
                artists={track.artists.map((item) => item.artist)}
              />
            </div>
          </div>
          <div className="flex items-center justify-center opacity-0 select-none group-hover/mini-track:opacity-100 group-hover/mini-track:select-auto transition-opacity">
            <TrackDropdown track={track} />
          </div>
        </li>
      ))}
    </ol>
  );
}
