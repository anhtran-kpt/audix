import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "../ui/icon-button";
import { EllipsisIcon, ListPlusIcon, TrashIcon } from "lucide-react";
import { useOptimisticPlaylistDelete } from "@/features/playlist/hooks/use-optimistic-playlist-delete";
import { ConfirmDialog } from "./confirm-dialog";

type SidebarPlaylistDropdownProps = {
  playlistId: string;
  title: string;
};

export default function SidebarPlaylistDropdown({
  playlistId,
  title,
}: SidebarPlaylistDropdownProps) {
  const deletePlaylistMutation = useOptimisticPlaylistDelete();
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDelete = () => {
    deletePlaylistMutation.mutate({ playlistId });
    setOpenConfirm(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            icon={EllipsisIcon}
            tooltipContent={
              <>
                More options for <strong>{title}</strong>
              </>
            }
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <ListPlusIcon />
              Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenConfirm(true)}>
              <TrashIcon />
              Delete playlist
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title="Delete this playlist?"
        description={
          <>
            This action cannot be undone. Playlist <strong>{title}</strong> will
            be permanently deleted.
          </>
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />
    </>
  );
}
