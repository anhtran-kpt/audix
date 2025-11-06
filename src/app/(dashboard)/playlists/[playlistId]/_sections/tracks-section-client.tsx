"use client";

import { columns } from "@/components/features/tracks-table/playlist/columns";
import { DataTable } from "@/components/features/tracks-table/playlist/data-table";
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
      <DataTable
        columns={columns}
        data={data.tracks}
        contextType="PLAYLIST"
        contextId={playlistId}
      />
    </section>
  );
};
