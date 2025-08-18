import { HotAlbumsSection } from "@/components/sections/discovery/hot-albums-section";
import { NewReleasesSection } from "@/components/sections/discovery/new-releases-section";
import db from "@/server/db";

export default async function Home() {
  const [tracks, albums] = await Promise.all([
    db.track.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        audioId: true,
        duration: true,
        trackNumber: true,
        isExplicit: true,
        playCount: true,
        createdAt: true,
        album: {
          select: {
            artistId: true,
            id: true,
            imageId: true,
            title: true,
          },
        },
        artists: {
          select: {
            artist: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      take: 12,
      orderBy: {
        createdAt: "desc",
      },
    }),
    db.album.findMany({}),
  ]);

  return (
    <>
      <NewReleasesSection tracks={tracks} />
      <HotAlbumsSection albums={albums} />
    </>
  );
}
