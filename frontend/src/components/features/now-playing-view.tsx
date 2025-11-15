"use client";

import { EllipsisIcon, PanelRightCloseIcon } from "lucide-react";
import { NavLink } from "../ui/nav-link";
import { buildCreditsByPerson } from "@/utils/credits-by-person";
import { ScrollArea } from "../ui/scroll-area";
import CreditDialog from "./credits-dialog";
import { cn } from "@/lib/utils";
import { useRightPanel } from "@/stores/use-right-panel";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { AppImage } from "../shared/app-image";
import { ToggleFollowArtistButton } from "./toggle-follow-artist-button";
import { Button } from "../ui/button";
import { ToggleLikeTrackButton } from "./toggle-like-track-button";
import { CopyLinkButton } from "./copy-link-button";
import { ArtistFollowersBadge } from "./artist-follow-badge";
import { trackQueryOptions } from "@/features/track/track-query-options";

export const NowPlayingView = () => {
  const close = useRightPanel((s) => s.close);
  const { currentTrack, snapshot } = usePlaybackStore(
    useShallow((s) => ({
      currentTrack: s.session?.currentTrack,
      snapshot: s.session?.snapshot,
    }))
  );

  const { data } = useQuery({
    ...trackQueryOptions.trackCredits(currentTrack?.id),
  });

  if (!currentTrack || !snapshot || !data) {
    return null;
  }

  const creditByPerson = buildCreditsByPerson(data.credits);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 left-0 w-full flex items-center justify-between gap-4 px-4 py-5 transition-shadow"
        )}
      >
        <div className="flex items-center [--icon-w:1.25rem]">
          <div className="w-0 overflow-hidden transition-[width] duration-300 group-hover/np:w-[var(--icon-w)] flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={close}
              className="w-[var(--icon-w)] h-[var(--icon-w)] -translate-x-2 group-hover/np:translate-x-0 transition-transform duration-300"
            >
              <PanelRightCloseIcon className="size-5" />
            </Button>
          </div>
          <span className="truncate duration-300 group-hover/np:ml-2 font-semibold">
            {snapshot.name}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="opacity-0 pointer-events-none transition-opacity duration-300 group-hover/np:opacity-100 group-hover/np:pointer-events-auto"
        >
          <EllipsisIcon className="size-5" />
        </Button>
      </header>
      <ScrollArea className="min-h-0 h-full">
        <div className="flex flex-col gap-5 p-4 pt-0">
          <AppImage
            className="object-cover"
            alt={currentTrack.title}
            src={currentTrack.album.imageId}
            fill
            sizes="256px"
          />

          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-semibold text-xl">{currentTrack.title}</p>
              {currentTrack.artists.map((artist, index, originalArr) => (
                <span key={artist.id} className="text-muted-foreground">
                  <NavLink
                    href={`/artists/${artist.id}`}
                    className="text-muted-foreground"
                  >
                    {artist.name}
                  </NavLink>
                  {index < originalArr.length - 1 && ", "}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <CopyLinkButton className="opacity-0 pointer-events-none transition-opacity duration-300 group-hover/np:opacity-100 group-hover/np:pointer-events-auto" />
              <ToggleLikeTrackButton
                track={currentTrack}
                className="text-muted-foreground"
              />
            </div>
          </div>

          <div className="bg-muted rounded-lg overflow-hidden relative">
            <span className="absolute z-10 top-4 left-4 font-semibold text-[calc(15rem/16)] pointer-events-none">
              About the artist
            </span>

            <AppImage
              fill
              className="object-cover brightness-65"
              alt={data.artist.name}
              src={data.artist.bannerId}
              sizes="200px"
              containerClassName="aspect-video"
            />

            <div className="p-4 space-y-3">
              <div>
                <NavLink
                  href={`/artists/${data.artist.id}`}
                  className="font-semibold text-[calc(15rem/16)]"
                >
                  {data.artist.name}
                </NavLink>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <ArtistFollowersBadge
                  artistId={data.artist.id}
                  initialData={data.artist._count.followedBy}
                />
                <ToggleFollowArtistButton
                  artist={{
                    name: data.artist.name,
                    id: data.artist.id,
                    imageId: data.artist.imageId,
                  }}
                />
              </div>
              <p className="text-[calc(13rem/16)] text-muted-foreground line-clamp-3">
                {data.artist.bio}
              </p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-4 w-full">
            <div className="flex justify-between items-center gap-6">
              <span className="font-semibold text-[calc(15rem/16)]">
                Credits
              </span>
              <CreditDialog
                trackId={currentTrack.id}
                trigger={
                  <span className="font-medium text-[calc(13rem/16)] text-muted-foreground hover:text-primary hover:underline underline-offset-2 cursor-pointer">
                    Show all
                  </span>
                }
              />
            </div>

            {creditByPerson.map((credit) => (
              <div
                className="flex items-center justify-between gap-4"
                key={credit.artistId}
              >
                <div className="space-y-1">
                  {credit.artistId ? (
                    <div>
                      <NavLink
                        href={`/artists/${credit.artistId}`}
                        className="text-base"
                      >
                        {credit.displayName}
                      </NavLink>
                    </div>
                  ) : (
                    <p className="text-[calc(15rem/16)] font-medium">
                      {credit.displayName}
                    </p>
                  )}
                  <p className="text-muted-foreground text-[calc(13rem/16)] line-clamp-2">
                    {credit.roles.reduce((acc, role, index) => {
                      if (index < credit.roles.length - 1) {
                        return acc + role.label + ", ";
                      }
                      return acc + role.label;
                    }, "")}
                  </p>
                </div>
                {credit.artistId && (
                  <ToggleFollowArtistButton
                    artist={{
                      name: data.artist.name,
                      id: data.artist.id,
                      imageId: data.artist.imageId,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </>
  );
};
