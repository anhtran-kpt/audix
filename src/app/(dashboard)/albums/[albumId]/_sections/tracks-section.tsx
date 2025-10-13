"use client";

import { TrackList } from "@/components/features/track-list/track-list";
import { albumQueryOptions } from "@/features/album/api/album-query-options";
import { useQuery } from "@tanstack/react-query";

export const TracksSection = ({ albumId }: { albumId: string }) => {
  const { data: tracks, status } = useQuery({
    ...albumQueryOptions.tracks(albumId),
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
        tracks={tracks}
        contextId={albumId}
        contextType="ALBUM"
        isLoading={false}
      />
    </section>
  );
};
