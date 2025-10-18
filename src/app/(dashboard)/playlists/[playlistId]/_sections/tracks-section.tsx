"use client";

import { TrackList } from "@/components/features/track-list/track-list";
import { playlistQueryOptions } from "@/features/playlist/api/playlist-query-options";
import { useQuery } from "@tanstack/react-query";

export const TracksSection = ({ playlistId }: { playlistId: string }) => {
  const { data, status } = useQuery({
    ...playlistQueryOptions.tracks(playlistId),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  if (!data.canView) {
    return <section>You have no permission to see this content.</section>;
  }

  return (
    <section>
      <TrackList
        contextId={playlistId}
        tracks={data.tracks}
        contextType="PLAYLIST"
        isLoading={false}
        canEdit={data.canEdit}
      />
    </section>
  );
};
