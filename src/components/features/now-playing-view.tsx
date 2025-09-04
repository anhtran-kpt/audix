"use client";

import {
  CopyIcon,
  EllipsisIcon,
  Maximize2Icon,
  PanelRightCloseIcon,
  PlusCircleIcon,
} from "lucide-react";
import { IconButton } from "../ui/icon-button";
import {
  useNowPlayingRefId,
  usePlaybackContext,
} from "@/hooks/use-audio-player";
import { NavLink } from "../ui/nav-link";
import { FollowButton } from "./follow-button";
import { buildCreditsByPerson } from "@/lib/helpers/build-credits-by-person";
import { ScrollArea } from "../ui/scroll-area";
import CreditDialog from "./credit-dialog";
import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";
import { useRightPanel } from "@/stores/use-right-panel";
import { FollowersBadge } from "./follow-badge";
import { useNowPlayingTrack } from "@/features/track/hooks/use-tracks";

export default function NowPlayingRefView() {
  const close = useRightPanel((s) => s.close);

  const playbackContext = usePlaybackContext();
  const nowPlayingRefId = useNowPlayingRefId();
  const { data: nowPlayingTrack } = useNowPlayingTrack(nowPlayingRefId);

  if (!nowPlayingTrack) {
    return null;
  }

  const creditByPerson = buildCreditsByPerson({
    artists: nowPlayingTrack.artists,
    credits: nowPlayingTrack.credits,
  });

  return (
    <>
      <header
        className={cn(
          "sticky top-0 left-0 w-full flex items-center justify-between gap-4 px-4 py-5 transition-shadow"
        )}
      >
        <div className="flex items-center [--icon-w:1.25rem]">
          <div className="w-0 overflow-hidden transition-[width] duration-300 group-hover/np:w-[var(--icon-w)] flex items-center">
            <IconButton
              icon={PanelRightCloseIcon}
              className="w-[var(--icon-w)] h-[var(--icon-w)] -translate-x-2 group-hover/np:translate-x-0 transition-transform duration-300"
              aria-label="Close panel"
              tooltipContent="Hide now playing view"
              onClick={close}
            />
          </div>
          <span className="truncate duration-300 group-hover/np:ml-2 font-semibold">
            {playbackContext?.name}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <IconButton
            icon={EllipsisIcon}
            tooltipContent={
              <>
                More options for <strong>{nowPlayingTrack.title}</strong>
              </>
            }
            className="opacity-0 pointer-events-none transition-opacity duration-300 group-hover/np:opacity-100 group-hover/np:pointer-events-auto"
          />
          <IconButton
            icon={Maximize2Icon}
            tooltipContent={<>Expand now playing view</>}
            className="opacity-0 pointer-events-none transition-opacity duration-300 group-hover/np:opacity-100 group-hover/np:pointer-events-auto"
          />
        </div>
      </header>
      <ScrollArea className="min-h-0 h-full">
        <div className="flex flex-col gap-5 p-4 pt-0">
          <div className="relative overflow-hidden rounded-md aspect-square shrink-0">
            <CldImage
              className="object-cover"
              alt={nowPlayingTrack.title}
              src={nowPlayingTrack.album.imageId}
              fill
              sizes="256px"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-xl">{nowPlayingTrack.title}</p>
              {nowPlayingTrack.artists.map(({ artist }, index, originalArr) => (
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
              <IconButton
                icon={CopyIcon}
                tooltipContent={<>Copy link to song</>}
                className="opacity-0 pointer-events-none transition-opacity duration-300 group-hover/np:opacity-100 group-hover/np:pointer-events-auto"
              />
              <IconButton
                icon={PlusCircleIcon}
                tooltipContent={
                  <>
                    Add to <strong>Liked Songs</strong>
                  </>
                }
              />
            </div>
          </div>

          <div className="bg-muted rounded-lg overflow-hidden relative">
            <span className="absolute z-10 top-4 left-4 font-semibold text-[calc(15rem/16)] pointer-events-none">
              About the artist
            </span>
            <div className="relative aspect-video">
              <CldImage
                fill
                className="object-cover brightness-65"
                alt={nowPlayingTrack.album.artist.name}
                src={nowPlayingTrack.album.artist.bannerId}
                sizes="(min-width: 768px) 768px, 100vw"
              />
            </div>
            <div className="p-4 space-y-3">
              <div>
                <NavLink
                  href={`/artists/${nowPlayingTrack.album.artist.id}`}
                  className="font-semibold text-base"
                >
                  {nowPlayingTrack.album.artist.name}
                </NavLink>
              </div>
              <div className="flex items-center gap-4 justify-between">
                <FollowersBadge artistId={nowPlayingTrack.album.artist.id} />
                <FollowButton artistId={nowPlayingTrack.album.artist.id} />
              </div>
              <p className="text-[calc(13rem/16)] text-muted-foreground line-clamp-3">
                {nowPlayingTrack.album.artist.bio}
              </p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-4 w-full">
            <div className="flex justify-between items-center gap-6">
              <span className="font-semibold text-[calc(15rem/16)]">
                Credits
              </span>
              <CreditDialog
                trackTitle={nowPlayingTrack.title}
                artists={nowPlayingTrack.artists}
                credits={nowPlayingTrack.credits}
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
                        className="text-[calc(15rem/16)]"
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
                {credit.artistId && <FollowButton artistId={credit.artistId} />}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
