import "server-only";
import db from "@/lib/db";
import { SearchQuery } from "../contracts/search-dtos";
import { trackItemSelect } from "@/features/track/data-access/track-selects";
import { albumItemSelect } from "@/features/album/data-access/album-select";
import stringSimilarity from "string-similarity";

export const search = async (query: SearchQuery) => {
  const { q, type, limit, offset } = query;

  const [tracks, artists, albums, playlists, profiles] = await Promise.all([
    type.includes("tracks")
      ? await db.track.findMany({
          where: { title: { contains: q, mode: "insensitive" } },
          take: limit,
          select: { ...trackItemSelect, playCount: true },
          skip: offset,
        })
      : [],
    type.includes("artists")
      ? await db.artist.findMany({
          where: { name: { contains: q, mode: "insensitive" } },
          take: limit,
          skip: offset,
          select: {
            id: true,
            name: true,
            imageId: true,
            bannerId: true,
            isVerified: true,
            followersCount: true,
            genres: {
              select: {
                genre: {
                  select: {
                    id: true,
                    name: true,
                    color: true,
                  },
                },
              },
            },
          },
        })
      : [],
    type.includes("albums")
      ? await db.album.findMany({
          where: { title: { contains: q, mode: "insensitive" } },
          take: limit,
          skip: offset,
          select: {
            ...albumItemSelect,
            _count: {
              select: {
                likedBy: true,
              },
            },
          },
        })
      : [],
    type.includes("playlists")
      ? await db.playlist.findMany({
          where: { title: { contains: q, mode: "insensitive" } },
          take: limit,
          skip: offset,
          select: {
            id: true,
            imageId: true,
            title: true,
            user: true,
            _count: {
              select: {
                likedBy: true,
              },
            },
          },
        })
      : [],
    type.includes("profiles")
      ? await db.user.findMany({
          where: { name: { contains: q, mode: "insensitive" } },
          take: limit,
          skip: offset,
          select: {
            id: true,
            image: true,
            name: true,
          },
        })
      : [],
  ]);

  const candidates = [
    ...tracks.map((t) => ({
      type: "tracks",
      name: t.title,
      popularity: t.playCount ?? 0,
      item: t,
    })),
    ...artists.map((a) => ({
      type: "artists",
      name: a.name,
      popularity: a.followersCount ?? 0,
      item: a,
    })),
    ...albums.map((al) => ({
      type: "albums",
      name: al.title,
      popularity: al._count.likedBy ?? 0,
      item: al,
    })),
    ...playlists.map((pl) => ({
      type: "playlists",
      name: pl.title,
      popularity: pl._count.likedBy ?? 0,
      item: pl,
    })),
  ];

  let topResult = null;

  if (candidates.length > 0) {
    const maxPopularity = Math.max(...candidates.map((c) => c.popularity || 1));

    const scored = candidates.map((c) => {
      const fuzzy = stringSimilarity.compareTwoStrings(
        q.toLowerCase(),
        c.name.toLowerCase()
      );
      const pop = (c.popularity || 0) / maxPopularity;
      const relevance = fuzzy * 0.7 + pop * 0.3;
      return { ...c, relevance };
    });

    scored.sort((a, b) => b.relevance - a.relevance);
    topResult = { type: scored[0].type, item: scored[0].item };
  }

  return {
    topResult,
    tracks,
    artists,
    albums,
    playlists,
    profiles,
  };
};
