"use client";

import { EllipsisIcon, Maximize2Icon, PanelRightCloseIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useCurrentTrack, usePlaybackContext } from "@/hooks/use-audio-player";
import { CoverImage } from "../ui/cover-image";
import { NavLink } from "../ui/nav-link";
import { FollowButton } from "./follow-button";
import { buildCreditsByPerson } from "@/lib/helpers/build-credits-by-person";
import { ScrollArea } from "../ui/scroll-area";
import CreditDialog from "./credit-dialog";

export default function NowPlayingView() {
  const playbackContext = usePlaybackContext();
  const currentTrack = useCurrentTrack();

  if (!currentTrack) {
    return null;
  }

  const creditByPerson = buildCreditsByPerson({
    artists: currentTrack.artists,
    credits: currentTrack.credits,
  });

  return (
    <ScrollArea
      className="h-full min-h-0 group/np"
      style={{
        paddingBottom:
          "calc(env(safe-area-inset-bottom) + var(--player-offset, 0px))",
      }}
    >
      <aside className="w-2xs py-5 px-4 bg-sidebar flex flex-col gap-5">
        <header className="flex justify-between items-center gap-4 overflow-hidden">
          <div className="flex items-center [--icon-w:1.25rem]">
            <div className="w-0 overflow-hidden transition-[width] duration-300 group-hover/np:w-[var(--icon-w)] flex items-center">
              <IconButton
                icon={PanelRightCloseIcon}
                className="w-[var(--icon-w)] h-[var(--icon-w)] -translate-x-2 group-hover/np:translate-x-0 transition-transform duration-300"
                aria-label="Close right panel"
                tooltipContent="Hide now playing view"
              />
            </div>
            <h3 className="truncate duration-300 group-hover/np:ml-2 font-semibold">
              {playbackContext?.name ?? "Rap"}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <IconButton
              icon={EllipsisIcon}
              tooltipContent={
                <>
                  More options for <strong>{currentTrack.title}</strong>
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
        <CoverImage
          alt={currentTrack.title}
          src={currentTrack.album.imageId}
          size="xl"
        />
        <div className="">
          <p className="font-semibold text-xl">{currentTrack.title}</p>
          {currentTrack.artists.map(({ artist }, index, originalArr) => (
            <span key={artist.id}>
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

        <div className="bg-muted rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-center gap-6">
            <span className="font-semibold text-[calc(15rem/16)]">Credits</span>
            <CreditDialog
              trackTitle={currentTrack.title}
              artists={currentTrack.artists}
              credits={currentTrack.credits}
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
      </aside>
    </ScrollArea>
  );
}
