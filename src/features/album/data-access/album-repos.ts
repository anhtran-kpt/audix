import db from "@/lib/db";
import "server-only";

export const getHotAlbums = async () => {
  return await db.album.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      duration: true,
      imageId: true,
      albumType: true,
      releaseDate: true,
      totalTracks: true,
    },
    orderBy: {
      likedBy: {
        _count: "desc",
      },
    },
    take: 10,
  });
};
