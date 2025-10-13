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
import { EllipsisIcon, PlusIcon } from "lucide-react";
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
import { TrackItem } from "@/features/track/contracts/track-dto";
import { useAddTrackToPlaylist } from "@/features/playlist/hooks/use-add-track-to-playlist";
import { useRemoveTrackFromPlaylist } from "@/features/playlist/hooks/use-remove-track-from-playlist";
import { useRouter } from "next/navigation";
import { useNewPlaylistDialog } from "@/stores/use-new-playlist-dialog";
import { myPlaylistsOptions } from "@/features/me/api/me-options";

type TrackDropdownDetailsProps = {
  track: TrackItem;
  contextId: string;
  contextType: "ALBUM" | "PLAYLIST" | "ARTIST";
};

export function TrackDropdownDetails({
  track,
  contextId,
  contextType,
}: TrackDropdownDetailsProps) {
  const removeTrackMutation = useRemoveTrackFromPlaylist();
  const addTrackMutation = useAddTrackToPlaylist();
  const { openDialog } = useNewPlaylistDialog();
  const { status } = useSession();
  const {
    data: playlists,
    status: queryStatus,
    error,
  } = useQuery({
    ...myPlaylistsOptions(),
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
                <DropdownMenuSubTrigger>Add to playlist</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <Command className="space-y-2">
                      <CommandInput
                        placeholder="Find a playlist"
                        autoFocus={true}
                        className="h-9"
                      />
                      <CommandItem onSelect={openDialog}>
                        <PlusIcon className="text-foreground" />
                        Create new playlist
                      </CommandItem>
                      <CommandList>
                        <CommandEmpty>No playlist found.</CommandEmpty>
                        <CommandGroup>
                          {queryStatus === "pending" ? (
                            <CommandItem>Loading...</CommandItem>
                          ) : (
                            playlists.map((playlist) => (
                              <CommandItem
                                key={playlist.id}
                                value={playlist.title}
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
            <DropdownMenuItem>Save to Liked Songs</DropdownMenuItem>
            <DropdownMenuItem>Add to queue</DropdownMenuItem>
            {contextType === "PLAYLIST" && (
              <DropdownMenuItem
                onClick={() =>
                  removeTrackMutation.mutate({
                    playlistId: contextId,
                    trackId: track.id,
                  })
                }
              >
                Remove from this playlist
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Go to artist</DropdownMenuSubTrigger>
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
            {contextType !== "ALBUM" && (
              <DropdownMenuItem
                onClick={() => router.push(`/albums/${track.album.id}`)}
              >
                Go to album
              </DropdownMenuItem>
            )}
            <CreditsDialog
              trackId={track.id}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
