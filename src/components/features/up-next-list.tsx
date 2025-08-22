import { useTracks } from "@/hooks/api/use-tracks";
import { useQueue } from "@/hooks/use-audio-player";
import { useMemo } from "react";
import TrackItem from "./track-item";
import UpNextPlayButton from "./up-next-play-button";

export default function UpNextList() {
  const { upNext } = useQueue();
  const trackIds = useMemo(() => upNext.map((ref) => ref.id), [upNext]);
  const { data: queueTracks } = useTracks(trackIds);

  return (
    <ol role="list" className="flex flex-col gap-2 px-1">
      {queueTracks?.map((track, i) => (
        <TrackItem
          key={track.id}
          track={track}
          playButton={<UpNextPlayButton trackId={track.id} trackIndex={i} />}
        />
      ))}
    </ol>
  );
}
