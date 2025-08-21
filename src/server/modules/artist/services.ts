import { zCuidType } from "@/contracts/common";
import db from "@/lib/db";

export const getSidebarArtists = async (userId: zCuidType) => {
  return await db.userLikedArtist
    .findMany({
      where: {
        userId,
      },
      select: {
        artist: {
          select: {
            id: true,
            name: true,
            imageId: true,
          },
        },
      },
    })
    .then((data) => data.map((item) => item.artist));
};
