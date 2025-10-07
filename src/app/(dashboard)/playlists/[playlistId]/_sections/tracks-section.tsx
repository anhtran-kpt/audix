"use client";

import { TrackList } from "@/components/features/track-list";
import { playlistQueryOptions } from "@/features/playlist/api/playlist-query-options";
import { useQuery } from "@tanstack/react-query";

export const TracksSection = ({ playlistId }: { playlistId: string }) => {
  const { data: tracks, status } = useQuery({
    ...playlistQueryOptions.tracks(playlistId),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <TrackList
        contextId={playlistId}
        tracks={tracks}
        contextType="PLAYLIST"
      />
    </section>
  );
};
