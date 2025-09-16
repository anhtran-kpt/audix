import { FullAlbumSchema } from "@/features/album/contracts/album-dto";
import { FullArtistSchema } from "@/features/artist/contracts/artist-dto";
import { FullPlaylistSchema } from "@/features/playlist/contracts/playlist-dto";
import { FullTrackSchema } from "@/features/track/contracts/track-dto";
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
  tracks: FullTrackSchema.pick({
    id: true,
    title: true,
    duration: true,
    album: true,
    artists: true,
  }).array(),
  albums: FullAlbumSchema.pick({
    id: true,
    title: true,
    imageId: true,
  }).array(),
  playlists: FullPlaylistSchema.pick({
    id: true,
    title: true,
  }).array(),
  artists: FullArtistSchema.pick({
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

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchResult = z.infer<typeof searchResult>;
