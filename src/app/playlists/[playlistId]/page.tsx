import { BannerSection } from "@/components/sections/playlist-detail";
import db from "@/lib/db";

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ playlistId: string }>;
}) {
  const { playlistId } = await params;

  const playlist = await db.playlist.findUniqueOrThrow({
    where: {
      id: playlistId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  console.log(playlist);

  return (
    <>
      <BannerSection
        title={playlist.title}
        imageId={playlist.imageId}
        totalTracks={playlist.totalTracks}
        duration={playlist.duration}
        isPublic={playlist.isPublic}
        user={playlist.user}
        description={playlist.description}
      />
    </>
  );
}
