import {
  BannerSection,
  TrackAddingSection,
  TracksSection,
} from "@/components/sections/playlist-detail";
import { getPlaylistDetail } from "@/features/playlist/data-access/playlist-repo";

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
      <TrackAddingSection playlistId={playlistId} />
    </>
  );
}
