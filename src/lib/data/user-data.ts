import "server-only";
import db from "@/lib/db";
import { AwaitedReturnType } from "@/utils/type";
import { playlistItemSelect } from "@/features/playlist/data-access/playlist-select";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import { DEFAULT_USER_PLAYLIST_TYPE } from "../constants";

export const getUserOverview = async (targetUserId: string) => {
  return await db.user.findUniqueOrThrow({
    where: {
      id: targetUserId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          playlists: {
            where: {
              isPublic: true,
              isSystem: false,
              OR: [
                { systemType: null },
                { systemType: { not: DEFAULT_USER_PLAYLIST_TYPE } },
              ],
            },
          },
          followedArtists: true,
        },
      },
    },
  });
};

export type UserOverview = AwaitedReturnType<typeof getUserOverview>;

export const getUserPlaylists = async ({
  targetUserId,
  params,
}: {
  targetUserId: string;
  params: PaginationParams;
}) => {
  const { offset, limit } = params;

  const [playlists, total] = await Promise.all([
    db.playlist.findMany({
      where: {
        userId: targetUserId,
        isPublic: true,
        isSystem: false,
        OR: [
          { systemType: null },
          { systemType: { not: DEFAULT_USER_PLAYLIST_TYPE } },
        ],
      },
      select: playlistItemSelect,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),

    db.playlist.count({
      where: { userId: targetUserId },
    }),
  ]);

  return {
    items: playlists,
    pagination: getPaginationMeta({ limit, offset, total }),
  };
};

export type UserPlaylists = AwaitedReturnType<typeof getUserPlaylists>;

export const getUserFollowedArtists = async ({
  targetUserId,
  params,
}: {
  targetUserId: string;
  params: PaginationParams;
}) => {
  const { limit, offset } = params;

  const [artists, total] = await Promise.all([
    db.userFollowedArtist
      .findMany({
        where: {
          userId: targetUserId,
        },
        select: {
          artist: {
            select: artistItemSelect,
          },
        },
        skip: offset,
        take: limit,
      })
      .then((data) => data.map((item) => item.artist)),

    db.userFollowedArtist.count({
      where: {
        userId: targetUserId,
      },
    }),
  ]);

  return {
    items: artists,
    pagination: getPaginationMeta({ offset, limit, total }),
  };
};

export type UserFollowedArtists = AwaitedReturnType<
  typeof getUserFollowedArtists
>;
