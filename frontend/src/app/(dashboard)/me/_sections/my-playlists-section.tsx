import { Suspense } from "react";
import { MyPlaylistsSectionClient } from "./my-playlists-section-client";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { PlaylistGridSkeleton } from "@/components/shared/playlist-grid-skeleton";
import { getMyPlaylists } from "@/features/me/me-data";

export const MyPlaylistsSection = async ({ userId }: { userId: string }) => {
  const data = await getMyPlaylists({
    userId,
    params: { limit: 8, offset: 0 },
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<PlaylistGridSkeleton />} />}
    >
      <MyPlaylistsSectionClient initialData={data} />
    </Suspense>
  );
};
