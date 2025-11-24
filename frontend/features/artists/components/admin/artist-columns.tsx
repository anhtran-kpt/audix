"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Artist } from "@/features/common/types/entity.type";
import { getSelectColumn } from "@/components/data-table/select-column";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Artist>[] = [
  getSelectColumn<Artist>(),
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const artist = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={artist.avatarUrl || ""} />
            <AvatarFallback>{artist.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{artist.name}</span>
            <span className="text-xs text-muted-foreground">{artist.slug}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "followersCount",
    header: "Followers",
    cell: ({ row }) => (
      <span>{row.original.followersCount.toLocaleString()}</span>
    ),
  },
  {
    accessorKey: "songs",
    header: "Songs Count",
    cell: ({ row }) => <span>{row.original.songs?.length ?? 0}</span>,
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
