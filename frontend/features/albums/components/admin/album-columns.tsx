"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Album } from "@/features/common/types/entity.type";
import { getSelectColumn } from "@/components/data-table/select-column";
import { CellAction } from "./cell-action";
import { formatAlbumDuration } from "@/features/common/utils/format-duration";

export const columns: ColumnDef<Album>[] = [
  getSelectColumn<Album>(),
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const album = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={album.thumbnailUrl || ""} />
            <AvatarFallback>{album.title[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{album.title}</span>
            <span className="text-xs text-muted-foreground">{album.slug}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => <span>{row.original.artist?.name}</span>,
  },
  {
    accessorKey: "songsCount",
    header: "Songs Count",
    cell: ({ row }) => <span>{row.original.songsCount.toLocaleString()}</span>,
  },
  {
    accessorKey: "totalDuration",
    header: "Total Duration",
    cell: ({ row }) => (
      <span>{formatAlbumDuration(row.original.totalDuration)}</span>
    ),
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
