import {
  ArtistRoleSchema,
  CreditRoleSchema,
} from "@/features/shared/contracts/shared-enum";
import {
  TrackArtistSchema,
  TrackCreditSchema,
  TrackGenreSchema,
} from "@/features/shared/contracts/shared-relation";
import {
  zBoolSchema,
  zCuidSchema,
  zDateSchema,
  zIntSchema,
  zPublicIdSchema,
  zStringSchema,
  zTimeStamps,
} from "@/features/shared/contracts/shared-schema";
import { BaseAlbumSchema } from "@/features/album/contracts/album-schema";
import z from "zod";
import { BaseArtistSchema } from "@/features/artist/contracts/artist-schema";

export const BaseTrackSchema = z.object({
  id: zCuidSchema,
  title: zStringSchema,
  audioId: zPublicIdSchema,
  duration: zIntSchema,
  trackNumber: zIntSchema,
  lyrics: zStringSchema.nullish(),
  isExplicit: zBoolSchema,
  playCount: zIntSchema,
  albumId: zCuidSchema,
  ...zTimeStamps,
});

export const FullTrackSchema = BaseTrackSchema.extend({
  album: BaseAlbumSchema,
  artists: TrackArtistSchema.array(),
  credits: TrackCreditSchema.array(),
  genres: TrackGenreSchema.array(),
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
      order: zIntSchema,
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
      order: zIntSchema,
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
      role: ArtistRoleSchema,
      order: zIntSchema,
    })
    .array(),
  addedAt: zDateSchema.optional(),
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
  addedAt: zDateSchema.optional(),
});

export const MiniTrackItemSchema = FullTrackSchema.pick({
  id: true,
  title: true,
  artists: true,
  isExplicit: true,
  album: true,
});

export const TrackItemCompactSchema = FullTrackSchema.pick({
  id: true,
  title: true,
  isExplicit: true,
}).extend({
  album: BaseAlbumSchema.pick({
    id: true,
    title: true,
    imageId: true,
  }),
  artists: BaseArtistSchema.pick({
    id: true,
    name: true,
  }).array(),
});

export const TrackItemDetailedSchema = TrackItemCompactSchema.extend(
  FullTrackSchema.pick({
    duration: true,
    playCount: true,
  }).shape
).extend({
  addedAt: zDateSchema.optional(),
});
