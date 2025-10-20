"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { useShallow } from "zustand/react/shallow";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { TrackItemCompact } from "../shared/track-item-compact";
import { MiniPlayTrackButton } from "./play/mini-play-track-button";
import { useQuery } from "@tanstack/react-query";
import { trackQueryOptions } from "@/features/track/api/track-query-options";

export default function QueueView() {
  const { queue, currentTrack, snapshot } = usePlaybackStore(
    useShallow((s) => ({
      queue: s.session?.queue,
      snapshot: s.session?.snapshot,
      currentTrack: s.session?.currentTrack,
    }))
  );

  const queueNextIds = queue?.next?.map((item) => item.id) ?? [];
  const queueContextIds = queue?.context?.map((item) => item.id) ?? [];
  const queueLaterIds = queue?.later?.map((item) => item.id) ?? [];

  const { data: queueNext } = useQuery({
    ...trackQueryOptions.trackList(queueNextIds),
  });
  const { data: queueContext } = useQuery({
    ...trackQueryOptions.trackList(queueContextIds),
  });
  const { data: queueLater } = useQuery({
    ...trackQueryOptions.trackList(queueLaterIds),
  });

  const { data: recentTracks } = useQuery({ ...trackQueryOptions.history() });

  if (!currentTrack || !snapshot) {
    return null;
  }

  console.log(recentTracks);

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
              <p className="font-semibold text-[calc(15rem/16)] px-2">
                Now playing
              </p>
              <TrackItemCompact
                track={currentTrack}
                context={{
                  contextType: snapshot.contextType,
                  contextId: snapshot.contextId,
                  startTrackId: currentTrack.id,
                }}
                playBtn={
                  <MiniPlayTrackButton
                    context={{
                      contextType: snapshot.contextType,
                      contextId: snapshot.contextId,
                      startTrackId: currentTrack.id,
                    }}
                    trackId={currentTrack.id}
                    className="absolute top-1/2 left-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 select-none group-hover:select-auto transition-opacity"
                  />
                }
              />
            </div>
            {queueNext && queueNext.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-[calc(15rem/16)] px-2">
                  Next in queue:
                </p>

                <div className="flex flex-col gap-1">
                  {queueNext.map((track) => (
                    <TrackItemCompact
                      key={track.id}
                      track={track}
                      context={{
                        contextType: snapshot.contextType,
                        contextId: snapshot.contextId,
                        startTrackId: track.id,
                      }}
                      playBtn={
                        <MiniPlayTrackButton
                          context={{
                            contextType: snapshot.contextType,
                            contextId: snapshot.contextId,
                            startTrackId: track.id,
                          }}
                          trackId={track.id}
                          className="absolute top-1/2 left-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 select-none group-hover:select-auto transition-opacity"
                        />
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {queueContext && queueContext.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-[calc(15rem/16)] px-2">
                  Next from: {snapshot.name}
                </p>

                <div className="flex flex-col gap-1">
                  {queueContext.map((track) => (
                    <TrackItemCompact
                      key={track.id}
                      track={track}
                      context={{
                        contextType: snapshot.contextType,
                        contextId: snapshot.contextId,
                        startTrackId: track.id,
                      }}
                      playBtn={
                        <MiniPlayTrackButton
                          context={{
                            contextType: snapshot.contextType,
                            contextId: snapshot.contextId,
                            startTrackId: track.id,
                          }}
                          trackId={track.id}
                          className="absolute top-1/2 left-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 select-none group-hover:select-auto transition-opacity"
                        />
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {queueLater && queueLater.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-[calc(15rem/16)] px-2">
                  Later in queue:
                </p>

                <div className="flex flex-col gap-1">
                  {queueLater.map((track) => (
                    <TrackItemCompact
                      key={track.id}
                      track={track}
                      playBtn={
                        <MiniPlayTrackButton
                          context={{
                            contextType: snapshot.contextType,
                            contextId: snapshot.contextId,
                            startTrackId: track.id,
                          }}
                          trackId={track.id}
                          className="absolute top-1/2 left-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 select-none group-hover:select-auto transition-opacity"
                        />
                      }
                      context={{
                        contextType: snapshot.contextType,
                        contextId: snapshot.contextId,
                        startTrackId: track.id,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
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
                  key={id}
                  track={track}
                  context={{
                    contextType: "HISTORY",
                    contextId: id,
                    startTrackId: track.id,
                  }}
                  playBtn={
                    <MiniPlayTrackButton
                      context={{
                        contextType: "HISTORY",
                        contextId: id,
                        startTrackId: track.id,
                      }}
                      trackId={track.id}
                      className="absolute top-1/2 left-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 select-none group-hover:select-auto transition-opacity"
                    />
                  }
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
