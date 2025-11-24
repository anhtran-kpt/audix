"use client";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Album } from "@/features/common/types/entity.type";
import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { useDeleteAlbum } from "../../hooks/admin/use-delete-album";

interface CellActionProps {
  data: Album;
}

export const CellAction = ({ data }: CellActionProps) => {
  const confirmModal = useConfirmModal();

  const { deleteAlbum } = useDeleteAlbum();

  const onDelete = () => {
    confirmModal.onOpen({
      title: "Are you sure?",
      description:
        "This action cannot be undone. This will permanently delete the album and remove their data from our servers.",
      onConfirm: async () => {
        await deleteAlbum(data.id);
      },
    });
  };

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
            href={`/admin/Albums/${data.id}`}
            className="flex cursor-pointer items-center"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
