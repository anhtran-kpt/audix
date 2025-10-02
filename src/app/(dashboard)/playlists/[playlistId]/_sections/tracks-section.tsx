"use client";

import { TrackList } from "@/components/features/track-list";
import { playlistDetailOption } from "@/features/playlist/api/playlist-options";
import { PlaylistDetail } from "@/features/playlist/data-access/playlist-repo";
import { useQuery } from "@tanstack/react-query";

type TracksSectionProps = {
  initialData: PlaylistDetail;
  playlistId: string;
};

export const TracksSection = ({
  initialData,
  playlistId,
}: TracksSectionProps) => {
  const { data: tracks } = useQuery({
    ...playlistDetailOption(playlistId),
    select: (data) => data.tracks,
    initialData,
  });

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
