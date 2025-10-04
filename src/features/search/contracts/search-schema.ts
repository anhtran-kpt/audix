import { AlbumItemSchema } from "@/features/album/contracts/album-schema";
import { ArtistItemSchema } from "@/features/artist/contracts/artist-schema";
import { PlaylistItemSchema } from "@/features/playlist/contracts/playlist-schema";
import { TrackItemSchema } from "@/features/track/contracts/track-schema";
import z from "zod";

export const searchQuerySchema = z.object({
  q: z.string().min(1, "Query is required"),
  type: z
    .string()
    .default("track,artist,album,playlist,user")
    .transform((val) => val.split(",")),
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(5),
  offset: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(0),
});

export const searchResult = z.object({
  topResult: z
    .object({
      type: z.enum(["track", "artist", "album", "playlist"]),
      item: z.any(),
    })
    .nullable(),
  tracks: TrackItemSchema.pick({
    id: true,
    title: true,
    duration: true,
    album: true,
    artists: true,
  }).array(),
  albums: AlbumItemSchema.array(),
  playlists: PlaylistItemSchema.pick({
    id: true,
    title: true,
  }).array(),
  artists: ArtistItemSchema.pick({
    id: true,
    name: true,
    imageId: true,
  }).array(),
  profiles: z
    .object({
      id: true,
      name: true,
      imageId: true,
    })
    .array(),
});
