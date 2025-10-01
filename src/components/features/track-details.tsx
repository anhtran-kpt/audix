"use client";

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
import CreditsDialog from "./credits-dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { TrackItemCompact } from "@/features/track/contracts/track-dto";
import { useOptimisticTrackAdd } from "@/hooks/use-optimistic-track-add";
import { getApi } from "@/lib/http/request";
import { UserPlaylist } from "@/features/playlist/contracts/playlist-dto";
import { playlistKeys } from "@/features/playlist/query/playlist-keys";
import { useOptimisticTrackRemove } from "@/hooks/use-optimistic-track-remove";
import { useRouter } from "next/navigation";
import { useNewPlaylistDialog } from "@/stores/use-new-playlist-dialog";

type TrackDetailsProps = {
  track: TrackItemCompact;
  playlistId?: string;
};

export function TrackDetails({ track, playlistId }: TrackDetailsProps) {
  const removeTrackMutation = useOptimisticTrackRemove();
  const addTrackMutation = useOptimisticTrackAdd();
  const { openDialog } = useNewPlaylistDialog();
  const { status } = useSession();
  const {
    data: playlists,
    status: queryStatus,
    error,
  } = useQuery({
    enabled: !!track.id,
    queryKey: playlistKeys.userPlaylists(track.id),
    queryFn: () => getApi<UserPlaylist[]>(`/me/playlists?trackId=${track.id}`),
  });

  const [open, setOpen] = useState(false);
  const router = useRouter();

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
                More options for <strong>{track.title}</strong>
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

                      <IconButton
                        icon={PlusIcon}
                        aria-label="New playlist"
                        tooltipContent="New playlist"
                        iconClassName="size-6"
                        onClick={openDialog}
                      />

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
                                disabled={playlist.hasTrack}
                                onSelect={(value) => {
                                  addTrackMutation.mutate({
                                    playlistId: value,
                                    track,
                                  });
                                  setOpen(false);
                                }}
                              >
                                {playlist.title}{" "}
                                {playlist.hasTrack && "(already added)"}
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
            {playlistId && (
              <DropdownMenuItem
                onClick={() =>
                  removeTrackMutation.mutate({
                    playlistId,
                    trackId: track.id,
                  })
                }
              >
                <TrashIcon />
                Remove from this playlist
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <MicVocalIcon />
                Go to artist
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {track.artists.map((artist) => (
                    <DropdownMenuItem
                      key={artist.id}
                      onClick={() => router.push(`/artists/${artist.id}`)}
                    >
                      {artist.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => router.push(`/albums/${track.album.id}`)}
            >
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
    </>
  );
}
