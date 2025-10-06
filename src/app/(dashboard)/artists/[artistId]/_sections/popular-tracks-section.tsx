"use client";

import { TrackList } from "@/components/features/track-list";
import { artistPopularTracksOptions } from "@/features/artist/api/artist-options";
import { useQuery } from "@tanstack/react-query";

export const PopularTracksSection = ({ artistId }: { artistId: string }) => {
  const { data: tracks } = useQuery({
    ...artistPopularTracksOptions(artistId),
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-6 ">
        <h2 className="font-bold text-2xl select-none capitalize">Popular</h2>
      </div>
      <TrackList contextId={artistId} contextType="ARTIST" tracks={tracks} />
    </section>
  );
};
