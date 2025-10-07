"use client";

import { TrackList } from "@/components/features/track-list";
import { artistQueries } from "@/features/artist/api/artist-options";
import { useQuery } from "@tanstack/react-query";

export const PopularTracksSection = ({ artistId }: { artistId: string }) => {
  const { data, status } = useQuery({
    ...artistQueries.popularTracks(artistId, { limit: 5 }),
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
