import { Prisma } from "generated/prisma";

export const artistSelect = {
  id: true,
  name: true,
  avatarId: true,
  followersCount: true,
  bannerId: true,
  bio: true,
  songs: {
    select: {
      song: {
        select: {
          id: true,
          title: true,
          slug: true,
          audioId: true,
          duration: true,
          order: true,
          isExplicit: true,
          playCount: true,
          album: {
            select: {
              id: true,
              thumbnailId: true,
              title: true,
              artist: {
                select: {
                  id: true,
                  name: true,
                  avatarId: true,
                },
              },
            },
          },
          artists: {
            select: {
              artist: { select: { id: true, name: true } },
            },
            orderBy: { order: "asc" },
          },
        },
      },
    },
    take: 5,
    orderBy: {
      song: {
        playCount: "desc",
      },
    },
  },
} satisfies Prisma.ArtistSelect;
