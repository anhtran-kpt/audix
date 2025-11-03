import { PlaylistGridSkeleton } from "@/components/shared/playlist-grid-skeleton";
import { SectionSkeleton } from "@/components/shared/section-skeleton";
import { getUserPlaylists } from "@/lib/data/user-data";
import { Suspense } from "react";
import { UserPlaylistsSectionClient } from "./user-playlists-section-client";

export const UserPlaylistsSection = async ({
  targetUserId,
}: {
  targetUserId: string;
}) => {
  const data = await getUserPlaylists({
    targetUserId,
    params: { limit: 8, offset: 0 },
  });

  return (
    <Suspense
      fallback={<SectionSkeleton childSkeleton={<PlaylistGridSkeleton />} />}
    >
      <UserPlaylistsSectionClient
        initialData={data}
        targetUserId={targetUserId}
      />
    </Suspense>
  );
};
