import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisIcon, ListPlusIcon, TrashIcon } from "lucide-react";
import { useOptimisticPlaylistDelete } from "@/features/playlist/hooks/use-optimistic-playlist-delete";
import { ConfirmDialog } from "./confirm-dialog";
import { Button } from "../ui/button";

type PlaylistDetailDropdownProps = {
  playlistId: string;
  title: string;
  canEdit?: boolean;
};

export function PlaylistDetailDropdown({
  playlistId,
  title,
  canEdit = false,
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
          <Button variant="ghost" size="icon">
            <EllipsisIcon className="size-7" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <ListPlusIcon />
              Add to queue
            </DropdownMenuItem>
            {canEdit && (
              <DropdownMenuItem onClick={() => setOpenConfirm(true)}>
                <TrashIcon />
                Delete this playlist
              </DropdownMenuItem>
            )}
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
