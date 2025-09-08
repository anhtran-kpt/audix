"use client";

import { TrackList } from "@/components/features/track-list";
import { PlaylistDetail } from "@/features/playlist/contracts/playlist-dto";
import { playlistDetailOption } from "@/features/playlist/query/playlist-options";
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
      <TrackList contextId={playlistId} tracks={tracks} type="PLAYLIST" />
    </section>
  );
};
