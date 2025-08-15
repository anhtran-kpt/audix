"use client";

import { EllipsisIcon, Maximize2Icon, PanelRightCloseIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useCurrentTrack, usePlaybackContext } from "@/hooks/use-audio-player";
import { CoverImage } from "../ui/cover-image";
import { NavLink } from "../ui/nav-link";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog, DialogTrigger } from "../ui/dialog";

export default function NowPlayingView() {
  const playbackContext = usePlaybackContext();
  const currentTrack = useCurrentTrack();

  if (!currentTrack) {
    return null;
  }

  return (
    <aside className="w-3xs p-5 group/np bg-sidebar flex flex-col gap-4">
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
      <Card>
        <CardHeader>
          <CardTitle>Credits</CardTitle>
          <CardAction>
            <Dialog>
              <DialogTrigger>Show all</DialogTrigger>
            </Dialog>
          </CardAction>
        </CardHeader>
        <CardContent>
          {currentTrack.credits.map((credit) => (
            <div className="" key={credit.id}></div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
