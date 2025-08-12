import { z } from "zod";
import { LimitedText } from "@/features/_shared/schemas/common";

export const playlistCreateInput = z
  .object({
    title: LimitedText(3, 120),
    description: z.string().trim().max(500).optional().or(z.literal("")),
    isPublic: z.boolean().default(true),
  })
  .strict();

export type PlaylistCreateInput = z.input<typeof playlistCreateInput>;
export type PlaylistCreateData = z.output<typeof playlistCreateInput>;

export const playlistUpdateInput = z
  .object({
    title: LimitedText(3, 120).optional(),
    description: z.string().trim().max(500).optional(),
    isPublic: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

export type PlaylistUpdateInput = z.infer<typeof playlistUpdateInput>;
