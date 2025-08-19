import z from "zod";
import { baseFields } from "../shared/schemas";
import { ArtistRole, CreditRole } from "@/app/generated/prisma";

export const TrackDetailDto = z
  .object({
    id: baseFields.id,
    title: z.string(),
    audioId: z.string(),
    duration: baseFields.count,
    trackNumber: baseFields.count,
    lyrics: z.string().nullable().optional(),
    isExplicit: z.boolean().default(false),
    playCount: baseFields.count.default(0),
    album: z.object({
      id: baseFields.id,
      imageId: z.string(),
      title: z.string(),
      artist: z.object({
        id: baseFields.id,
        name: z.string(),
        bannerId: z.string(),
        bio: z.string().optional().nullable(),
      }),
      _count: z.object({
        likedBy: baseFields.count,
      }),
    }),
    artists: z.array(
      z.object({
        role: z.enum(ArtistRole),
        order: baseFields.count.default(0),
        artist: z.object({ id: baseFields.id, name: z.string() }),
      })
    ),
    credits: z.array(
      z.object({
        id: baseFields.id,
        name: z.string(),
        order: baseFields.count.default(0),
        role: z.enum(CreditRole),
        details: z.string().optional().nullable(),
        artist: z.object({
          id: baseFields.id,
          name: z.string(),
        }),
      })
    ),
  })
  .strict();

export type TrackDetailDto = z.infer<typeof TrackDetailDto>;
