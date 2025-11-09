"use client";

import { TrackDropdownDetails } from "@/components/features/track-dropdown-details";
import { TrackIndexCell } from "@/components/features/track-index-cell";
import { AppImage } from "@/components/shared/app-image";
import { TrackItemInfo } from "@/components/shared/track-item-info";
import { NavLink } from "@/components/ui/nav-link";
import { TrackItem } from "@/features/track/contracts/track-dto";
import { formatDuration } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns/format";
import { Clock3Icon } from "lucide-react";
import { TrackLikeCell } from "../../track-like-cell";

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
            <AppImage
              src={track.album.imageId}
              alt={track.title}
              containerClassName="size-12"
              sizes="48px"
            />
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
    accessorKey: "album",
    header: () => <div className="flex justify-start items-center">Album</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-start items-center">
          <NavLink href={`/albums/${row.original.album.id}`}>
            {row.original.album.title}
          </NavLink>
        </div>
      );
    },
  },
  {
    accessorKey: "dateAdded",
    header: () => (
      <div className="flex justify-start items-center">Date added</div>
    ),
    meta: {
      headerClassName: "w-36",
      cellClassName: "w-36",
    },
    cell: ({ row }) => {
      return (
        <div className="flex justify-start items-center">
          {row.original.addedAt
            ? format(new Date(row.original.addedAt), "PP")
            : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "like",
    header: "",
    meta: {
      headerClassName: "w-14",
      cellClassName: "w-14",
    },
    cell: ({ row }) => {
      return <TrackLikeCell track={row.original} />;
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
