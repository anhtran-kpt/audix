"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import TrackItem from "./track-item";
import { useNowPlayingId, useQueue } from "@/hooks/use-audio-player";
import { useRecentTracks, useTrack, useTracks } from "@/hooks/api/use-tracks";
import { useMemo } from "react";
import UpNextList from "./up-next-list";

export default function QueueView() {
  const nowPlayingId = useNowPlayingId();
  const { data: currentTrack } = useTrack(nowPlayingId);

  const { data: recentTracks } = useRecentTracks();

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
            <TrackItem track={currentTrack} />
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
          <ol role="list">
            {recentTracks?.map((track) => (
              <TrackItem key={track.id} track={track} />
            ))}
          </ol>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
