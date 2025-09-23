"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import TrackItem from "./track-item";
import { PauseIcon, PlayIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";
import { useShallow } from "zustand/react/shallow";
import {
  useRecentTracks,
  useTrack,
  useTracks,
} from "@/features/track/hooks/use-tracks";
import MiniTrackList from "../shared/mini-track-list";
import { useMemo } from "react";
import { useRecentPlay } from "@/hooks/use-recent-play";
import { zCuidType } from "@/features/shared/contracts/shared-dto";

export default function QueueView() {
  const nowPlayingRefId = useNowPlayingRefId();
  const isPlaying = useIsPlaying();
  const { upNext, skipToUpNextIndex } = useQueue();
  const trackIds = useMemo(() => upNext.map((ref) => ref.id), [upNext]);
  const { data: queueTracks } = useTracks(trackIds);
  const { data: recentTracks } = useRecentTracks();

  const { data: nowPlayingTrack, status, error } = useTrack(nowPlayingRefId);
  const togglePlay = useAudioStore(useShallow((state) => state.togglePlay));

  const { handlePlay: handleRecentPlay } = useRecentPlay();

  const handleQueuePlay = (trackId: zCuidType) => {
    if (queueTracks) {
      const index = queueTracks.findIndex((t) => t.id === trackId);
      if (index !== -1) skipToUpNextIndex(index);
    }
  };

  if (status === "pending") {
    return null;
  }

  if (status === "error") {
    return <span>Error {error.message}</span>;
  }

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
              <p className="font-semibold text-15 px-2">
                Next from: {nowPlayingTrack.title}
              </p>
              {queueTracks && (
                <MiniTrackList
                  tracks={queueTracks}
                  handlePlay={handleQueuePlay}
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
              handlePlay={handleRecentPlay}
            />
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
