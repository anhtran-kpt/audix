"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import TrackItem from "./track-item";
import { PauseIcon, PlayIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useShallow } from "zustand/react/shallow";
import { useRecentTracks, useTracks } from "@/features/track/hooks/use-tracks";
import MiniTrackList from "../shared/mini-track-list";
import { usePlaybackStore } from "@/stores/use-playback-store";

export default function QueueView() {
  const { isPlaying, queue, currentTrack } = usePlaybackStore(
    useShallow((s) => ({
      isPlaying: s.isPlaying,
      queue: s.session?.queue,
      currentTrack: s.session?.currentTrack,
    }))
  );

  const { data: queueTracks } = useTracks(queue?.map((item) => item.track.id));
  const { data: recentTracks } = useRecentTracks();

  if (!currentTrack) {
    return null;
  }

  console.log(queueTracks);

  return (
    <Tabs defaultValue="queue" className="size-full">
      <TabsList className="w-full">
        <TabsTrigger value="queue">Queue</TabsTrigger>
        <TabsTrigger value="recently-played">Recently played</TabsTrigger>
      </TabsList>
      <TabsContent value="queue" className="flex flex-col gap-4 h-full gap">
        <ScrollArea
          className="min-h-0 size-full px-2 py-4"
          scrollBarClassName="w-2 -mr-2"
        >
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-15 px-2">Now playing</p>

              <TrackItem
                track={currentTrack}
                isActive
                playButton={
                  <IconButton
                    aria-pressed={isPlaying}
                    icon={isPlaying ? PauseIcon : PlayIcon}
                    size="sm"
                    // onClick={togglePlay}
                    iconClassName="fill-foreground stroke-0"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 invisible group-hover:visible"
                  />
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-15 px-2">
                Next from: {currentTrack.title}
              </p>
              {queueTracks && (
                <MiniTrackList
                  tracks={queueTracks}
                  // handlePlay={handleQueuePlay}
                />
              )}
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="recently-played"
        className="flex flex-col gap-4 h-full"
      >
        <ScrollArea
          className="min-h-0 size-full px-2 py-4"
          scrollBarClassName="w-2 -mr-2"
        >
          {recentTracks && (
            <MiniTrackList
              tracks={recentTracks}
              // handlePlay={handleRecentPlay}
            />
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
