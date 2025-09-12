import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "../ui/icon-button";
import {
  BookHeadphonesIcon,
  CirclePlusIcon,
  Disc3Icon,
  EllipsisIcon,
  ListPlusIcon,
  MicVocalIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useOptimisticPlaylistDelete } from "@/hooks/use-optimistic-playlist-delete";
import { ConfirmDialog } from "./confirm-dialog";
import CreditsDialog from "./credits-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { NewPlaylistDialog } from "./new-playlist-dialog";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { RecommendedTrackItem } from "@/features/track/contracts/track-dto";
import { useOptimisticTrackAdd } from "@/hooks/use-optimistic-track-add";
import { getApi } from "@/lib/http/request";
import { UserPlaylist } from "@/features/playlist/contracts/playlist-dto";
import { playlistKeys } from "@/features/playlist/query/playlist-keys";

type TrackDropdownProps = {
  track: RecommendedTrackItem;
  title: string;
};

export function TrackDropdown({ track, title }: TrackDropdownProps) {
  const deletePlaylistMutation = useOptimisticPlaylistDelete();
  const addTrackMutation = useOptimisticTrackAdd();
  const [openConfirm, setOpenConfirm] = useState(false);
  const { data: session, status } = useSession();
  const {
    data: playlists,
    status: queryStatus,
    error,
  } = useQuery({
    enabled: !!track.id,
    queryKey: playlistKeys.playlistsWithoutTrack(track.id),
    queryFn: () =>
      getApi<UserPlaylist[]>(`/playlists?excludeTrackId=${track.id}`),
  });

  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    // deletePlaylistMutation.mutate({ playlistId });
    setOpenConfirm(false);
  };

  if (queryStatus === "error") {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <IconButton
            icon={EllipsisIcon}
            className="text-current"
            tooltipContent={
              <>
                More options for <strong>{title}</strong>
              </>
            }
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-60" align="start">
          <DropdownMenuGroup>
            {status === "authenticated" && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <PlusIcon />
                  Add to playlist
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <Command className="space-y-2">
                      <CommandInput
                        placeholder="Find a playlist"
                        autoFocus={true}
                        className="h-9"
                      />
                      <NewPlaylistDialog />
                      <DropdownMenuSeparator />
                      <CommandList>
                        <CommandEmpty>No playlist found.</CommandEmpty>
                        <CommandGroup>
                          {queryStatus === "pending" ? (
                            <CommandItem>Loading...</CommandItem>
                          ) : (
                            playlists.map((playlist) => (
                              <CommandItem
                                key={playlist.id}
                                value={playlist.id}
                                onSelect={(value) => {
                                  addTrackMutation.mutate({
                                    playlistId: value,
                                    track,
                                  });
                                  setOpen(false);
                                }}
                              >
                                {playlist.title}
                              </CommandItem>
                            ))
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            )}
            <DropdownMenuItem>
              <CirclePlusIcon />
              Save to Liked Songs
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ListPlusIcon />
              Add to queue
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenConfirm(true)}>
              <TrashIcon />
              Remove from this playlist
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <MicVocalIcon />
              Go to artist
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Disc3Icon />
              Go to album
            </DropdownMenuItem>
            <CreditsDialog
              trackId={track.id}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <BookHeadphonesIcon />
                  View credits
                </DropdownMenuItem>
              }
            />
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
