import { SourceType } from "@/app/generated/prisma";
import { z } from "zod";

export const recordPlaySchema = z.object({
  userId: z.cuid2(),
  trackId: z.cuid2(),
  listenedSec: z.number().int().min(0),
  playedAt: z.coerce.date(),
  sourceType: z.enum(SourceType),
  sourceId: z.cuid2().optional().nullable(),
});

export type RecordPlayInput = z.infer<typeof recordPlaySchema>;
