"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { useShallow } from "zustand/react/shallow";
import { useRecentTracks, useTracks } from "@/features/track/hooks/use-tracks";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { TrackItemCompact } from "../shared/track-item-compact";

export default function QueueView() {
  const { queue, currentTrack, snapshot } = usePlaybackStore(
    useShallow((s) => ({
      queue: s.session?.queue,
      snapshot: s.session?.snapshot,
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
              <TrackItemCompact
                track={{
                  ...currentTrack,
                  artists: currentTrack.artists.map((item) => item.artist),
                }}
                context={
                  snapshot
                    ? {
                        contextType: snapshot.contextType,
                        contextId: snapshot.contextId,
                        startTrackId: currentTrack.id,
                      }
                    : undefined
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-15 px-2">
                Next from: {currentTrack.title}
              </p>
              {queueTracks && (
                <div className="flex flex-col gap-1">
                  {queueTracks.map((track) => (
                    <TrackItemCompact
                      key={track.id}
                      track={{
                        ...track,
                        artists: track.artists.map((item) => item.artist),
                      }}
                      context={
                        snapshot
                          ? {
                              contextType: snapshot.contextType,
                              contextId: snapshot.contextId,
                              startTrackId: track.id,
                            }
                          : undefined
                      }
                    />
                  ))}
                </div>
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
            <div className="flex flex-col gap-1">
              {recentTracks.map(({ id, track }) => (
                <TrackItemCompact
                  key={track.id}
                  track={track}
                  context={{
                    contextType: "HISTORY",
                    contextId: id,
                    startTrackId: track.id,
                  }}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
