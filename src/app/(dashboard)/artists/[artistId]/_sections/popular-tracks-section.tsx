"use client";

import { TrackList } from "@/components/features/track-list";
import { artistQueryOptions } from "@/features/artist/api/artist-query-options";
import { useQuery } from "@tanstack/react-query";

export const PopularTracksSection = ({ artistId }: { artistId: string }) => {
  const { data, status } = useQuery({
    ...artistQueryOptions.popularTracks(artistId, { limit: 5 }),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6 ">
        <h2 className="font-bold text-2xl select-none capitalize">Popular</h2>
      </div>
      <TrackList
        contextId={artistId}
        contextType="ARTIST"
        tracks={data.items}
      />
    </section>
  );
};
