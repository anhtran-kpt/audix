import { TracksSection } from "./_sections/tracks-section";
import { BannerSection } from "./_sections/banner-section";
import { requireAuth } from "@/lib/auth";
import { getPlaylistBanner } from "@/lib/data/playlist-data";
import { BrowseTrackSection } from "./_sections/browse-track-section";

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;
  const user = await requireAuth();

  const data = await getPlaylistBanner({ playlistId, userId: user.id });

  return (
    <>
      <BannerSection initialData={data} />
      <TracksSection playlistId={playlistId} userId={user.id} />
      <BrowseTrackSection playlistId={playlistId} />
    </>
  );
}
