import z from "zod";
import { zCuidSchema } from "./shared-schema";
import {
  PlaybackContextTypeSchema,
  QueueItemKindSchema,
  RepeatModeSchema,
} from "./shared-enum";

export type zCuidType = z.infer<typeof zCuidSchema>;
export type PlaybackContextType = z.infer<typeof PlaybackContextTypeSchema>;
export type RepeatMode = z.infer<typeof RepeatModeSchema>;
export type QueueItemKind = z.infer<typeof QueueItemKindSchema>;
