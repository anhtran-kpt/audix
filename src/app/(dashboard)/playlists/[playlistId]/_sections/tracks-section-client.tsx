"use client";

import { TrackList } from "@/components/features/track-list/track-list";
import { playlistQueryOptions } from "@/features/playlist/api/playlist-query-options";
import { PlaylistTracks } from "@/lib/data/playlist-data";
import { useQuery } from "@tanstack/react-query";

type TracksSectionClientProps = {
  initialData: PlaylistTracks;
  playlistId: string;
};
export const TracksSectionClient = ({
  initialData,
  playlistId,
}: TracksSectionClientProps) => {
  const { data } = useQuery({
    ...playlistQueryOptions.tracks(playlistId),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <section>
      <TrackList
        contextId={playlistId}
        initialData={data.tracks}
        contextType="PLAYLIST"
        isLoading={false}
        canEdit={data.canEdit}
      />
    </section>
  );
};
