"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import TrackItem from "./track-item";
import { useIsPlaying, usenowPlayingRefId } from "@/hooks/use-audio-player";
import { useTrack } from "@/hooks/api/use-tracks";
import UpNextList from "./up-next-list";
import { PauseIcon, PlayIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useAudioStore } from "@/stores/use-audio-store";
import { useShallow } from "zustand/react/shallow";
import { RecentlyPlayedPlayButton } from "./recently-played-play-button";
import RecentlyPlayedList from "./recently-played-list";

export default function QueueView() {
  const nowPlayingRefId = usenowPlayingRefId();
  const isPlaying = useIsPlaying();

  const { data: currentTrack } = useTrack(nowPlayingRefId);
  const togglePlay = useAudioStore(useShallow((state) => state.togglePlay));

  if (!currentTrack) {
    return null;
  }

  return (
    <Tabs defaultValue="queue" className="size-full">
      <TabsList className="w-full h-15">
        <TabsTrigger value="queue">Queue</TabsTrigger>
        <TabsTrigger value="recently-played">Recently played</TabsTrigger>
      </TabsList>
      <TabsContent value="queue" className="flex flex-col gap-4 h-full">
        <ScrollArea className="min-h-0 size-full">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Now Playing</p>
            <TrackItem
              track={currentTrack}
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
          <div>
            <p className="font-semibold">Next up</p>
            <UpNextList />
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="recently-played"
        className="flex flex-col gap-4 h-full"
      >
        <ScrollArea className="min-h-0 size-full">
          <RecentlyPlayedList />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
