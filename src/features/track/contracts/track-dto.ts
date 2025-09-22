import {
  zCuidSchema,
  zDateSchema,
  zPublicIdSchema,
  zTimeStamps,
} from "@/features/shared/contracts/shared-dto";
import {
  ArtistRoleSchema,
  CreditRoleSchema,
} from "@/features/shared/contracts/shared-enum";
import z from "zod";

export const TrackBaseSchema = z.object({
  id: zCuidSchema,
  title: z.string().min(1),
  audioId: zPublicIdSchema,
  duration: z.number().int().nonnegative(),
  trackNumber: z.number().int().nonnegative(),
  lyrics: z.string().nullish(),
  isExplicit: z.boolean().optional(),
  playCount: z.number().int().nonnegative(),
  ...zTimeStamps,
});

export const FullTrackSchema = TrackBaseSchema.extend({
  album: z.object({
    id: zCuidSchema,
    imageId: zPublicIdSchema,
    title: z.string().min(1),
    artist: z.object({
      id: zCuidSchema,
      name: z.string().min(1),
      bannerId: zPublicIdSchema,
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
      artist: z.object({ id: zCuidSchema, name: z.string().min(1) }),
    })
  ),
  credits: z.array(
    z.object({
      id: zCuidSchema,
      name: z.string().min(1),
      order: z.number().int().nonnegative(),
      role: CreditRoleSchema,
      details: z.string().nullable(),
      artist: z.object({
        id: zCuidSchema,
        name: z.string().min(1),
      }),
    })
  ),
});

export const TrackItemSchema = FullTrackSchema.pick({
  id: true,
  title: true,
  isExplicit: true,
  duration: true,
}).extend({
  album: z.object({
    imageId: zCuidSchema,
  }),
  artists: z
    .object({
      artist: z.object({
        id: zCuidSchema,
        name: z.string(),
      }),
    })
    .array(),
});

export const NowPlayingTrackSchema = FullTrackSchema.pick({
  id: true,
  title: true,
  isExplicit: true,
}).extend({
  album: z.object({
    imageId: zCuidSchema,
    artist: z.object({
      id: zCuidSchema,
      name: z.string(),
      bio: z.string().optional(),
      bannerId: zCuidSchema,
    }),
  }),
  artists: z
    .object({
      role: ArtistRoleSchema,
      order: z.number().int().nonnegative(),
      artist: z.object({
        id: zCuidSchema,
        name: z.string(),
      }),
    })
    .array(),
  credits: z
    .object({
      id: zCuidSchema,
      name: z.string(),
      role: CreditRoleSchema,
      details: z.string().nullable(),
      order: z.number().int().nonnegative(),
      artist: z
        .object({
          name: z.string(),
          id: zCuidSchema.nullable(),
        })
        .nullable(),
    })
    .array(),
});

export const TrackListItemSchema = FullTrackSchema.pick({
  id: true,
  title: true,
  isExplicit: true,
  playCount: true,
  duration: true,
}).extend({
  album: z.object({
    id: zCuidSchema,
    title: z.string(),
    imageId: zCuidSchema,
  }),
  artists: z
    .object({
      artist: z.object({
        id: zCuidSchema,
        name: z.string(),
      }),
    })
    .array(),
  addedAt: zDateSchema,
});

export const RecommendedTrackItemSchema = FullTrackSchema.pick({
  id: true,
  title: true,
  isExplicit: true,
  playCount: true,
  duration: true,
}).extend({
  album: z.object({
    id: zCuidSchema,
    title: z.string(),
    imageId: zCuidSchema,
  }),
  artists: z
    .object({
      artist: z.object({
        id: zCuidSchema,
        name: z.string(),
      }),
    })
    .array(),
  addedAt: zDateSchema,
});

export const TrackCreditSchema = FullTrackSchema.pick({
  title: true,
  artists: true,
  credits: true,
});

export const MiniTrackItemSchema = FullTrackSchema.pick({
  id: true,
  title: true,
  artists: true,
  isExplicit: true,
  album: true,
});

export type MiniTrackItem = z.infer<typeof MiniTrackItemSchema>;
export type TrackCredit = z.infer<typeof TrackCreditSchema>;
export type RecommendedTrackItem = z.infer<typeof RecommendedTrackItemSchema>;
export type FullTrack = z.infer<typeof FullTrackSchema>;
export type TrackItem = z.infer<typeof TrackItemSchema>;
export type TrackListItem = z.infer<typeof TrackListItemSchema>;
export type NowPlayingTrack = z.infer<typeof NowPlayingTrackSchema>;
