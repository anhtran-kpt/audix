import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import TrackItem from "./track-item";
import { useNowPlayingId } from "@/hooks/use-audio-player";
import { useAudioStore } from "@/stores/use-audio-store";
import { useShallow } from "zustand/react/shallow";
import { useRecentTracks, useTrack, useTracks } from "@/hooks/api/use-tracks";

export default function QueueView() {
  const nowPlayingId = useNowPlayingId();
  const trackRefs = useAudioStore(
    useShallow((s) => s.playbackContext?.trackRefs)
  );

  const trackIds = trackRefs?.map((ref) => ref.id);

  const { data: currentTrack } = useTrack(nowPlayingId);
  const { data: queueTracks } = useTracks(trackIds);

  const { data: recentTracks } = useRecentTracks();

  if (!currentTrack) {
    return null;
  }

  return (
    <Tabs defaultValue="queue" className="size-full">
      <TabsList className="w-full h-15">
        <TabsTrigger value="queue">Queue</TabsTrigger>
        <TabsTrigger value="recently played">Recently played</TabsTrigger>
      </TabsList>
      <TabsContent value="queue" className="flex flex-col gap-4 h-full">
        <ScrollArea className="min-h-0 size-full">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Now Playing</p>
            <TrackItem track={currentTrack} />
          </div>
          <div>
            <p className="font-semibold">Next up</p>
            <ol role="list" className="flex flex-col gap-2 px-1">
              {queueTracks?.map((track) => (
                <TrackItem key={track.id} track={track} />
              ))}
            </ol>
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="recently played">
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
