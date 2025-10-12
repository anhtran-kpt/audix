import "server-only";
import db from "@/lib/db";
import { SearchQuery } from "../contracts/search-dto";
import { trackItemSelect } from "@/features/track/data-access/track-select";
import { albumItemSelect } from "@/features/album/data-access/album-select";
import stringSimilarity from "string-similarity";
import { AwaitedReturnType } from "@/utils/type";
import { getPaginationMeta } from "@/types/get-pagination-meta";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";
import { playlistItemSelect } from "@/features/playlist/data-access/playlist-select";
import { Prisma } from "@/app/generated/prisma";

type TrackItem = Prisma.TrackGetPayload<{ select: typeof trackItemSelect }> & {
  playCount?: number;
};

type ArtistItem = Prisma.ArtistGetPayload<{
  select: typeof artistItemSelect;
}> & {
  followersCount?: number;
};

type AlbumItem = Prisma.AlbumGetPayload<{ select: typeof albumItemSelect }> & {
  _count: { likedBy: number };
};

type PlaylistItem = Prisma.PlaylistGetPayload<{
  select: typeof playlistItemSelect;
}> & {
  _count: { likedBy: number };
};

export type TopResult =
  | { type: "tracks"; item: TrackItem }
  | { type: "artists"; item: ArtistItem }
  | { type: "albums"; item: AlbumItem }
  | { type: "playlists"; item: PlaylistItem }
  | null;

export const search = async (query: SearchQuery) => {
  const { q, type, limit, offset } = query;

  const [
    tracks,
    tracksTotal,
    artists,
    artistsTotal,
    albums,
    albumsTotal,
    playlists,
    playlistsTotal,
    profiles,
    profilesTotal,
  ] = await Promise.all([
    type.includes("tracks")
      ? await db.track.findMany({
          where: { title: { contains: q, mode: "insensitive" } },
          take: limit,
          select: { ...trackItemSelect, playCount: true },
          skip: offset,
        })
      : [],
    type.includes("tracks")
      ? await db.track.count({
          where: { title: { contains: q, mode: "insensitive" } },
        })
      : 0,

    type.includes("artists")
      ? await db.artist.findMany({
          where: { name: { contains: q, mode: "insensitive" } },
          take: limit,
          skip: offset,
          select: { ...artistItemSelect, followersCount: true },
        })
      : [],
    type.includes("artists")
      ? await db.artist.count({
          where: { name: { contains: q, mode: "insensitive" } },
        })
      : 0,

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
    type.includes("albums")
      ? await db.album.count({
          where: { title: { contains: q, mode: "insensitive" } },
        })
      : 0,

    type.includes("playlists")
      ? await db.playlist.findMany({
          where: {
            title: { contains: q, mode: "insensitive" },
            isPublic: true,
          },
          take: limit,
          skip: offset,
          select: {
            ...playlistItemSelect,
            _count: {
              select: {
                likedBy: true,
              },
            },
          },
        })
      : [],
    type.includes("playlists")
      ? await db.playlist.count({
          where: {
            title: { contains: q, mode: "insensitive" },
            isPublic: true,
          },
        })
      : 0,

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
    type.includes("profiles")
      ? await db.user.count({
          where: { name: { contains: q, mode: "insensitive" } },
        })
      : 0,
  ]);

  const candidates = [
    ...tracks.map((t) => ({
      type: "tracks" as const,
      name: t.title,
      popularity: t.playCount ?? 0,
      item: t,
    })),
    ...artists.map((a) => ({
      type: "artists" as const,
      name: a.name,
      popularity: a.followersCount ?? 0,
      item: a,
    })),
    ...albums.map((al) => ({
      type: "albums" as const,
      name: al.title,
      popularity: al._count.likedBy ?? 0,
      item: al,
    })),
    ...playlists.map((pl) => ({
      type: "playlists" as const,
      name: pl.title,
      popularity: pl._count.likedBy ?? 0,
      item: pl,
    })),
  ];

  let topResult: TopResult = null;

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

    const best = scored[0];

    switch (best.type) {
      case "tracks":
        topResult = { type: "tracks", item: best.item as TrackItem };
        break;
      case "artists":
        topResult = { type: "artists", item: best.item as ArtistItem };
        break;
      case "albums":
        topResult = { type: "albums", item: best.item as AlbumItem };
        break;
      case "playlists":
        topResult = { type: "playlists", item: best.item as PlaylistItem };
        break;
    }
  }

  return {
    topResult,
    tracks: {
      items: tracks,
      pagination: getPaginationMeta({ limit, offset, total: tracksTotal }),
    },
    artists: {
      items: artists,
      pagination: getPaginationMeta({ limit, offset, total: artistsTotal }),
    },
    albums: {
      items: albums,
      pagination: getPaginationMeta({ limit, offset, total: albumsTotal }),
    },
    playlists: {
      items: playlists,
      pagination: getPaginationMeta({ limit, offset, total: playlistsTotal }),
    },
    profiles: {
      items: profiles,
      pagination: getPaginationMeta({ limit, offset, total: profilesTotal }),
    },
  };
};

export type SearchResults = AwaitedReturnType<typeof search>;
