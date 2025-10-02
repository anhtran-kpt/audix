import z from "zod";
import {
  NextPlaybackOutputSchema,
  ClientPlaybackSessionSchema,
  PreviousPlaybackInputSchema,
  PreviousPlaybackOutputSchema,
  RepeatPlaybackInputSchema,
  RepeatPlaybackOutputSchema,
  ShufflePlaybackInputSchema,
  ShufflePlaybackOutputSchema,
  StartPlaybackInputSchema,
  VolumePlaybackInputSchema,
  ServerPlaybackSessionSchema,
} from "./playback-schema";

export type ClientPlaybackSession = z.infer<typeof ClientPlaybackSessionSchema>;
export type ServerPlaybackSession = z.infer<typeof ServerPlaybackSessionSchema>;
export type VolumePlaybackInput = z.infer<typeof VolumePlaybackInputSchema>;
export type StartPlaybackInput = z.infer<typeof StartPlaybackInputSchema>;
export type NextPlaybackOutput = z.infer<typeof NextPlaybackOutputSchema>;
export type PreviousPlaybackInput = z.infer<typeof PreviousPlaybackInputSchema>;
export type PreviousPlaybackOutput = z.infer<
  typeof PreviousPlaybackOutputSchema
>;
export type ShufflePlaybackInput = z.infer<typeof ShufflePlaybackInputSchema>;
export type ShufflePlaybackOutput = z.infer<typeof ShufflePlaybackOutputSchema>;
export type RepeatPlaybackInput = z.infer<typeof RepeatPlaybackInputSchema>;
export type RepeatPlaybackOutput = z.infer<typeof RepeatPlaybackOutputSchema>;
