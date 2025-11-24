"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Genre } from "@/features/common/types/entity.type";
import { getSelectColumn } from "@/components/data-table/select-column";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Genre>[] = [
  getSelectColumn<Genre>(),
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const artist = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{artist.name}</span>
          <span className="text-xs text-muted-foreground">{artist.slug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "songs",
    header: "Songs Count",
    cell: ({ row }) => <span>{row.original.songs?.length ?? 0}</span>,
  },
  {
    accessorKey: "albums",
    header: "Albums Count",
    cell: ({ row }) => <span>{row.original.albums?.length ?? 0}</span>,
  },
  {
    accessorKey: "artists",
    header: "Artists Count",
    cell: ({ row }) => <span>{row.original.artists?.length ?? 0}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
