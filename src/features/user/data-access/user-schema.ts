import { FullPlaylistSchema } from "@/features/playlist/contracts/playlist-schema";
import {
  zCuidSchema,
  zDateSchema,
  zStringSchema,
  zTimeStamps,
} from "@/features/shared/contracts/shared-schema";
import z from "zod";

export const BaseUserSchema = z.object({
  id: zCuidSchema,
  email: z.email().nullish(),
  name: zStringSchema.nullish(),
  image: zStringSchema.nullish(),
  emailVerified: zDateSchema.nullish(),
  ...zTimeStamps,
});

export const FullUserSchema = BaseUserSchema.extend({
  playlists: z.lazy(() => FullPlaylistSchema.array()),
});
