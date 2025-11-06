"use client";

import { ToggleLikeTrackButton } from "@/components/features/toggle-like-track-button";
import { TrackDropdownDetails } from "@/components/features/track-dropdown-details";
import { TrackIndexCell } from "@/components/features/track-list/track-index-cell";
import { TrackItemInfo } from "@/components/shared/track-item-info";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import { Clock3Icon } from "lucide-react";

export const columns: ColumnDef<TrackItem>[] = [
  {
    accessorKey: "index",
    header: () => <div className="text-center">#</div>,
    meta: {
      headerClassName: "w-12",
      cellClassName: "w-12",
    },
    cell: ({ row }) => {
      const track = row.original;
      return (
        <TrackIndexCell
          context={{
            contextId: track.album.id,
            contextType: "ALBUM",
            startTrackId: track.id,
          }}
          trackId={track.id}
          index={row.index}
        />
      );
    },
  },
  {
    accessorKey: "title",
    header: () => <div className="text-left">Title</div>,
    cell: ({ row }) => {
      const track = row.original;
      return (
        <div className="group flex items-center justify-between gap-4 min-w-0 w-full">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <TrackItemInfo
              title={track.title}
              isExplicit={track.isExplicit}
              artists={track.artists}
              context={{
                contextId: track.album.id,
                contextType: "ALBUM",
                startTrackId: track.id,
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "plays",
    header: () => <div className="flex justify-end items-center">Plays</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end items-center text-current">
          {row.original.playCount}
        </div>
      );
    },
  },
  {
    accessorKey: "like",
    header: "",
    cell: ({ row }) => {
      return (
        <div
          className={cn(
            "flex justify-end items-center",
            "select-none opacity-0 sm:group-hover/table-row:select-auto sm:group-hover/table-row:opacity-100",
            row.original.isLiked && "select-auto opacity-100"
          )}
        >
          <ToggleLikeTrackButton track={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: () => (
      <div className="flex justify-end items-center">
        <Clock3Icon className="size-4" />
      </div>
    ),
    meta: {
      headerClassName: "w-14",
      cellClassName: "w-14",
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-end items-center text-current">
          {formatDuration(row.original.duration)}
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "",
    meta: {
      headerClassName: "w-12",
      cellClassName: "w-12",
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-end items-center select-none sm:opacity-0 group-hover/table-row:select-auto group-hover/table-row:opacity-100 sm:pr-2">
          <TrackDropdownDetails
            track={row.original}
            contextId={row.original.album.id}
            contextType="ALBUM"
            canEdit={false}
          />
        </div>
      );
    },
  },
];
