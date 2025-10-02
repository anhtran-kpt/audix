import "server-only";
import db from "@/lib/db";
import { AppError } from "@/lib/errors";
import { AwaitedReturnType } from "@/utils/type";

export const getMyProfile = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      playlists: {
        select: {
          imageId: true,
          isPublic: true,
          id: true,
          title: true,
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      likedArtists: {
        select: {
          artist: {
            select: {
              id: true,
              imageId: true,
              name: true,
            },
          },
        },
      },
      _count: {
        select: {
          playlists: true,
          likedArtists: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("NOT_FOUND", "User not found!");
  }

  const artists = user.likedArtists.map((a) => a.artist);

  return { ...user, likedArtists: artists };
};

export type MyProfile = AwaitedReturnType<typeof getMyProfile>;
