"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import TrackItem from "./track-item";
import { useIsPlaying, useNowPlayingRefId } from "@/hooks/use-audio-player";
import UpNextList from "./up-next-list";
import { PauseIcon, PlayIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useAudioStore } from "@/stores/use-audio-store";
import { useShallow } from "zustand/react/shallow";
import RecentlyPlayedList from "./recently-played-list";
import { useTrack } from "@/features/track/hooks/use-tracks";

export default function QueueView() {
  const nowPlayingRefId = useNowPlayingRefId();
  const isPlaying = useIsPlaying();

  const { data: nowPlayingTrack, status, error } = useTrack(nowPlayingRefId);
  const togglePlay = useAudioStore(useShallow((state) => state.togglePlay));

  if (status === "pending") {
    return null;
  }

  if (status === "error") {
    return <span>Error {error.message}</span>;
  }

  return (
    <Tabs defaultValue="queue" className="size-full p-2">
      <TabsList className="w-full">
        <TabsTrigger value="queue">Queue</TabsTrigger>
        <TabsTrigger value="recently-played">Recently played</TabsTrigger>
      </TabsList>
      <TabsContent value="queue" className="flex flex-col gap-4 h-full">
        <ScrollArea
          className="min-h-0 size-full"
          scrollBarClassName="w-2 -mr-2"
        >
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[calc(15rem/16)] px-2">
                Now playing
              </p>

              <TrackItem
                track={nowPlayingTrack}
                isActive
                playButton={
                  <IconButton
                    aria-pressed={isPlaying}
                    icon={isPlaying ? PauseIcon : PlayIcon}
                    size="sm"
                    onClick={togglePlay}
                    iconClassName="fill-foreground stroke-0"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
                  />
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-[calc(15rem/16)] px-2">
                Next from: {nowPlayingTrack.title}
              </p>
              <UpNextList />
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="recently-played"
        className="flex flex-col gap-4 h-full"
      >
        <ScrollArea
          className="min-h-0 size-full"
          scrollBarClassName="w-2 -mr-2"
        >
          <RecentlyPlayedList />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
