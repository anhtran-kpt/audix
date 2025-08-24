import { useRecentTracks } from "@/hooks/api/use-tracks";
import TrackItem from "./track-item";
import { RecentlyPlayedPlayButton } from "./recently-played-play-button";

export default function RecentlyPlayedList() {
  const { data: recentTracks } = useRecentTracks();

  return (
    <ol role="list">
      {recentTracks?.map((track) => (
        <TrackItem
          key={track.id}
          track={track}
          playButton={<RecentlyPlayedPlayButton trackId={track.id} />}
        />
      ))}
    </ol>
  );
}
