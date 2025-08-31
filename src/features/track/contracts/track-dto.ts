import {
  zCuid,
  zDate,
  zPublicId,
  zTimeStamps,
} from "@/features/shared/contracts/shared-dto";
import {
  ArtistRoleSchema,
  CreditRoleSchema,
  PlaybackContextTypeSchema,
} from "@/features/shared/contracts/shared-enum";
import z from "zod";

export const TrackBaseSchema = z.object({
  id: zCuid,
  title: z.string().min(1),
  audioId: zPublicId,
  duration: z.number().int().nonnegative(),
  trackNumber: z.number().int().nonnegative(),
  lyrics: z.string().nullish(),
  isExplicit: z.boolean().optional(),
  playCount: z.number().int().nonnegative(),
  ...zTimeStamps,
});

export const FullTrackSchema = TrackBaseSchema.extend({
  album: z.object({
    id: zCuid,
    imageId: zPublicId,
    title: z.string().min(1),
    artist: z.object({
      id: zCuid,
      name: z.string().min(1),
      bannerId: zPublicId,
      bio: z.string().nullish(),
    }),
    _count: z.object({
      likedBy: z.number().int().nonnegative(),
    }),
  }),
  artists: z.array(
    z.object({
      role: ArtistRoleSchema,
      order: z.number().int().nonnegative(),
      artist: z.object({ id: zCuid, name: z.string().min(1) }),
    })
  ),
  credits: z.array(
    z.object({
      id: zCuid,
      name: z.string().min(1),
      order: z.number().int().nonnegative(),
      role: CreditRoleSchema,
      details: z.string().nullable(),
      artist: z.object({
        id: zCuid,
        name: z.string().min(1),
      }),
    })
  ),
});

export type FullTrack = z.infer<typeof FullTrackSchema>;

export const RecordPlayInputSchema = z.object({
  userId: zCuid,
  trackId: zCuid,
  listenedSec: z.number().int().min(30),
  playedAt: zDate,
  sourceType: PlaybackContextTypeSchema,
  sourceId: zCuid.nullish(),
  snapshotId: z.string().optional(),
});

export type RecordPlayInput = z.infer<typeof RecordPlayInputSchema>;
