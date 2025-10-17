import "server-only";
import db from "@/lib/db";
import { SearchQuery } from "../contracts/search-dto";
import { albumItemSelect } from "@/features/album/data-access/album-select";
import stringSimilarity from "string-similarity";
import { getPaginationMeta, PaginationMeta } from "@/types/get-pagination-meta";
import { artistItemSelect } from "@/features/artist/data-access/artist-select";
import { playlistItemSelect } from "@/features/playlist/data-access/playlist-select";
import { fullTrackItemSelect } from "@/features/track/data-access/track-select";
import { Prisma } from "@/app/generated/prisma";

type TrackItem = Prisma.TrackGetPayload<{ select: typeof fullTrackItemSelect }>;
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

type UserItem = Prisma.UserGetPayload<{
  select: {
    id: true;
    image: true;
    name: true;
    _count: {
      select: {
        followers: true;
      };
    };
  };
}>;

export type SearchResults = {
  topResult:
    | {
        type: "albums";
        item: AlbumItem;
      }
    | {
        type: "artists";
        item: ArtistItem;
      }
    | {
        type: "playlist";
        item: PlaylistItem;
      }
    | {
        type: "tracks";
        item: TrackItem;
      }
    | {
        type: "profiles";
        item: UserItem;
      };
  tracks: {
    items: TrackItem[];
    pagination: PaginationMeta;
  };
  artists: {
    items: ArtistItem[];
    pagination: PaginationMeta;
  };
  albums: {
    items: AlbumItem[];
    pagination: PaginationMeta;
  };
  playlists: {
    items: PlaylistItem[];
    pagination: PaginationMeta;
  };
  profiles: {
    items: UserItem[];
    pagination: PaginationMeta;
  };
};

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
      ? await db.track
          .findMany({
            where: { title: { contains: q, mode: "insensitive" } },
            take: limit,
            select: fullTrackItemSelect,
            skip: offset,
          })
          .then((data) =>
            data.map((item) => ({
              ...item,
              artists: item.artists.map((a) => a.artist),
            }))
          )
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
            _count: {
              select: {
                followers: true,
              },
            },
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
    ...playlists.map((playlist) => ({
      type: "playlists" as const,
      name: playlist.title,
      popularity: playlist._count.likedBy ?? 0,
      item: playlist,
    })),
    ...profiles.map((profile) => ({
      type: "profiles" as const,
      name: profile.name,
      popularity: profile._count.followers ?? 0,
      item: profile,
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

    const best = scored[0];

    switch (best.type) {
      case "tracks":
        topResult = { type: "tracks", item: best.item };
        break;
      case "artists":
        topResult = { type: "artists", item: best.item };
        break;
      case "albums":
        topResult = { type: "albums", item: best.item };
        break;
      case "playlists":
        topResult = { type: "playlists", item: best.item };
        break;
      case "profiles":
        topResult = { type: "profiles", item: best.item };
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
