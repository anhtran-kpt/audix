import { PlaylistGridSkeleton } from "@/components/shared/playlist-grid-skeleton";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { getMyLikedPlaylists } from "@/lib/data/me-data";
import { Suspense } from "react";
import { LikedPlaylistsSectionClient } from "./liked-playlists-section-client";

export const LikedPlaylistsSection = async ({ userId }: { userId: string }) => {
  const data = await getMyLikedPlaylists({
    userId,
    params: { limit: 8, offset: 0 },
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<PlaylistGridSkeleton />} />}
    >
      <LikedPlaylistsSectionClient initialData={data} />
    </Suspense>
  );
};
