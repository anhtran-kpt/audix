"use client";

import { ColumnDef } from "@tanstack/react-table";
import { GenreEntity } from "@/features/common/types/entity.type";
import { getSelectColumn } from "@/components/data-table/select-column";
import { CellAction } from "./cell-action";
import { format } from "date-fns";

export const columns: ColumnDef<GenreEntity>[] = [
  getSelectColumn<GenreEntity>(),
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
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => format(new Date(row.original.createdAt), "dd/MM/yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
