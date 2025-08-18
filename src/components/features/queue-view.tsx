import { useCurrentTrack } from "@/hooks/use-audio-player";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import TrackItem from "./track-item";
import RecentlyTracks from "./recently-tracks";

export default function QueueView() {
  const currentTrack = useCurrentTrack();

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
