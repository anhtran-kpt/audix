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
import { useOptimisticPlaylistDelete } from "@/hooks/use-optimistic-playlist-delete";
import { ConfirmDialog } from "./confirm-dialog";

type PlaylistDetailDropdownProps = {
  playlistId: string;
  title: string;
};

export function PlaylistDetailDropdown({
  playlistId,
  title,
}: PlaylistDetailDropdownProps) {
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
            size="xl"
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
              Delete this playlist
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
