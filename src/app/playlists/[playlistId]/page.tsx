import {
  BannerSection,
  TrackAddingSection,
  TracksSection,
} from "@/components/sections/playlist-detail";
import { getPlaylistDetail } from "@/features/playlist/data-access/playlist-repos";
import db from "@/lib/db";

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;

  const playlist = await getPlaylistDetail(playlistId);

  return (
    <>
      <BannerSection
        id={playlist.id}
        title={playlist.title}
        imageId={playlist.imageId}
        totalTracks={playlist.totalTracks}
        duration={playlist.duration}
        isPublic={playlist.isPublic}
        user={playlist.user}
        description={playlist.description}
      />
      <TracksSection playlistId={playlistId} />
      <TrackAddingSection />
    </>
  );
}
