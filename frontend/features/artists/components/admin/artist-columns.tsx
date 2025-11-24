"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Artist } from "@/features/common/types/entity.type";
import { getSelectColumn } from "@/components/ui/data-table/select-column";
import Link from "next/link";

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
    cell: ({ row }) => {
      const artist = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/artists/${artist.id}`}
                className="flex cursor-pointer items-center"
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete", artist.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
