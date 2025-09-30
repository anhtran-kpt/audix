import z from "zod";
import {
  NextPlaybackOutputSchema,
  PlaybackSessionExtendedSchema,
  PlaybackSessionSchema,
  PreviousPlaybackInputSchema,
  PreviousPlaybackOutputSchema,
  RepeatPlaybackInputSchema,
  RepeatPlaybackOutputSchema,
  ShufflePlaybackInputSchema,
  ShufflePlaybackOutputSchema,
  StartPlaybackInputSchema,
  VolumePlaybackInputSchema,
} from "./playback-schema";

export type PlaybackSession = z.infer<typeof PlaybackSessionSchema>;
export type PlaybackSessionExtended = z.infer<
  typeof PlaybackSessionExtendedSchema
>;
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
