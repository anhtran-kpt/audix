import { Suspense } from "react";
import { TracksSectionClient } from "./tracks-section-client";
import { getPlaylistTracks } from "@/lib/data/playlist-data";

export const TracksSection = async ({
  playlistId,
  userId,
}: {
  playlistId: string;
  userId: string;
}) => {
  const data = await getPlaylistTracks({ playlistId, userId });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TracksSectionClient initialData={data} playlistId={playlistId} />
    </Suspense>
  );
};
