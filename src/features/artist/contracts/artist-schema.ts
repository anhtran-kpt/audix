import z from "zod";
import {
  zBoolSchema,
  zCuidSchema,
  zIntSchema,
  zPublicIdSchema,
  zStringSchema,
  zTimeStamps,
} from "@/features/shared/contracts/shared-schema";
import { BaseAlbumSchema } from "@/features/album/contracts/album-schema";
import {
  ArtistGenreSchema,
  TrackArtistSchema,
  TrackCreditSchema,
} from "@/features/shared/contracts/shared-relation";

export const BaseArtistSchema = z.object({
  id: zCuidSchema,
  name: zStringSchema,
  bio: zStringSchema.nullish(),
  imageId: zPublicIdSchema,
  bannerId: zPublicIdSchema,
  isVerified: zBoolSchema.nullish(),
  followersCount: zIntSchema,
  ...zTimeStamps,
});

export const FullArtistSchema = BaseArtistSchema.extend({
  albums: z.lazy(() => BaseAlbumSchema.array()),
  tracks: z.lazy(() => TrackArtistSchema.array()),
  genres: z.lazy(() => ArtistGenreSchema.array()),
  credits: z.lazy(() => TrackCreditSchema.array()),
});

export const SidebarArtistSchema = BaseArtistSchema.pick({
  id: true,
  name: true,
  imageId: true,
});

export const FollowStatusSchema = BaseArtistSchema.pick({
  followersCount: true,
}).extend({
  isFollowing: zBoolSchema,
});

export const ArtistGridItemSchema = BaseArtistSchema.pick({
  id: true,
  name: true,
  imageId: true,
});
