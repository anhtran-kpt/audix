import { getPlaylistDetail } from "@/features/playlist/data-access/playlist-repo";
import { BannerSection } from "./_sections/banner-section";
import { TracksSection } from "./_sections/tracks-section";
import { BrowseTrackSection } from "./_sections/browse-track-section";

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;

  const playlist = await getPlaylistDetail(playlistId);

  return (
    <>
      <BannerSection playlistId={playlistId} initialData={playlist} />
      <TracksSection playlistId={playlistId} initialData={playlist} />
      <BrowseTrackSection playlistId={playlistId} />
    </>
  );
}
