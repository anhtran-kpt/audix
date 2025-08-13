import { z } from "zod";

export const followInput = z
  .object({
    artistId: z.cuid2(),
    follow: z.boolean(),
  })
  .strict();

export type FollowInput = z.infer<typeof followInput>;
