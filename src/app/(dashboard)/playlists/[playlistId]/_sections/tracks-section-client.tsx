"use client";

import { DataTable } from "@/components/features/tracks-table/playlist/data-table";
import { playlistQueryOptions } from "@/features/playlist/playlist-query-options";
import { PlaylistTracks } from "@/features/playlist/playlist-types";
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
      <DataTable
        data={data.tracks}
        contextType="PLAYLIST"
        contextId={playlistId}
      />
    </section>
  );
};
