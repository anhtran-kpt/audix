"use client";

import { TrackList } from "@/components/features/track-list";
import { TrackListItem } from "@/features/track/contracts/track-dto";

type TracksSectionProps = {
  tracks: TrackListItem[];
  playlistId: string;
};

export const TracksSection = ({ tracks, playlistId }: TracksSectionProps) => {
  return (
    <section>
      <TrackList contextId={playlistId} tracks={tracks} type="PLAYLIST" />
    </section>
  );
};
