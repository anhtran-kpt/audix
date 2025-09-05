import { useQueue } from "@/hooks/use-audio-player";
import { useMemo } from "react";
import TrackItem from "./track-item";
import UpNextPlayButton from "./up-next-play-button";
import { useTracks } from "@/features/track/hooks/use-tracks";

export default function UpNextList() {
  const { upNext } = useQueue();
  const trackIds = useMemo(() => upNext.map((ref) => ref.id), [upNext]);
  const { data: queueTracks } = useTracks(trackIds);

  return (
    <ol role="list" className="flex flex-col gap-1">
      {queueTracks?.map((track, i) => (
        <div key={track.id} className="group hover:bg-muted p-2 rounded-md">
          <TrackItem
            track={track}
            playButton={<UpNextPlayButton trackId={track.id} trackIndex={i} />}
          />
        </div>
      ))}
    </ol>
  );
}
