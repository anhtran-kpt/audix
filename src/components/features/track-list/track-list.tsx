"use client";

import { AppImage } from "@/components/shared/app-image";
import { TrackItemInfo } from "@/components/shared/track-item-info";
import { IconButton } from "@/components/ui/icon-button";
import { NavLink } from "@/components/ui/nav-link";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/utils/date";
import { format } from "date-fns/format";
import { Clock3Icon, PlusCircleIcon } from "lucide-react";
import { TrackIndexCell } from "./track-index-cell";
import { TrackDropdownDetails } from "../track-dropdown-details";

type TrackListProps = {
  tracks: TrackItem[];
  contextId: string;
  contextType: "PLAYLIST" | "ALBUM" | "ARTIST" | "SEARCH";
  isLoading: boolean;
  canEdit?: boolean;
};

export const TrackList = ({
  tracks,
  contextId,
  contextType,
  isLoading = true,
  canEdit = false,
}: TrackListProps) => {
  const gridCols: Record<TrackListProps["contextType"], string> = {
    PLAYLIST:
      "grid-cols-[1fr_3rem_3rem] sm:grid-cols-[2rem_1fr_6rem_3rem_3rem] md:grid-cols-[2rem_minmax(12rem,1fr)_0.7fr_3rem_3rem_3rem] xl:grid-cols-[2rem_minmax(12rem,1fr)_1fr_8rem_3rem_3rem_3rem]",
    ALBUM:
      "grid-cols-[1fr_3rem_3rem] sm:grid-cols-[2rem_1fr_6rem_3rem_3rem] md:grid-cols-[2rem_minmax(12rem,1fr)_12rem_6rem_3rem_3rem]",
    ARTIST:
      "grid-cols-[1.5rem_1fr_3rem_3rem] sm:grid-cols-[2rem_1fr_6rem_3rem_3rem] md:grid-cols-[2rem_minmax(12rem,1fr)_12rem_6rem_3rem_3rem]",
    SEARCH:
      "grid-cols-[1fr_3rem_3rem] sm:grid-cols-[2rem_1fr_6rem_3rem_3rem] md:grid-cols-[2rem_minmax(12rem,1fr)_0.6fr_3rem_3rem_3rem] xl:grid-cols-[2rem_minmax(12rem,1fr)_0.7fr_3rem_3rem_3rem]",
  };

  if (isLoading) {
    return (
      <ul role="list" className="flex flex-col gap-3 sm:gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <li
            key={index}
            className="grid grid-cols-[1.5rem_1fr_3rem_2rem] sm:grid-cols-[1.5rem_1fr_3rem_4rem_2rem] md:grid-cols-[1.5rem_minmax(12rem,1fr)_12rem_3rem_4rem_2rem] gap-2 rounded-sm"
          >
            <Skeleton className="h-16 w-2/3 rounded-sm" />
            <Skeleton className="h-16 w-96 rounded-sm" />
            <Skeleton className="hidden md:block h-16 w-2/3 rounded-sm" />
            <Skeleton className="h-16 w-6 rounded-sm" />
            <Skeleton className="hidden sm:block h-16 w-8 rounded-sm" />
            <Skeleton className="h-16 w-6 rounded-sm" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {contextType !== "ARTIST" && (
        <div
          className={cn(
            "hidden sm:grid gap-2 items-center p-2 text-muted-foreground border-b mb-4",
            gridCols[contextType]
          )}
        >
          <div className="text-center">#</div>
          <div>Title</div>
          {contextType !== "PLAYLIST" && contextType !== "SEARCH" && (
            <div className="hidden md:flex justify-end items-center">Plays</div>
          )}
          {contextType === "PLAYLIST" && (
            <>
              <div className="hidden md:flex justify-start items-center">
                Album
              </div>
              <div className="hidden xl:flex justify-start items-center">
                Date added
              </div>
            </>
          )}
          {contextType === "SEARCH" && (
            <div className="hidden md:flex justify-start items-center">
              Album
            </div>
          )}
          <div className="flex justify-end items-center col-span-2">
            <Clock3Icon className="size-4" />
          </div>
        </div>
      )}
      <ul role="list" className="flex flex-col gap-3 sm:gap-1">
        {tracks.map((track, index) => (
          <li
            key={track.id}
            className={cn(
              "grid gap-2 items-center sm:p-2 group/item sm:hover:bg-muted rounded-sm text-muted-foreground hover:text-foreground",
              gridCols[contextType]
            )}
          >
            <TrackIndexCell
              context={{ contextId, contextType, startTrackId: track.id }}
              index={index}
            />
            <div className="group flex items-center justify-between gap-4 min-w-0 w-full">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {contextType !== "ALBUM" && (
                  <AppImage
                    src={track.album.imageId}
                    alt={track.title}
                    containerClassName="size-12"
                    sizes="48px"
                  />
                )}
                <TrackItemInfo
                  title={track.title}
                  isExplicit={track.isExplicit}
                  artists={track.artists}
                  context={{ contextId, contextType, startTrackId: track.id }}
                />
              </div>
            </div>
            {contextType !== "PLAYLIST" && contextType !== "SEARCH" && (
              <div className="hidden md:flex justify-end items-center">
                {track.playCount}
              </div>
            )}
            {contextType === "PLAYLIST" && (
              <>
                <div className="hidden md:flex justify-start items-center">
                  <NavLink href={`/albums/${track.album.id}`}>
                    {track.album.title}
                  </NavLink>
                </div>
                <div className="hidden xl:flex justify-start items-center">
                  {format(new Date(), "PP")}
                </div>
              </>
            )}
            {contextType === "SEARCH" && (
              <div className="hidden md:flex justify-start items-center">
                <NavLink href={`/albums/${track.album.id}`}>
                  {track.album.title}
                </NavLink>
              </div>
            )}
            <div className="flex justify-end items-center select-none opacity-0 group-hover/item:select-auto group-hover/item:opacity-100">
              <IconButton icon={PlusCircleIcon} />
            </div>
            <div className="hidden sm:flex justify-end items-center">
              {formatDuration(track.duration)}
            </div>
            <div className="flex justify-end items-center select-none opacity-0 group-hover/item:select-auto group-hover/item:opacity-100 sm:pr-2">
              <TrackDropdownDetails
                track={track}
                contextId={contextId}
                contextType={contextType}
                canEdit={canEdit}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
