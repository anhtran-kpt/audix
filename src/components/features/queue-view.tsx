import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import TrackItem from "./track-item";
import RecentlyTracks from "./recently-tracks";
import { useNowPlayingId } from "@/hooks/use-audio-player";
import { useTrack } from "@/modules/tracks/hooks";
import { now } from "next-auth/client/_utils";

export default function QueueView() {
  const nowPlayingId = useNowPlayingId();
  const { data: currentTrack, isLoading, isError } = useTrack(nowPlayingId);

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
            <ol role="list" className="flex flex-col gap-4 px-1">
              <TrackItem track={currentTrack} />
            </ol>
          </div>
        </ScrollArea>
      </TabsContent>
      <TabsContent value="recently played">
        <RecentlyTracks />
      </TabsContent>
    </Tabs>
  );
}
