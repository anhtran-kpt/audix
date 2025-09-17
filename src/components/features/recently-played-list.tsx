"use client";

import TrackItem from "./track-item";
import { RecentlyPlayedPlayButton } from "./recently-played-play-button";
import { useRecentTracks } from "@/features/track/hooks/use-tracks";

export default function RecentlyPlayedList() {
  const { data: recentTracks } = useRecentTracks();

  return (
    <ol role="list" className="flex flex-col">
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
